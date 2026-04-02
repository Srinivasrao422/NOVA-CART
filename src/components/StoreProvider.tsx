import { useState, useCallback, ReactNode } from 'react';
import { StoreContext, Product, CartItem } from '@/lib/store';

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const cartTotal = useCallback(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  const cartCount = useCallback(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        searchQuery,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        setSearchQuery,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
