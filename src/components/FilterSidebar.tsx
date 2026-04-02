import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

interface FilterState {
  brands: string[];
  priceRange: [number, number];
  colors: string[];
  discountRange: string;
  sizes: string[];
}

interface FilterSidebarProps {
  category: string;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClose?: () => void;
}

const categoryFilters: Record<string, {
  brands: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
}> = {
  Men: {
    brands: ['Nike', 'Adidas', 'Puma', 'H&M', 'Zara', 'Levi\'s', 'US Polo', 'Allen Solly', 'Peter England', 'Roadster'],
    colors: [
      { name: 'Black', hex: '#000000' }, { name: 'White', hex: '#FFFFFF' }, { name: 'Navy', hex: '#1a237e' },
      { name: 'Grey', hex: '#9e9e9e' }, { name: 'Red', hex: '#e53935' }, { name: 'Blue', hex: '#1e88e5' },
      { name: 'Green', hex: '#43a047' }, { name: 'Beige', hex: '#d7ccc8' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  Women: {
    brands: ['Zara', 'H&M', 'Forever 21', 'Mango', 'W', 'Biba', 'FabIndia', 'Global Desi', 'Vero Moda', 'Only'],
    colors: [
      { name: 'Black', hex: '#000000' }, { name: 'White', hex: '#FFFFFF' }, { name: 'Pink', hex: '#e91e63' },
      { name: 'Red', hex: '#e53935' }, { name: 'Blue', hex: '#1e88e5' }, { name: 'Yellow', hex: '#fdd835' },
      { name: 'Green', hex: '#43a047' }, { name: 'Purple', hex: '#8e24aa' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  Kids: {
    brands: ['H&M Kids', 'Zara Kids', 'Carter\'s', 'UCB Kids', 'Max Kids', 'Marks & Spencer', 'GAP Kids', 'Mothercare'],
    colors: [
      { name: 'Red', hex: '#e53935' }, { name: 'Blue', hex: '#1e88e5' }, { name: 'Pink', hex: '#e91e63' },
      { name: 'Yellow', hex: '#fdd835' }, { name: 'Green', hex: '#43a047' }, { name: 'White', hex: '#FFFFFF' },
    ],
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y', '12-13Y'],
  },
  Beauty: {
    brands: ['Maybelline', 'L\'Oreal', 'Lakme', 'MAC', 'Nykaa', 'The Body Shop', 'Neutrogena', 'Garnier', 'Cetaphil'],
    colors: [
      { name: 'Nude', hex: '#d4a574' }, { name: 'Red', hex: '#e53935' }, { name: 'Pink', hex: '#e91e63' },
      { name: 'Coral', hex: '#ff7043' }, { name: 'Berry', hex: '#880e4f' }, { name: 'Brown', hex: '#6d4c41' },
    ],
    sizes: [],
  },
  GenZ: {
    brands: ['Bewakoof', 'The Souled Store', 'Snitch', 'Urbanic', 'Shein', 'Bonkers Corner', 'Sassafras', 'Tokyo Talkies'],
    colors: [
      { name: 'Black', hex: '#000000' }, { name: 'White', hex: '#FFFFFF' }, { name: 'Neon Green', hex: '#76ff03' },
      { name: 'Purple', hex: '#8e24aa' }, { name: 'Tie Dye', hex: '#e040fb' }, { name: 'Pastel', hex: '#b3e5fc' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  Studio: {
    brands: ['Nike', 'Adidas', 'Puma', 'Zara', 'H&M', 'Mango', 'Uniqlo'],
    colors: [
      { name: 'Black', hex: '#000000' }, { name: 'White', hex: '#FFFFFF' }, { name: 'Beige', hex: '#d7ccc8' },
      { name: 'Navy', hex: '#1a237e' }, { name: 'Olive', hex: '#827717' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
  },
};

const discountOptions = [
  { label: '10% and above', value: '10' },
  { label: '20% and above', value: '20' },
  { label: '30% and above', value: '30' },
  { label: '40% and above', value: '40' },
  { label: '50% and above', value: '50' },
  { label: '60% and above', value: '60' },
  { label: '70% and above', value: '70' },
];

const priceRanges = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹1000', min: 500, max: 1000 },
  { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
  { label: '₹2000 - ₹5000', min: 2000, max: 5000 },
  { label: '₹5000+', min: 5000, max: 99999 },
];

const FilterSection = ({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border py-4">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between text-sm font-semibold uppercase tracking-wide text-foreground">
        {title}
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
};

const FilterSidebar = ({ category, filters, onFiltersChange, onClose }: FilterSidebarProps) => {
  const config = categoryFilters[category] || categoryFilters['Men'];

  const toggleBrand = (brand: string) => {
    const brands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    onFiltersChange({ ...filters, brands });
  };

  const toggleColor = (color: string) => {
    const colors = filters.colors.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...filters.colors, color];
    onFiltersChange({ ...filters, colors });
  };

  const toggleSize = (size: string) => {
    const sizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size];
    onFiltersChange({ ...filters, sizes });
  };

  const setPriceRange = (min: number, max: number) => {
    onFiltersChange({ ...filters, priceRange: [min, max] });
  };

  const setDiscount = (value: string) => {
    onFiltersChange({ ...filters, discountRange: filters.discountRange === value ? '' : value });
  };

  const clearAll = () => {
    onFiltersChange({ brands: [], priceRange: [0, 99999], colors: [], discountRange: '', sizes: [] });
  };

  const activeCount = filters.brands.length + filters.colors.length + filters.sizes.length +
    (filters.discountRange ? 1 : 0) + (filters.priceRange[0] > 0 || filters.priceRange[1] < 99999 ? 1 : 0);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Filters {activeCount > 0 && <span className="ml-1 rounded-full bg-accent px-2 py-0.5 text-[10px] text-accent-foreground">{activeCount}</span>}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{category}</p>
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button onClick={clearAll} className="text-xs font-medium text-accent hover:underline">Clear All</button>
          )}
          {onClose && (
            <button onClick={onClose} className="rounded-full p-1 hover:bg-secondary lg:hidden">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Brand */}
      <FilterSection title="Brand">
        <div className="max-h-48 space-y-2 overflow-y-auto">
          {config.brands.map(brand => (
            <label key={brand} className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="h-4 w-4 rounded border-border accent-accent"
              />
              {brand}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-2">
          {priceRanges.map(range => (
            <label key={range.label} className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <input
                type="radio"
                name="price"
                checked={filters.priceRange[0] === range.min && filters.priceRange[1] === range.max}
                onChange={() => setPriceRange(range.min, range.max)}
                className="h-4 w-4 accent-accent"
              />
              {range.label}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Color */}
      <FilterSection title="Color">
        <div className="flex flex-wrap gap-2">
          {config.colors.map(color => (
            <button
              key={color.name}
              onClick={() => toggleColor(color.name)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                filters.colors.includes(color.name)
                  ? 'border-accent bg-accent/10 text-foreground'
                  : 'border-border text-muted-foreground hover:border-accent/50'
              }`}
            >
              <span
                className="h-3 w-3 rounded-full border border-border"
                style={{ backgroundColor: color.hex }}
              />
              {color.name}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Discount Range */}
      <FilterSection title="Discount Range">
        <div className="space-y-2">
          {discountOptions.map(opt => (
            <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <input
                type="radio"
                name="discount"
                checked={filters.discountRange === opt.value}
                onChange={() => setDiscount(opt.value)}
                className="h-4 w-4 accent-accent"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Size */}
      {config.sizes.length > 0 && (
        <FilterSection title="Size">
          <div className="flex flex-wrap gap-2">
            {config.sizes.map(size => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  filters.sizes.includes(size)
                    ? 'border-accent bg-accent text-accent-foreground'
                    : 'border-border text-muted-foreground hover:border-accent/50'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </FilterSection>
      )}
    </div>
  );
};

export default FilterSidebar;
export type { FilterState };
