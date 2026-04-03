import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const heroBanner = {
  title: 'Fashion Carnival',
  subtitle: "Sun's Out, Deals Are In!",
  discount: '50-80% OFF',
  date: 'Apr 1-12',
};

const dealCards = [
  { title: 'Western Arrivals', discount: 'Up to 60% Off', bg: 'from-rose-500 to-pink-600', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80' },
  { title: 'Classic Collection', discount: 'Starting ₹499', bg: 'from-slate-700 to-slate-900', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=80' },
  { title: 'Summer Wears', discount: 'Flat 50% Off', bg: 'from-amber-400 to-orange-500', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=80' },
  { title: 'Winter Wears', discount: '40-70% Off', bg: 'from-cyan-600 to-blue-700', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=1200&q=80' },
];

const NewArrivalsBanners = () => {
  return (
    <section className="py-10">
      <div className="container">
        <h2 className="mb-6 font-display text-xl font-bold md:text-2xl">New Arrivals & Discount Deals</h2>

        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <Link
            to="/shop"
            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 p-8 text-center shadow-xl md:flex-row md:justify-between md:p-12 md:text-left"
          >
            {/* Left side */}
            <div className="relative z-10 mb-4 md:mb-0">
              <div className="mb-2 inline-block rounded-xl bg-gradient-to-br from-orange-500 to-red-600 px-5 py-3 shadow-lg">
                <span className="block text-2xl font-black text-white md:text-3xl">FASHION</span>
                <span className="block text-3xl font-black text-white md:text-4xl">CARNIVAL</span>
                <span className="mt-1 inline-block rounded-md bg-emerald-600 px-3 py-0.5 text-xs font-bold text-white">
                  {heroBanner.date}
                </span>
              </div>
            </div>

            {/* Center decorative */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute left-1/4 top-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_center,_white_0%,_transparent_70%)]" />
            </div>

            {/* Right side */}
            <div className="relative z-10 text-center md:text-right">
              <p className="mb-1 text-lg font-semibold text-foreground/80 md:text-xl">{heroBanner.subtitle}</p>
              <p className="mb-4 text-4xl font-black text-foreground md:text-5xl">{heroBanner.discount}</p>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-foreground shadow-md transition-transform group-hover:scale-105">
                Shop Now <ArrowRight className="h-4 w-4" />
              </span>
            </div>

            {/* HIM / HER buttons */}
            <div className="mt-4 flex gap-4 md:absolute md:bottom-6 md:left-1/2 md:-translate-x-1/2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-md transition-transform hover:scale-105"
              >
                HIM <ArrowRight className="h-3 w-3" />
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-md transition-transform hover:scale-105"
              >
                HER <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </Link>
        </motion.div>

        {/* Deal Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dealCards.map((banner, i) => (
            <motion.div
              key={banner.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to="/shop"
                className={`group relative flex flex-col items-start justify-between overflow-hidden rounded-xl bg-gradient-to-br ${banner.bg} p-6 text-white shadow-lg transition-transform hover:scale-[1.02] min-h-[180px]`}
              >
                <img src={banner.image} alt={banner.title} className="absolute inset-0 h-full w-full object-cover opacity-25" />
                <div>
                  <span className="mb-1 inline-block rounded-full bg-white/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                    New Arrival
                  </span>
                  <h3 className="mt-2 text-lg font-bold">{banner.title}</h3>
                </div>
                <div className="mt-4 flex w-full items-center justify-between">
                  <span className="text-sm font-bold">{banner.discount}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsBanners;
