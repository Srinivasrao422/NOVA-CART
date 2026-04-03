import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import type { ApiProduct } from '@/services/types';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useGuestCartStore } from '@/store/guestCartStore';
import { useWishlistStore } from '@/store/wishlistStore';

interface Props {
  product: ApiProduct;
  index?: number;
  onQuickView?: (product: ApiProduct) => void;
}

const ProductCard = ({ product, index = 0, onQuickView }: Props) => {
  const nav = useNavigate();
  const user = useAuthStore(s => s.user);
  const add = useCartStore(s => s.add);
  const guestAdd = useGuestCartStore(s => s.add);
  const wishlistIds = useWishlistStore(s => s.ids);
  const toggleWishlist = useWishlistStore(s => s.toggle);
  const isWishlisted = wishlistIds.includes(product._id);
  const discountPct = Math.max(0, Math.min(100, Number(product.discount || 0)));
  const originalPrice = discountPct > 0 ? Number((product.price / (1 - discountPct / 100)).toFixed(2)) : product.price;
  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if ((product.stock || 0) <= 0) {
      toast.error('Out of stock');
      return;
    }
    if (!user) {
      guestAdd(product._id, 1);
      toast.success('Saved to guest cart. Sign in to sync.');
      nav('/auth');
      return;
    }
    add(product._id, 1)
      .then(() => toast.success(`${product.name} added to cart`))
      .catch((err) => toast.error(err?.message || 'Failed to add to cart'));
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id);
    toast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/product/${product._id}`} className="group block">
        <div className="hover-lift overflow-hidden rounded-xl border border-border bg-card">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-secondary">
            <img
              src={image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            {/* Badge */}
            {discountPct >= 30 && (
              <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                Hot Deal
              </span>
            )}
            {/* Discount */}
            {discountPct > 0 && (
              <span className="absolute right-3 top-3 rounded-full bg-foreground px-2 py-1 text-xs font-bold text-background">
                -{Math.round(discountPct)}%
              </span>
            )}
            {/* Quick actions */}
            <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {onQuickView && (
                <button
                  onClick={handleQuickView}
                  className="rounded-full bg-background/90 p-2 backdrop-blur-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  title="Quick View"
                >
                  <Eye className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={handleWishlist}
                className="rounded-full bg-background/90 p-2 backdrop-blur-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-accent text-accent' : ''}`} />
              </button>
              <button
                onClick={handleAddToCart}
                disabled={(product.stock || 0) <= 0}
                className="rounded-full bg-accent p-2 text-accent-foreground transition-transform hover:scale-110"
              >
                <ShoppingCart className="h-4 w-4" />
              </button>
            </div>
            {/* Low stock */}
            {product.stock <= 10 && (
              <div className="absolute bottom-3 left-3 rounded-full bg-warning/90 px-2 py-1 text-xs font-semibold text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                Only {product.stock} left!
              </div>
            )}
          </div>
          {/* Info */}
          <div className="p-4">
            <p className="mb-1 text-xs font-medium text-muted-foreground">{product.category}</p>
            <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug">{product.name}</h3>
            <div className="mb-2 flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              <span className="text-xs font-medium">{Number(product.ratings || 0).toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">${product.price}</span>
              {discountPct > 0 && (
                <span className="text-sm text-muted-foreground line-through">${originalPrice}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
