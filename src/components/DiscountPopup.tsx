import { useState, useEffect } from 'react';
import { X, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DiscountPopup = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('popup_dismissed');
    if (dismissed) return;
    const timer = setTimeout(() => setShow(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem('popup_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
          onClick={dismiss}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center"
          >
            <button onClick={dismiss} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
              <Gift className="h-7 w-7 text-accent" />
            </div>
            <h3 className="mb-2 font-display text-2xl font-bold">Get 15% Off!</h3>
            <p className="mb-5 text-sm text-muted-foreground">
              Sign up for our newsletter and get 15% off your first order.
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              className="mb-3 w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
            <button
              onClick={dismiss}
              className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Claim My Discount
            </button>
            <p className="mt-3 text-xs text-muted-foreground">No spam, unsubscribe anytime.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DiscountPopup;
