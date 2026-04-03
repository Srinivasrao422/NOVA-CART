import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const categories = [
  { name: 'Ethnic Wear', discount: '50-80% OFF', bg: 'bg-rose-50', text: 'text-red-600' },
  { name: 'Casual Wear', discount: '40-80% OFF', bg: 'bg-amber-50', text: 'text-red-600' },
  { name: "Men's Activewear", discount: '30-70% OFF', bg: 'bg-slate-50', text: 'text-red-600' },
  { name: "Women's Activewear", discount: '30-70% OFF', bg: 'bg-green-50', text: 'text-red-600' },
  { name: 'Western Wear', discount: '40-80% OFF', bg: 'bg-pink-50', text: 'text-red-600' },
  { name: 'Sportswear', discount: '30-80% OFF', bg: 'bg-purple-50', text: 'text-red-600' },
  { name: 'Loungewear', discount: '30-60% OFF', bg: 'bg-blue-50', text: 'text-red-600' },
  { name: 'Innerwear', discount: 'UP TO 70% OFF', bg: 'bg-red-50', text: 'text-red-600' },
  { name: 'Lingerie', discount: 'UP TO 70% OFF', bg: 'bg-pink-50', text: 'text-red-600' },
  { name: 'Watches', discount: 'UP TO 80% OFF', bg: 'bg-yellow-50', text: 'text-red-600' },
  { name: 'Grooming', discount: 'UP TO 60% OFF', bg: 'bg-teal-50', text: 'text-red-600' },
  { name: 'Beauty & Makeup', discount: 'UP TO 60% OFF', bg: 'bg-fuchsia-50', text: 'text-red-600' },
];

const categoryImages: Record<string, string> = {
  'Ethnic Wear': 'https://images.unsplash.com/photo-1618886614638-80e3c103d31a?w=800&q=80',
  'Casual Wear': 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80',
  "Men's Activewear": 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80',
  "Women's Activewear": 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
  'Western Wear': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
  'Sportswear': 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
  'Loungewear': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80',
  'Innerwear': 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&q=80',
  'Lingerie': 'https://images.unsplash.com/photo-1613852348851-df1739db8201?w=800&q=80',
  'Watches': 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80',
  'Grooming': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
  'Beauty & Makeup': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
};

const ShopByCategory = () => {
  return (
    <section className="bg-secondary py-12">
      <div className="container">
        <div className="mb-8 text-center">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Shop by Category</h2>
          <p className="mt-2 text-sm text-muted-foreground">Best deals across all categories</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to="/shop"
                className={`group flex flex-col items-center overflow-hidden rounded-xl border border-border ${cat.bg} transition-all hover:shadow-lg`}
              >
                <div className="h-32 w-full overflow-hidden sm:h-40">
                  <img
                    src={categoryImages[cat.name]}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                {/* Info */}
                <div className="w-full bg-amber-100/80 px-3 py-3 text-center">
                  <p className="text-xs font-semibold text-foreground sm:text-sm">{cat.name}</p>
                  <p className={`text-base font-black ${cat.text} sm:text-lg`}>{cat.discount}</p>
                  <p className="text-[11px] font-semibold text-red-500 inline-flex items-center gap-1">Shop Now <ArrowRight className="h-3 w-3" /></p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
