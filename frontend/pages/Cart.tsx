import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PromoBanners from '@/components/PromoBanners';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { ApiCartItem, ApiProduct } from '@/services/types';

const Cart = () => {
  const user = useAuthStore(s => s.user)!;
  const { cart, isLoading, fetchCart, update, remove, applyCoupon } = useCartStore();
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    fetchCart(user.id);
  }, [fetchCart, user.id]);

  const items = cart?.items ?? [];
  const subtotal = cart?.totalAmount ?? 0;
  const delivery = cart?.deliveryCharge ?? 0;
  const discount = cart?.discount ?? 0;
  const total = cart?.finalAmount ?? 0;

  if (!isLoading && items.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container flex flex-col items-center justify-center py-24 text-center">
          <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/30" />
          <h1 className="mb-2 font-display text-2xl font-bold">Your cart is empty</h1>
          <p className="mb-6 text-sm text-muted-foreground">Looks like you haven't added anything yet.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-sm font-semibold text-accent-foreground shadow-accent"
          >
            Start Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-8">
        <h1 className="mb-6 font-display text-3xl font-bold">Shopping Cart</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {isLoading ? (
              <div className="py-12 text-center text-muted-foreground">Loading cart…</div>
            ) : (
            items.map((item: ApiCartItem, i) => {
              const prod = (typeof item.product === 'string' ? null : item.product) as ApiProduct | null;
              const pid = String(prod?._id || item.product);
              return (
              <motion.div
                key={pid}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 rounded-xl border border-border bg-card p-4"
              >
                <Link to={`/product/${pid}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-secondary">
                  <img src={prod?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'} alt={prod?.name || 'Product'} className="h-full w-full object-cover" />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link to={`/product/${pid}`} className="text-sm font-semibold hover:underline">{prod?.name || 'Product'}</Link>
                    <p className="text-xs text-muted-foreground">{prod?.category}</p>
                    {typeof prod?.stock === 'number' && prod.stock <= 5 && (
                      <p className="text-xs text-warning mt-1">Only {prod.stock} left in stock</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          update(pid, Math.max(1, item.quantity - 1)).catch((e) => toast.error(e?.message || 'Failed to update'));
                        }}
                        className="rounded-md border border-border p-1 hover:bg-secondary"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-[20px] text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => {
                          update(pid, item.quantity + 1).catch((e) => toast.error(e?.message || 'Failed to update'));
                        }}
                        className="rounded-md border border-border p-1 hover:bg-secondary"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold">${Number(item.subtotal || 0).toFixed(2)}</span>
                      <button
                        onClick={() => {
                          remove(pid).catch((e) => toast.error(e?.message || 'Failed to remove'));
                        }}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
              );
            }))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 font-display text-lg font-bold">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <Input
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="uppercase"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      const code = couponCode.trim();
                      if (!code) return;
                      applyCoupon(code)
                        .then(() => {
                          toast.success('Coupon applied');
                          setCouponCode('');
                        })
                        .catch((e) => toast.error(e?.message || 'Invalid coupon'));
                    }}
                  >
                    Apply
                  </Button>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${Number(subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-medium">{delivery === 0 ? 'Free' : `$${Number(delivery).toFixed(2)}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Discount</span>
                    <span className="font-medium">-${Number(discount).toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>${Number(total).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Link
                to="/checkout"
                className="mt-5 block w-full rounded-xl bg-accent py-3 text-center text-sm font-semibold text-accent-foreground shadow-accent transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Proceed to Checkout
              </Link>
              <Link to="/shop" className="mt-3 block text-center text-xs text-muted-foreground hover:text-foreground">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Promo Banners */}
      <section className="container pb-8">
        <h2 className="mb-4 font-display text-lg font-bold">You Might Also Like</h2>
        <PromoBanners />
      </section>
      <Footer />
    </div>
  );
};

export default Cart;
