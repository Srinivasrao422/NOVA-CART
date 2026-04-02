import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Package, Truck, CheckCircle2, Clock, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { orderApi } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import type { ApiOrder, ApiOrderStatus } from "@/services/types";

function statusMeta(status: ApiOrderStatus) {
  switch (status) {
    case "delivered":
      return { label: "Delivered", icon: CheckCircle2, className: "text-success" };
    case "shipped":
      return { label: "Shipped", icon: Truck, className: "text-accent" };
    default:
      return { label: "Pending", icon: Clock, className: "text-warning" };
  }
}

function stepsFor(status: ApiOrderStatus) {
  const shippedDone = status === "shipped" || status === "delivered";
  const deliveredDone = status === "delivered";
  return [
    { key: "pending", label: "Pending", done: true },
    { key: "shipped", label: "Shipped", done: shippedDone },
    { key: "delivered", label: "Delivered", done: deliveredDone },
  ] as const;
}

export default function Orders() {
  const user = useAuthStore((s) => s.user);
  const [q, setQ] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["orders", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const res = await orderApi.listByUserId(user!.id);
      return res.data as ApiOrder[];
    },
  });

  const filtered = useMemo(() => {
    const orders = data || [];
    if (!q.trim()) return orders;
    const s = q.trim().toLowerCase();
    return orders.filter((o) => String(o._id).toLowerCase().includes(s));
  }, [data, q]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-border bg-secondary/50 py-10">
          <div className="container">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground">Your Orders</h1>
                <p className="mt-1 text-sm text-muted-foreground">Track status from pending → shipped → delivered</p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  refetch();
                }}
                className="flex w-full gap-2 sm:max-w-md"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search by order id"
                    className="pl-10"
                  />
                </div>
                <Button type="submit" variant="outline">
                  Refresh
                </Button>
              </form>
            </div>
          </div>
        </section>

        <section className="container py-10">
          {isLoading ? (
            <div className="py-16 text-center text-muted-foreground">Loading orders…</div>
          ) : error ? (
            <div className="py-16 text-center">
              <p className="font-medium text-destructive">Failed to load orders</p>
              <p className="mt-1 text-sm text-muted-foreground">{(error as Error).message}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              <Package className="mx-auto mb-4 h-12 w-12 opacity-40" />
              <p className="text-lg font-medium">No orders yet</p>
              <p className="text-sm">Place an order from checkout to see it here.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filtered.map((order) => {
                const meta = statusMeta(order.status);
                const Icon = meta.icon;
                const steps = stepsFor(order.status);
                return (
                  <div key={order._id} className="rounded-xl border border-border bg-card p-6">
                    <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <img
                          src={order.items?.[0]?.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80"}
                          alt={order.items?.[0]?.name || "Product"}
                          className="h-14 w-14 rounded-md object-cover"
                        />
                        <div>
                        <p className="font-mono text-xs text-muted-foreground">{order._id}</p>
                        <p className="text-sm font-medium text-foreground line-clamp-1">{order.items?.[0]?.name || "Order item"}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Total: <span className="font-semibold text-foreground">${Number(order.totalAmount || 0).toFixed(2)}</span>
                        </p>
                        {order.estimatedDeliveryAt && (
                          <p className="text-xs text-muted-foreground">
                            Estimated delivery: {new Date(order.estimatedDeliveryAt).toLocaleDateString()}
                          </p>
                        )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium">
                        <Icon className={`h-5 w-5 ${meta.className}`} />
                        <span className="capitalize">{meta.label}</span>
                      </div>
                    </div>

                    <div className="relative flex items-start justify-between gap-2">
                      {steps.map((step, i) => (
                        <div key={step.key} className="relative z-10 flex flex-1 flex-col items-center text-center">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold ${
                              step.done ? "border-accent bg-accent text-accent-foreground" : "border-border bg-background text-muted-foreground"
                            }`}
                          >
                            {step.done ? "✓" : i + 1}
                          </div>
                          <p className={`mt-2 text-xs font-medium ${step.done ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                          {i < steps.length - 1 && (
                            <div
                              className={`absolute left-[calc(50%+16px)] top-4 h-0.5 ${step.done ? "bg-accent" : "bg-border"}`}
                              style={{ width: "calc(100% - 32px)" }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

