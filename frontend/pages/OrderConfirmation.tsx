import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, Mail, ArrowRight, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface OrderData {
  orderId: string;
  total: string;
  email: string;
  items: number;
}

const OrderConfirmation = () => {
  const location = useLocation();
  const order = location.state as OrderData | null;
  const [copied, setCopied] = useState(false);

  const orderId = order?.orderId ?? 'NC-00000000-0000';
  const totalStr = order?.total ?? '$0.00';
  const email = order?.email ?? 'your email';
  const itemCount = order?.items ?? 0;

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const t = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(t);
    }
  }, [copied]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg text-center"
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10"
          >
            <CheckCircle2 className="h-10 w-10 text-success" />
          </motion.div>

          <h1 className="font-display text-3xl font-bold text-foreground">Order Confirmed!</h1>
          <p className="mt-2 text-muted-foreground">
            Thank you for your purchase. We've sent a confirmation to <span className="font-medium text-foreground">{email}</span>.
          </p>

          {/* Order details card */}
          <div className="mt-8 rounded-xl border border-border bg-card p-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Order ID</p>
                <p className="font-mono text-sm font-semibold text-foreground">{orderId}</p>
              </div>
              <button
                onClick={copyOrderId}
                className="flex items-center gap-1 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-4 border-t border-border pt-5">
              <div>
                <p className="text-xs text-muted-foreground">Items</p>
                <p className="text-sm font-semibold text-foreground">{itemCount}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-sm font-semibold text-foreground">{totalStr}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Est. Delivery</p>
                <p className="text-sm font-semibold text-foreground">3–7 days</p>
              </div>
            </div>
          </div>

          {/* Next steps */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="gap-2">
              <Link to="/tracking">
                <Package className="h-4 w-4" /> Track Order
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link to="/shop">
                Continue Shopping <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            A receipt has been sent to your email
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
