import { Star, ShoppingCart, Heart, Minus, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import type { ApiProduct } from '@/services/types';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useGuestCartStore } from '@/store/guestCartStore';
import { useWishlistStore } from '@/store/wishlistStore';

interface Props {
  product: ApiProduct | null;
  open: boolean;
  onClose: () => void;
}

const QuickViewModal = ({ product, open, onClose }: Props) => {
  const nav = useNavigate();
  const user = useAuthStore(s => s.user);
  const add = useCartStore(s => s.add);
  const guestAdd = useGuestCartStore(s => s.add);
  const [qty, setQty] = useState(1);
  const wishlistIds = useWishlistStore(s => s.ids);
  const toggleWishlist = useWishlistStore(s => s.toggle);

  if (!product) return null;

  const isWishlisted = wishlistIds.includes(product._id);
  const discountPct = Math.max(0, Math.min(100, Number(product.discount || 0)));
  const originalPrice = discountPct > 0 ? Number((product.price / (1 - discountPct / 100)).toFixed(2)) : product.price;
  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80';

  const handleAdd = () => {
    if ((product.stock || 0) <= 0) {
      toast.error("Out of stock");
      return;
    }
    if (!user) {
      guestAdd(product._id, qty);
      toast.success('Saved to guest cart. Sign in to sync.');
      nav('/auth');
      return;
    }
    add(product._id, qty)
      .then(() => {
        toast.success(`${qty}x ${product.name} added to cart`);
        setQty(1);
        onClose();
      })
      .catch((err) => toast.error(err?.message || 'Failed to add to cart'));
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl md:grid-cols-2"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-20 rounded-full bg-background/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-accent"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-secondary">
              <img
                src={image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              {discountPct >= 30 && (
                <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  Hot Deal
                </span>
              )}
              {discountPct > 0 && (
                <span className="absolute right-3 top-3 rounded-full bg-foreground px-2 py-1 text-xs font-bold text-background">
                  -{Math.round(discountPct)}%
                </span>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col justify-between p-6">
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">{product.category}</p>
                <h3 className="mb-3 text-xl font-bold leading-tight">{product.name}</h3>

                <div className="mb-3 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="text-sm font-semibold">{Number(product.ratings || 0).toFixed(1)}</span>
                  </div>
                </div>

                <div className="mb-4 flex items-baseline gap-3">
                  <span className="text-2xl font-bold">${product.price}</span>
                  {discountPct > 0 && (
                    <>
                      <span className="text-base text-muted-foreground line-through">${originalPrice}</span>
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                        Save ${(originalPrice - product.price).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>

                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  Brand: <span className="font-medium text-foreground">{product.brand}</span>
                </p>

                {product.stock <= 10 && (
                  <p className="mb-4 text-xs font-semibold text-warning">Only {product.stock} left in stock.</p>
                )}
              </div>

              <div className="space-y-3">
                {/* Qty selector */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Qty:</span>
                  <div className="flex items-center rounded-lg border border-border">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-[2rem] text-center text-sm font-semibold">{qty}</span>
                    <button
                      onClick={() => setQty(Math.min(product.stock, qty + 1))}
                      className="px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={handleAdd}
                    disabled={(product.stock || 0) <= 0}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105"
                  >
                    <ShoppingCart className="h-4 w-4" /> {(product.stock || 0) <= 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                  <button
                    onClick={() => {
                      toggleWishlist(product._id);
                      toast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
                    }}
                    className="rounded-full border border-border p-2.5 transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-accent text-accent' : ''}`} />
                  </button>
                </div>

                <Link
                  to={`/product/${product._id}`}
                  onClick={onClose}
                  className="block text-center text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  View Full Details →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
