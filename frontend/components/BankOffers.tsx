import { motion } from 'framer-motion';
import { CreditCard, Percent, Gift, BadgeCheck } from 'lucide-react';

const bankOffers = [
  {
    icon: CreditCard,
    title: 'Bank Offer',
    description: '10% Instant Discount on HDFC Credit Cards',
    code: 'HDFC10',
    color: 'from-blue-600 to-blue-800',
  },
  {
    icon: Percent,
    title: 'Special Offer',
    description: 'Flat 15% Off on SBI Debit & Credit Cards',
    code: 'SBI15',
    color: 'from-indigo-600 to-purple-700',
  },
  {
    icon: Gift,
    title: 'Cashback',
    description: 'Get ₹200 Cashback on Paytm Wallet Orders',
    code: 'PAYTM200',
    color: 'from-teal-500 to-emerald-600',
  },
  {
    icon: BadgeCheck,
    title: 'EMI Offer',
    description: 'No-Cost EMI Available on Orders Above ₹3000',
    code: 'NOCOST',
    color: 'from-orange-500 to-red-600',
  },
];

const BankOffers = () => {
  return (
    <section className="py-8">
      <div className="container">
        <h2 className="mb-6 font-display text-xl font-bold md:text-2xl">
          💳 Bank Offers & Deals
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {bankOffers.map((offer, i) => (
            <motion.div
              key={offer.code}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${offer.color} p-5 text-white shadow-lg`}
            >
              <div className="absolute -right-4 -top-4 opacity-10">
                <offer.icon className="h-24 w-24" />
              </div>
              <div className="relative">
                <div className="mb-2 flex items-center gap-2">
                  <offer.icon className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider opacity-90">{offer.title}</span>
                </div>
                <p className="mb-3 text-sm font-medium leading-snug">{offer.description}</p>
                <div className="inline-block rounded-md border border-white/30 bg-white/10 px-3 py-1 text-xs font-bold tracking-wide backdrop-blur-sm">
                  Code: {offer.code}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BankOffers;
