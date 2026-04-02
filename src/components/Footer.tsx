import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="border-t border-border bg-secondary/50">
    <div className="container py-12">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="mb-4 font-display text-lg font-bold">
            <span className="text-gradient">Nova</span>Cart
          </h3>
          <p className="text-sm text-muted-foreground">
            Premium trending products delivered to your doorstep. Quality meets affordability.
          </p>
        </div>
        <div>
          <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop" className="hover:text-foreground">All Products</Link></li>
            <li><Link to="/shop" className="hover:text-foreground">Electronics</Link></li>
            <li><Link to="/shop" className="hover:text-foreground">Fashion</Link></li>
            <li><Link to="/shop" className="hover:text-foreground">Home & Kitchen</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><span className="hover:text-foreground cursor-pointer">Track Order</span></li>
            <li><span className="hover:text-foreground cursor-pointer">Returns & Refunds</span></li>
            <li><span className="hover:text-foreground cursor-pointer">FAQ</span></li>
            <li><span className="hover:text-foreground cursor-pointer">Contact Us</span></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><span className="hover:text-foreground cursor-pointer">Privacy Policy</span></li>
            <li><span className="hover:text-foreground cursor-pointer">Terms of Service</span></li>
            <li><span className="hover:text-foreground cursor-pointer">Shipping Policy</span></li>
          </ul>
        </div>
      </div>
      <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} NovaCart. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
