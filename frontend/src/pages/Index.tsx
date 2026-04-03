import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import TrustBadges from '@/components/TrustBadges';
import Testimonials from '@/components/Testimonials';
import DiscountPopup from '@/components/DiscountPopup';
import OfferCountdownPopup from '@/components/OfferCountdownPopup';
import PromoBanners from '@/components/PromoBanners';
import QuickViewModal from '@/components/QuickViewModal';
import BankOffers from '@/components/BankOffers';
import NewArrivalsBanners from '@/components/NewArrivalsBanners';
import ShopByCategory from '@/components/ShopByCategory';
import { productApi } from '@/services/api';
import type { ApiProduct } from '@/services/types';

const Index = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<ApiProduct | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['home-products'],
    queryFn: async () => {
      const res = await productApi.list({ page: '1', limit: '12', sort: '-createdAt' });
      return res as { success: true; data: ApiProduct[]; pagination: { page: number; limit: number; total: number; pages: number } };
    },
  });

  const list = data?.data ?? [];
  const featured = list.filter(p => Number(p.discount || 0) >= 30).slice(0, 4);
  const trending = list.slice(0, 8);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Announcement bar */}
      <div className="bg-accent py-2 text-center text-xs font-medium text-accent-foreground">
        <Zap className="mr-1 inline h-3 w-3" />
        Flash Sale — Up to 50% off on trending products! Free shipping on orders $50+
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground py-20 text-background md:py-32">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, hsl(225 90% 58% / 0.4), transparent 60%)' }} />
        <div className="container relative">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 inline-block rounded-full border border-background/20 px-4 py-1.5 text-xs font-medium tracking-wider uppercase"
            >
              New Season Collection
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 font-display text-4xl font-bold leading-tight md:text-6xl"
            >
              Discover Products<br />
              You'll <span className="text-gradient">Love</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 max-w-md text-base text-background/70 md:text-lg"
            >
              Curated trending products at unbeatable prices. Quality you can trust, delivered to your doorstep.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-sm font-semibold text-accent-foreground transition-all hover:scale-105 shadow-accent"
              >
                Shop Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full border border-background/20 px-8 py-3 text-sm font-semibold text-background transition-colors hover:bg-background/10"
              >
                View All Categories
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Promo Banners */}
      <section className="py-8">
        <div className="container">
          <PromoBanners />
        </div>
      </section>

      {/* New Arrivals & Deals */}
      <NewArrivalsBanners />

      <BankOffers />

      {/* Shop by Category */}
      <ShopByCategory />

      <TrustBadges />

      {/* All Products */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-8 font-display text-2xl font-bold md:text-3xl">Trending Now</h2>
          {isLoading ? (
            <div className="py-10 text-center text-muted-foreground">Loading products…</div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {trending.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} onQuickView={setQuickViewProduct} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Testimonials />

      {/* Newsletter */}
      <section className="bg-foreground py-16 text-background">
        <div className="container text-center">
          <h2 className="mb-3 font-display text-2xl font-bold md:text-3xl">Stay in the Loop</h2>
          <p className="mb-6 text-sm text-background/60">Get the latest deals and new arrivals straight to your inbox.</p>
          <div className="mx-auto flex max-w-md gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-full border border-background/20 bg-background/10 px-5 py-2.5 text-sm text-background placeholder:text-background/40 outline-none focus:border-accent"
            />
            <button className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
      <DiscountPopup />
      <OfferCountdownPopup />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        open={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default Index;
