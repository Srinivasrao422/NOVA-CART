import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, CreditCard, Truck, ShieldCheck, ChevronDown, Smartphone, Wallet, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { orderApi } from '@/services/api';
import type { ApiCartItem, ApiProduct, ApiOrder } from '@/services/types';
import { z } from 'zod';

const Checkout = () => {
  const user = useAuthStore(s => s.user)!;
  const { cart, isLoading: cartLoading, fetchCart } = useCartStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const items = cart?.items ?? [];
  const subtotal = cart?.totalAmount ?? 0;
  const discount = cart?.discount ?? 0;
  const delivery = cart?.deliveryCharge ?? 0;
  const grandTotal = cart?.finalAmount ?? 0;

  const [form, setForm] = useState({
    email: '', firstName: '', lastName: '',
    address: '', apartment: '', city: '', state: '', zip: '', country: 'US',
    cardNumber: '', expiry: '', cvc: '', cardName: '',
    paymentMethod: 'card', upiId: '',
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    try {
      const schema = z.object({
        email: z.string().email(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        address: z.string().min(3),
        city: z.string().min(1),
        state: z.string().min(1),
        zip: z.string().min(3),
        country: z.string().min(2),
        paymentMethod: z.enum(['card', 'upi']),
        upiId: z.string().optional(),
      });
      const parsed = schema.safeParse(form);
      if (!parsed.success) throw new Error('Please fill all required fields');
      if (form.paymentMethod === 'upi' && !form.upiId.trim()) throw new Error('UPI ID is required');
      if (form.paymentMethod === 'upi' && !/^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/.test(form.upiId.trim())) {
        throw new Error('UPI ID must be like name@bank');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid input';
      toast({ title: 'Invalid checkout details', description: msg });
      setSubmitting(false);
      return;
    }
    const addressPayload = {
      line1: form.address,
      line2: form.apartment || undefined,
      city: form.city,
      state: form.state,
      zip: form.zip,
      country: form.country,
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
    };
    const paymentMethod = form.paymentMethod;
    orderApi
      .createFromCart({ paymentMethod, address: addressPayload, upiId: form.paymentMethod === 'upi' ? form.upiId.trim() : undefined })
      .then((res) => {
        const order = res.data;
        toast({ title: 'Order placed', description: 'Your order has been created successfully.' });
        fetchCart(user.id);
        navigate('/order-confirmation', {
          state: { orderId: (order as ApiOrder)._id, total: `$${Number((order as ApiOrder).totalAmount || grandTotal).toFixed(2)}`, email: form.email, items: items.reduce((s: number, i: ApiCartItem) => s + i.quantity, 0) },
        });
      })
      .catch((err) => {
        toast({ title: 'Checkout failed', description: err?.message || 'Please try again.' });
      })
      .finally(() => setSubmitting(false));
  };

  if (!cartLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container flex flex-col items-center justify-center py-24 text-center">
          <h1 className="mb-2 font-display text-2xl font-bold text-foreground">Nothing to checkout</h1>
          <p className="mb-6 text-sm text-muted-foreground">Add some items to your cart first.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-sm font-semibold text-accent-foreground">
            Go to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8">
        <Link to="/cart" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to cart
        </Link>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-5">
          {/* Left: Form */}
          <div className="space-y-8 lg:col-span-3">
            {/* Contact */}
            <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="mb-4 font-display text-xl font-bold text-foreground">Contact Information</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required placeholder="you@example.com" value={form.email} onChange={e => update('email', e.target.value)} />
                </div>
              </div>
            </motion.section>

            {/* Shipping */}
            <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <h2 className="mb-4 font-display text-xl font-bold text-foreground">Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" required placeholder="John" value={form.firstName} onChange={e => update('firstName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" required placeholder="Doe" value={form.lastName} onChange={e => update('lastName', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" required placeholder="123 Main St" value={form.address} onChange={e => update('address', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                  <Input id="apartment" placeholder="Apt 4B" value={form.apartment} onChange={e => update('apartment', e.target.value)} />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" required placeholder="New York" value={form.city} onChange={e => update('city', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" required placeholder="NY" value={form.state} onChange={e => update('state', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP code</Label>
                    <Input id="zip" required placeholder="10001" value={form.zip} onChange={e => update('zip', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <div className="relative">
                    <select
                      id="country"
                      value={form.country}
                      onChange={e => update('country', e.target.value)}
                      className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Payment */}
            <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="mb-4 font-display text-xl font-bold text-foreground">Payment</h2>
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  Secured with 256-bit SSL encryption
                </div>

                {/* Payment method tabs */}
                <div className="flex rounded-lg border border-border overflow-hidden">
                  <button
                    type="button"
                    onClick={() => update('paymentMethod', 'card')}
                    className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${form.paymentMethod === 'card' ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
                  >
                    <CreditCard className="mr-1.5 inline h-4 w-4" />
                    Card
                  </button>
                  <button
                    type="button"
                    onClick={() => update('paymentMethod', 'upi')}
                    className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${form.paymentMethod === 'upi' ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
                  >
                    <Smartphone className="mr-1.5 inline h-4 w-4" />
                    UPI
                  </button>
                </div>

                {form.paymentMethod === 'card' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on card</Label>
                      <Input id="cardName" placeholder="John Doe" value={form.cardName} onChange={e => update('cardName', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card number</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="cardNumber" placeholder="4242 4242 4242 4242" maxLength={19} className="pl-10" value={form.cardNumber} onChange={e => update('cardNumber', e.target.value)} />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry date</Label>
                        <Input id="expiry" placeholder="MM / YY" maxLength={7} value={form.expiry} onChange={e => update('expiry', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" maxLength={4} value={form.cvc} onChange={e => update('cvc', e.target.value)} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input id="upiId" placeholder="yourname@upi" value={form.upiId} onChange={e => update('upiId', e.target.value)} />
                      <p className="text-xs text-muted-foreground">Enter your UPI ID (e.g. name@paytm, name@gpay, name@phonepe)</p>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { app: 'Google Pay', icon: Wallet },
                        { app: 'PhonePe', icon: Smartphone },
                        { app: 'Paytm', icon: Wallet },
                        { app: 'BHIM', icon: Landmark },
                      ].map(({ app, icon: Icon }) => (
                        <button
                          key={app}
                          type="button"
                          onClick={() => update('upiId', `user@${app.toLowerCase().replace(/\s/g, '')}`)}
                          className="flex flex-col items-center gap-1.5 rounded-lg border border-border p-3 text-xs text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
                        >
                          <Icon className="h-4 w-4" />
                          {app}
                        </button>
                      ))}
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3 text-center">
                      <p className="text-xs text-muted-foreground">A payment request will be sent to your UPI app</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Submit (mobile) */}
            <div className="lg:hidden">
              <Button type="submit" disabled={submitting || cartLoading} className="w-full gap-2 py-6 text-base shadow-accent">
                <Lock className="h-4 w-4" />
                {submitting ? 'Placing order…' : `Pay $${Number(grandTotal).toFixed(2)}`}
              </Button>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-xl border border-border bg-card p-6"
              >
                <h3 className="mb-4 font-display text-lg font-bold text-foreground">Order Summary</h3>

                {/* Items */}
                <div className="max-h-60 space-y-3 overflow-y-auto pr-1">
                  {items.map((item: ApiCartItem) => {
                    const prod = (typeof item.product === 'string' ? null : item.product) as ApiProduct | null;
                    const pid = String(prod?._id || item.product);
                    return (
                      <div key={pid} className="flex items-center gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-secondary">
                        <img src={prod?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'} alt={prod?.name || 'Product'} className="h-full w-full object-cover" />
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{prod?.name || 'Product'}</p>
                        <p className="text-xs text-muted-foreground">{prod?.category}</p>
                      </div>
                      <p className="text-sm font-semibold text-foreground">${Number(item.subtotal || 0).toFixed(2)}</p>
                    </div>
                    );
                  })}
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">${Number(subtotal).toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Discount</span>
                      <span className="font-medium">-${Number(discount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-foreground">{delivery === 0 ? 'Free' : `$${Number(delivery).toFixed(2)}`}</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between text-base font-bold text-foreground">
                      <span>Total</span>
                      <span>${Number(grandTotal).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Submit (desktop) */}
                <Button type="submit" disabled={submitting || cartLoading} className="mt-5 hidden w-full gap-2 py-6 text-base shadow-accent lg:flex">
                  <Lock className="h-4 w-4" />
                  {submitting ? 'Placing order…' : `Pay $${Number(grandTotal).toFixed(2)}`}
                </Button>
              </motion.div>

              {/* Trust signals */}
              <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> Secure Checkout</span>
                <span className="inline-flex items-center gap-1"><Truck className="h-4 w-4" /> Free Shipping 50+</span>
                <span className="inline-flex items-center gap-1"><Lock className="h-4 w-4" /> SSL Encrypted</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
