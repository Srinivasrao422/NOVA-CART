import { useEffect } from "react";
import { useHydrateAuth } from "@/hooks/useHydrateAuth";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useGuestCartStore } from "@/store/guestCartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useRecentlyViewedStore } from "@/store/recentlyViewedStore";
import { onAuthEvent } from "@/services/api";
import { toast } from "sonner";

export function AppBootstrap() {
  useHydrateAuth();
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const add = useCartStore((s) => s.add);
  const logout = useAuthStore((s) => s.logout);
  const guestHydrate = useGuestCartStore((s) => s.hydrate);
  const guestItems = useGuestCartStore((s) => s.items);
  const guestClear = useGuestCartStore((s) => s.clear);
  const wishlistHydrate = useWishlistStore((s) => s.hydrate);
  const recentHydrate = useRecentlyViewedStore((s) => s.hydrate);

  useEffect(() => {
    if (!isHydrated) return;
    guestHydrate();
    wishlistHydrate();
    recentHydrate();
    if (user?.id) fetchCart(user.id);
  }, [isHydrated, user?.id, fetchCart, guestHydrate, wishlistHydrate, recentHydrate]);

  // Merge guest cart into backend cart after login
  useEffect(() => {
    if (!isHydrated) return;
    if (!user?.id) return;
    if (!guestItems.length) return;

    (async () => {
      for (const line of guestItems) {
        try {
          await add(line.productId, line.quantity);
        } catch {
          // ignore individual failures (stock etc)
        }
      }
      guestClear();
      toast.success("Guest cart synced");
    })();
  }, [isHydrated, user?.id, guestItems, add, guestClear]);

  // Global 401 handler
  useEffect(() => {
    return onAuthEvent((evt) => {
      if (evt?.type === "unauthorized") {
        logout();
        toast.error("Session expired. Please sign in again.");
      }
    });
  }, [logout]);

  return null;
}

