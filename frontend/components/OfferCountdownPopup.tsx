import { useState, useEffect } from 'react';
import { X, Flame, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const offers = [
  { title: 'Flash Sale: 50% OFF', description: 'On all electronics & gadgets', code: 'FLASH50', color: 'from-red-500 to-orange-500' },
  { title: 'Buy 2 Get 1 Free', description: 'On fashion accessories', code: 'B2G1', color: 'from-purple-500 to-pink-500' },
  { title: 'Extra 30% OFF', description: 'On orders above ₹2000', code: 'EXTRA30', color: 'from-emerald-500 to-teal-500' },
];

const OfferCountdownPopup = () => {
  const [show, setShow] = useState(false);
  const [offerIndex, setOfferIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 30, seconds: 0 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('offer_popup_dismissed');
    if (dismissed) return;
    const timer = setTimeout(() => setShow(true), 12000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!show) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) return { hours: 0, minutes: 0, seconds: 0 };
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [show]);

  useEffect(() => {
    if (!show) return;
    const rotate = setInterval(() => {
      setOfferIndex(prev => (prev + 1) % offers.length);
    }, 5000);
    return () => clearInterval(rotate);
  }, [show]);

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem('offer_popup_dismissed', 'true');
  };

  const copyCode = () => {
    navigator.clipboard.writeText(offers[offerIndex].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pad = (n: number) => n.toString().padStart(2, '0');
  const offer = offers[offerIndex];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="fixed bottom-6 right-6 z-[90] w-80"
        >
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            {/* Gradient header */}
            <div className={`bg-gradient-to-r ${offer.color} px-4 py-3 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 animate-pulse" />
                  <span className="text-sm font-bold">Limited Time Offer!</span>
                </div>
                <button onClick={dismiss} className="rounded-full p-1 hover:bg-white/20">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={offerIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h4 className="text-lg font-bold text-foreground">{offer.title}</h4>
                  <p className="mt-1 text-xs text-muted-foreground">{offer.description}</p>
                </motion.div>
              </AnimatePresence>

              {/* Countdown */}
              <div className="mt-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-destructive" />
                <span className="text-xs font-medium text-muted-foreground">Ends in:</span>
                <div className="flex gap-1">
                  {[
                    { value: pad(timeLeft.hours), label: 'H' },
                    { value: pad(timeLeft.minutes), label: 'M' },
                    { value: pad(timeLeft.seconds), label: 'S' },
                  ].map((t, i) => (
                    <div key={i} className="flex items-center gap-0.5">
                      <span className="rounded bg-foreground px-1.5 py-0.5 text-sm font-bold tabular-nums text-background">
                        {t.value}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{t.label}</span>
                      {i < 2 && <span className="mx-0.5 text-muted-foreground">:</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Coupon code */}
              <div className="mt-4 flex items-center gap-2">
                <div className="flex-1 rounded-lg border border-dashed border-accent bg-accent/5 px-3 py-2 text-center">
                  <span className="text-sm font-bold tracking-wider text-accent">{offer.code}</span>
                </div>
                <button
                  onClick={copyCode}
                  className="rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground transition-transform hover:scale-105 active:scale-95"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Dots */}
              <div className="mt-3 flex justify-center gap-1.5">
                {offers.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setOfferIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${i === offerIndex ? 'w-4 bg-accent' : 'w-1.5 bg-border'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfferCountdownPopup;
