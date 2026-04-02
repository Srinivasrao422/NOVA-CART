import { Shield, Truck, RotateCcw, HeadphonesIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const badges = [
  { icon: Shield, title: 'Secure Payment', desc: '256-bit SSL encryption' },
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
  { icon: RotateCcw, title: '30-Day Returns', desc: 'No questions asked' },
  { icon: HeadphonesIcon, title: '24/7 Support', desc: 'Always here to help' },
];

const TrustBadges = () => (
  <section className="border-y border-border bg-secondary/30 py-10">
    <div className="container">
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <badge.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">{badge.title}</p>
              <p className="text-xs text-muted-foreground">{badge.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustBadges;
