import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const reviews = [
  { name: 'Sarah M.', text: 'Absolutely love the quality! The earbuds are amazing for the price. Will definitely order again.', rating: 5, avatar: 'S' },
  { name: 'James K.', text: 'Fast shipping and the product was exactly as described. NovaCart is now my go-to store.', rating: 5, avatar: 'J' },
  { name: 'Emily R.', text: 'The fitness tracker exceeded my expectations. Great battery life and accurate tracking.', rating: 4, avatar: 'E' },
];

const Testimonials = () => (
  <section className="py-16">
    <div className="container">
      <div className="mb-10 text-center">
        <h2 className="mb-2 font-display text-3xl font-bold">What Our Customers Say</h2>
        <p className="text-muted-foreground">Join thousands of happy shoppers</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {reviews.map((review, i) => (
          <motion.div
            key={review.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="mb-3 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className={`h-4 w-4 ${j < review.rating ? 'fill-warning text-warning' : 'text-border'}`} />
              ))}
            </div>
            <p className="mb-4 text-sm text-muted-foreground">&ldquo;{review.text}&rdquo;</p>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                {review.avatar}
              </div>
              <span className="text-sm font-medium">{review.name}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
