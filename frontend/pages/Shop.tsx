import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { productApi } from '@/services/api';
import type { ApiProduct } from '@/services/types';
import { useUiStore } from '@/store/uiStore';
import { useDebounce } from '@/hooks/useDebounce';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const megaCategory = searchParams.get('megaCategory') || '';

  const globalSearch = useUiStore(s => s.searchQuery);
  const setGlobalSearch = useUiStore(s => s.setSearchQuery);
  const debouncedSearch = useDebounce(globalSearch, 300);

  const [category, setCategory] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [discount, setDiscount] = useState<string>('');
  const [sort, setSort] = useState<string>('-createdAt');
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(12);
  const [quickViewProduct, setQuickViewProduct] = useState<ApiProduct | null>(null);
  const [showFilters, setShowFilters] = useState(!!megaCategory);

  const activeMegaCategory = megaCategory || '';

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', { category, brand, minPrice, maxPrice, discount, search: debouncedSearch, page, limit, sort }],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: String(page),
        limit: String(limit),
        sort,
      };
      if (category) params.category = category;
      if (brand) params.brand = brand;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (discount) params.discount = discount;
      if (debouncedSearch?.trim()) params.search = debouncedSearch.trim();
      const res = await productApi.list(params);
      return res as {
        success: true;
        data: ApiProduct[];
        pagination: { page: number; limit: number; total: number; pages: number };
      };
    },
  });

  const products = data?.data ?? [];
  const pagination = data?.pagination ?? { page: 1, limit, pages: 1, total: 0 };

  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) set.add(p.category);
    return Array.from(set).sort();
  }, [products]);

  const brandOptions = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) set.add(p.brand);
    return Array.from(set).sort();
  }, [products]);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Mega category filter bar */}
      {activeMegaCategory && (
        <div className="border-b border-border bg-secondary/50">
          <div className="container flex items-center gap-3 py-3">
            <span className="text-sm font-semibold text-foreground">{activeMegaCategory}</span>
            <span className="text-xs text-muted-foreground">|</span>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent hover:bg-accent/20"
            >
              <SlidersHorizontal className="h-3 w-3" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>
      )}

      <div className="container py-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold">
            {activeMegaCategory ? `${activeMegaCategory} Collection` : 'Shop All Products'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLoading ? 'Loading products…' : `${pagination.total ?? products.length} products`}
          </p>
        </div>

        <div className="flex gap-6">
          {/* Filter Sidebar */}
          {showFilters && (
            <div className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-20 rounded-xl border border-border bg-card p-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Search</p>
                    <Input
                      value={globalSearch}
                      onChange={(e) => { setPage(1); setGlobalSearch(e.target.value); }}
                      placeholder="Search products…"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</p>
                    <select
                      value={category}
                      onChange={(e) => { setPage(1); setCategory(e.target.value); }}
                      className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">All</option>
                      {categoryOptions.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Brand</p>
                    <select
                      value={brand}
                      onChange={(e) => { setPage(1); setBrand(e.target.value); }}
                      className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">All</option>
                      {brandOptions.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Min</p>
                      <Input value={minPrice} onChange={(e) => { setPage(1); setMinPrice(e.target.value); }} placeholder="0" className="mt-2" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Max</p>
                      <Input value={maxPrice} onChange={(e) => { setPage(1); setMaxPrice(e.target.value); }} placeholder="9999" className="mt-2" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Discount (min %)</p>
                    <Input value={discount} onChange={(e) => { setPage(1); setDiscount(e.target.value); }} placeholder="10" className="mt-2" />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCategory('');
                      setBrand('');
                      setMinPrice('');
                      setMaxPrice('');
                      setDiscount('');
                      setPage(1);
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Mobile filter overlay */}
          {showFilters && (
            <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm lg:hidden" onClick={() => setShowFilters(false)}>
              <div className="absolute left-0 top-0 h-full w-80 overflow-y-auto bg-background p-5" onClick={e => e.stopPropagation()}>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold">Filters</p>
                  <button onClick={() => setShowFilters(false)} className="rounded-full p-2 hover:bg-secondary">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  <Input
                    value={globalSearch}
                    onChange={(e) => { setPage(1); setGlobalSearch(e.target.value); }}
                    placeholder="Search products…"
                  />
                  <select
                    value={category}
                    onChange={(e) => { setPage(1); setCategory(e.target.value); }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">All categories</option>
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <select
                    value={brand}
                    onChange={(e) => { setPage(1); setBrand(e.target.value); }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">All brands</option>
                    {brandOptions.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <Input value={minPrice} onChange={(e) => { setPage(1); setMinPrice(e.target.value); }} placeholder="Min price" />
                    <Input value={maxPrice} onChange={(e) => { setPage(1); setMaxPrice(e.target.value); }} placeholder="Max price" />
                  </div>
                  <Input value={discount} onChange={(e) => { setPage(1); setDiscount(e.target.value); }} placeholder="Min discount %" />
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCategory('');
                      setBrand('');
                      setMinPrice('');
                      setMaxPrice('');
                      setDiscount('');
                      setPage(1);
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Main content */}
          <div className="flex-1">
            {/* Filters bar */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filter</span>
              </button>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="ml-auto rounded-lg border border-border bg-card px-3 py-1.5 text-xs outline-none"
              >
                <option value="-createdAt">Newest</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-ratings">Top Rated</option>
              </select>
            </div>

            {/* Product grid */}
            {isLoading ? (
              <div className="py-20 text-center text-muted-foreground">Loading…</div>
            ) : error ? (
              <div className="py-20 text-center">
                <p className="text-lg font-medium text-destructive">Failed to load products</p>
                <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
              </div>
            ) : products.length > 0 ? (
              <div className={`grid gap-4 md:gap-6 ${showFilters ? 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
                {products.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} onQuickView={setQuickViewProduct} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-lg font-medium text-muted-foreground">No products found</p>
                <p className="text-sm text-muted-foreground">Try a different search or filter</p>
              </div>
            )}

            {/* Pagination */}
            {products.length > 0 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  Prev
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page <span className="font-medium text-foreground">{page}</span> of{" "}
                  <span className="font-medium text-foreground">{pagination.pages ?? 1}</span>
                </span>
                <Button
                  variant="outline"
                  disabled={page >= (pagination.pages ?? 1)}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />

      <QuickViewModal product={quickViewProduct} open={!!quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
};

export default Shop;
