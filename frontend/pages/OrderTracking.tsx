import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle2, Clock, Search, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { orderApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import type { ApiOrder } from '@/services/types';

const statusIcon = (status: string) => {
  switch (status) {
    case 'delivered': return <CheckCircle2 className="h-5 w-5 text-success" />;
    case 'shipped': return <Truck className="h-5 w-5 text-accent" />;
    default: return <Clock className="h-5 w-5 text-warning" />;
  }
};

const OrderTracking = () => {
  const user = useAuthStore(s => s.user)!;
  const [trackingId, setTrackingId] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['orders-tracking', user.id],
    queryFn: async () => {
      const res = await orderApi.listByUserId(user.id);
      return res.data as ApiOrder[];
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const orders = data || [];
  const results = trackingId.trim()
    ? orders.filter(o => String(o._id).toLowerCase().includes(trackingId.trim().toLowerCase()))
    : orders;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border bg-secondary/50 py-12">
          <div className="container mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                <MapPin className="h-7 w-7 text-accent" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground">Track Your Order</h1>
              <p className="mt-2 text-muted-foreground">Enter your order ID to see real-time updates</p>
            </motion.div>

            <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-lg gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="e.g. NC-20260328-7842"
                  value={trackingId}
                  onChange={e => setTrackingId(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Track</Button>
            </form>
          </div>
        </section>

        {/* Results */}
        <section className="container mx-auto py-10">
          {isLoading ? (
            <div className="py-20 text-center text-muted-foreground">Loading orders…</div>
          ) : results.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              <Package className="mx-auto mb-4 h-12 w-12 opacity-40" />
              <p className="text-lg">No orders found for that tracking ID</p>
            </div>
          ) : (
            <div className="space-y-6">
              {results.map(order => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-sm text-muted-foreground">{order._id}</p>
                      <h3 className="mt-1 font-display text-lg font-semibold text-foreground">
                        {order.items?.[0]?.name ? `${order.items[0].name}${order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}` : 'Order'}
                      </h3>
                      <p className="text-sm text-muted-foreground">Total ${Number(order.totalAmount || 0).toFixed(2)}</p>
                      {order.estimatedDeliveryAt && (
                        <p className="text-xs text-muted-foreground">
                          Estimated delivery: {new Date(order.estimatedDeliveryAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium capitalize">
                      {statusIcon(order.status)}
                      {order.status}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="relative flex items-start justify-between gap-2">
                    {[
                      { label: 'Pending', done: true },
                      { label: 'Shipped', done: order.status === 'shipped' || order.status === 'delivered' },
                      { label: 'Delivered', done: order.status === 'delivered' },
                    ].map((step, i, arr) => (
                      <div key={i} className="relative z-10 flex flex-1 flex-col items-center text-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
                            step.done
                              ? 'border-accent bg-accent text-accent-foreground'
                              : 'border-border bg-background text-muted-foreground'
                          }`}
                        >
                          {step.done ? '✓' : i + 1}
                        </div>
                        <p className={`mt-2 text-xs font-medium ${step.done ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.label}
                        </p>
                        {/* connector line */}
                        {i < arr.length - 1 && (
                          <div
                            className={`absolute left-[calc(50%+16px)] top-4 h-0.5 ${
                              step.done ? 'bg-accent' : 'bg-border'
                            }`}
                            style={{ width: 'calc(100% - 32px)' }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OrderTracking;
