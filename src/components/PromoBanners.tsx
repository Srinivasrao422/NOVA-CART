import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const banners = [
  {
    id: 1,
    title: 'Wireless Earbuds Pro',
    subtitle: 'From $49.99',
    tagline: 'Best-selling audio under $50',
    bg: 'from-blue-50 to-indigo-100 dark:from-blue-950/40 dark:to-indigo-950/40',
    accent: 'text-blue-700 dark:text-blue-300',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&q=80',
  },
  {
    id: 2,
    title: 'Smart LED Desk Lamp',
    subtitle: 'From $34.99',
    tagline: 'Built-in wireless charger',
    bg: 'from-emerald-50 to-teal-100 dark:from-emerald-950/40 dark:to-teal-950/40',
    accent: 'text-emerald-700 dark:text-emerald-300',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&q=80',
  },
  {
    id: 3,
    title: 'Fitness Tracker Band',
    subtitle: 'From $39.99',
    tagline: 'Heart rate + GPS + 7-day battery',
    bg: 'from-violet-50 to-purple-100 dark:from-violet-950/40 dark:to-purple-950/40',
    accent: 'text-violet-700 dark:text-violet-300',
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&q=80',
  },
  {
    id: 4,
    title: 'Laptop Stand (Aluminum)',
    subtitle: 'From $27.99',
    tagline: 'Top rated — ergonomic design',
    bg: 'from-amber-50 to-orange-100 dark:from-amber-950/40 dark:to-orange-950/40',
    accent: 'text-amber-700 dark:text-amber-300',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80',
  },
];

const PromoBanners = () => {
  const [current, setCurrent] = useState(0);
  const visibleCount = typeof window !== 'undefined' && window.innerWidth >= 768 ? 3 : 1;

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % banners.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent(prev => (prev - 1 + banners.length) % banners.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  const getVisibleBanners = () => {
    const result = [];
    for (let i = 0; i < visibleCount; i++) {
      result.push(banners[(current + i) % banners.length]);
    }
    return result;
  };

  return (
    <div className="relative">
      <div className="flex gap-4 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {getVisibleBanners().map((banner) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.35 }}
              className={`flex-1 min-w-0 rounded-xl bg-gradient-to-br ${banner.bg} p-5 md:p-6`}
            >
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold uppercase tracking-wide ${banner.accent}`}>
                    NovaCart Deal
                  </p>
                  <h3 className="mt-1 text-base font-bold text-foreground md:text-lg truncate">
                    {banner.title}
                  </h3>
                  <p className={`mt-0.5 text-lg font-extrabold ${banner.accent} md:text-xl`}>
                    {banner.subtitle}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{banner.tagline}</p>
                </div>
                <div className="hidden h-20 w-20 shrink-0 overflow-hidden rounded-lg sm:block md:h-24 md:w-24">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-3 flex items-center justify-center gap-3">
        <button onClick={prev} className="rounded-full border border-border bg-card p-1.5 text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <div className="flex gap-1.5">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${i === current ? 'w-5 bg-accent' : 'w-1.5 bg-muted-foreground/30'}`}
            />
          ))}
        </div>
        <button onClick={next} className="rounded-full border border-border bg-card p-1.5 text-muted-foreground hover:text-foreground transition-colors">
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default PromoBanners;
