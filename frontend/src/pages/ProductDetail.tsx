import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { toast } from 'sonner';
import { productApi } from '@/services/api';
import type { ApiProduct } from '@/services/types';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useNavigate } from 'react-router-dom';
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';

const ProductDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const user = useAuthStore(s => s.user);
  const add = useCartStore(s => s.add);
  const pushRecentlyViewed = useRecentlyViewedStore(s => s.push);
  const [quantity, setQuantity] = useState(1);
  const [countdown, setCountdown] = useState(3600);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('nova_cart_wishlist') || '[]');
    } catch {
      return [];
    }
  });

  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    enabled: !!id,
    queryFn: async () => {
      const res = await productApi.get(id!);
      return res as { success: true; data: ApiProduct };
    },
  });

  const product = data?.data ?? null;

  useEffect(() => {
    if (product?._id) pushRecentlyViewed(product._id);
  }, [product?._id, pushRecentlyViewed]);

  useEffect(() => {
    const timer = setInterval(() => setCountdown(c => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold">{isLoading ? 'Loading…' : 'Product not found'}</h1>
          <Link to="/shop" className="mt-4 inline-block text-accent hover:underline">Back to Shop</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product._id);
  const discountPct = Math.max(0, Math.min(100, Number(product.discount || 0)));
  const originalPrice = discountPct > 0 ? Number((product.price / (1 - discountPct / 100)).toFixed(2)) : product.price;
  const discount = discountPct > 0 ? Math.round(discountPct) : 0;
  const images = (product.images?.length ? product.images : [product.images?.[0]].filter(Boolean)) as string[] | undefined;
  const gallery = (images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80']) as string[];
  const heroImage = activeImage || gallery[0];
  const hours = Math.floor(countdown / 3600);
  const minutes = Math.floor((countdown % 3600) / 60);
  const seconds = countdown % 60;

  const handleBuyNow = () => {
    if (!user) {
      toast.error('Please sign in to continue');
      nav('/auth');
      return;
    }
    add(product._id, quantity)
      .then(() => {
        toast.success('Added to cart!');
        nav('/cart');
      })
      .catch((err) => toast.error(err?.message || 'Failed to add to cart'));
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-8">
        <Link to="/shop" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Back to Shop
        </Link>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {/* Image */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative overflow-hidden rounded-2xl bg-secondary aspect-square">
            <img src={heroImage} alt={product.name} className="h-full w-full object-cover" />
            {discountPct >= 30 && (
              <span className="absolute left-4 top-4 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground">Hot Deal</span>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{product.category}</p>
            <h1 className="mb-3 font-display text-2xl font-bold md:text-3xl">{product.name}</h1>
            <p className="mb-3 text-sm text-muted-foreground">
              Brand: <span className="font-medium text-foreground">{product.brand}</span>
            </p>

            <div className="mb-4 flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(Number(product.ratings || 0)) ? 'fill-warning text-warning' : 'text-border'}`} />
                ))}
              </div>
              <span className="text-sm font-medium">{Number(product.ratings || 0).toFixed(1)}</span>
            </div>

            <div className="mb-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold">${product.price}</span>
              {discountPct > 0 && (
                <>
                  <span className="text-lg text-muted-foreground line-through">${originalPrice}</span>
                  <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">Save {discount}%</span>
                </>
              )}
            </div>

            {/* Urgency */}
            <div className="mb-5 rounded-lg border border-border bg-secondary/50 p-3">
              <p className="mb-1.5 text-xs font-semibold text-destructive animate-pulse-soft">Limited-time deal ends in:</p>
              <div className="flex gap-2">
                {[
                  { val: hours, label: 'hrs' },
                  { val: minutes, label: 'min' },
                  { val: seconds, label: 'sec' },
                ].map(t => (
                  <div key={t.label} className="rounded-md bg-foreground px-3 py-1.5 text-center">
                    <span className="text-lg font-bold text-background">{String(t.val).padStart(2, '0')}</span>
                    <span className="ml-1 text-xs text-background/60">{t.label}</span>
                  </div>
                ))}
              </div>
              {product.stock <= 10 && (
                <p className="mt-2 text-xs font-medium text-warning">Only {product.stock} left in stock!</p>
              )}
            </div>

            {/* Gallery thumbnails */}
            {gallery.length > 1 && (
              <div className="mb-6 flex gap-2 overflow-x-auto">
                {gallery.map((src) => (
                  <button
                    key={src}
                    onClick={() => setActiveImage(src)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border ${heroImage === src ? 'border-accent' : 'border-border'} bg-secondary`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {product.description && (
              <p className="mb-6 text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            )}

            {/* Quantity + CTA */}
            <div className="mb-5 flex items-center gap-4">
              <div className="flex items-center rounded-lg border border-border">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-sm font-medium hover:bg-secondary">−</button>
                <span className="px-4 py-2 text-sm font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))} className="px-3 py-2 text-sm font-medium hover:bg-secondary">+</button>
              </div>
              <button
                onClick={() => {
                  const next = isWishlisted ? wishlist.filter(x => x !== product._id) : [...wishlist, product._id];
                  setWishlist(next);
                  localStorage.setItem('nova_cart_wishlist', JSON.stringify(next));
                  toast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
                }}
                className={`rounded-lg border p-2.5 transition-colors ${isWishlisted ? 'border-accent bg-accent/10 text-accent' : 'border-border hover:bg-secondary'}`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-accent' : ''}`} />
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  if ((product.stock || 0) <= 0) {
                    toast.error('Out of stock');
                    return;
                  }
                  if (!user) {
                    toast.error('Please sign in to add to cart');
                    nav('/auth');
                    return;
                  }
                  add(product._id, quantity)
                    .then(() => toast.success(`Added ${quantity} item(s) to cart`))
                    .catch((err) => toast.error(err?.message || 'Failed to add to cart'));
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-semibold transition-colors hover:bg-secondary"
              >
                <ShoppingCart className="h-4 w-4" /> {(product.stock || 0) <= 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-accent-foreground shadow-accent transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Buy Now
              </button>
            </div>

            {/* Trust signals */}
            <div className="mt-6 flex flex-col gap-2">
              {[
                { icon: Truck, text: 'Free shipping on orders over $50' },
                { icon: Shield, text: 'Secure checkout with SSL encryption' },
                { icon: RotateCcw, text: '30-day hassle-free returns' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon className="h-3.5 w-3.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related */}
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-bold">Explore more</h2>
          <RelatedProducts category={product.category} currentId={product._id} />
        </section>
      </div>

      {/* Sticky buy bar (mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl p-3 md:hidden">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-lg font-bold">${product.price}</p>
            {discountPct > 0 && <p className="text-xs text-muted-foreground line-through">${originalPrice}</p>}
          </div>
          <button
            onClick={handleBuyNow}
            className="flex-1 rounded-xl bg-accent py-3 text-sm font-semibold text-accent-foreground shadow-accent"
          >
            Buy Now
          </button>
        </div>
      </div>

      <div className="pb-20 md:pb-0">
        <Footer />
      </div>
    </div>
  );
};

export default ProductDetail;

const RelatedProducts = ({ category, currentId }: { category: string; currentId: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['related', category],
    queryFn: async () => {
      const res = await productApi.list({ category, page: '1', limit: '8', sort: '-createdAt' });
      return res as { success: true; data: ApiProduct[] };
    },
  });

  const related = (data?.data ?? []).filter(p => p._id !== currentId).slice(0, 4);
  if (isLoading) return <div className="py-8 text-center text-muted-foreground">Loading…</div>;
  if (related.length === 0) return <div className="py-8 text-center text-muted-foreground">No related products.</div>;
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      {related.map((p, i) => (
        <ProductCard key={p._id} product={p} index={i} />
      ))}
    </div>
  );
};
