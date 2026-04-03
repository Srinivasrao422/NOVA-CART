import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Search, Menu, X, User, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MegaMenu from './MegaMenu';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useUiStore } from '@/store/uiStore';
import { useWishlistStore } from '@/store/wishlistStore';

const Navbar = () => {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const cart = useCartStore(s => s.cart);
  const searchQuery = useUiStore(s => s.searchQuery);
  const setSearchQuery = useUiStore(s => s.setSearchQuery);
  const wishlistCount = useWishlistStore(s => s.ids.length);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const count = cart?.items?.reduce((sum, i) => sum + (i.quantity || 0), 0) ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/shop');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
          <span className="text-gradient">Nova</span>
          <span>Cart</span>
        </Link>

        {/* Desktop nav - Mega Menu */}
        <MegaMenu />

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden flex-1 max-w-md md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-border bg-secondary py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </form>

        {/* Right icons */}
        <div className="flex items-center gap-3">
          <button onClick={() => setSearchOpen(!searchOpen)} className="rounded-full p-2 transition-colors hover:bg-secondary md:hidden">
            <Search className="h-5 w-5" />
          </button>
          <Link to="/shop" className="relative rounded-full p-2 transition-colors hover:bg-secondary" title="Wishlist">
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative rounded-full p-2 transition-colors hover:bg-secondary">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground"
              >
                {count}
              </motion.span>
            )}
          </Link>
          <Link to="/tracking" className="hidden rounded-full p-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:flex">
            <Package className="h-5 w-5" />
          </Link>
          {user ? (
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:flex"
            >
              <User className="h-5 w-5" />
              Logout
            </button>
          ) : (
            <Link to="/auth" className="hidden rounded-full p-2 transition-colors hover:bg-secondary md:flex">
              <User className="h-5 w-5" />
            </Link>
          )}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-full p-2 transition-colors hover:bg-secondary md:hidden">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden md:hidden">
            <form onSubmit={handleSearch} className="container pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-border bg-secondary py-2 pl-10 pr-4 text-sm outline-none focus:border-accent"
                  autoFocus
                />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className="container flex flex-col gap-4 py-4">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium">Home</Link>
              <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium">Shop</Link>
              <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium">Orders</Link>
              <Link to="/tracking" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium">Track Order</Link>
              {user ? (
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); navigate('/'); }}
                  className="text-left text-sm font-medium"
                >
                  Logout
                </button>
              ) : (
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium">Login / Signup</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
