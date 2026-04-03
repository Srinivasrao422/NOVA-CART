import { create } from "zustand";

type WishlistState = {
  ids: string[];
  hydrate: () => void;
  toggle: (productId: string) => void;
  clear: () => void;
};

const KEY = "nova_cart_wishlist";

function readIds(): string[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeIds(ids: string[]) {
  localStorage.setItem(KEY, JSON.stringify(ids));
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  ids: [],
  hydrate: () => set({ ids: readIds() }),
  toggle: (productId) => {
    const prev = get().ids;
    const next = prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId];
    writeIds(next);
    set({ ids: next });
  },
  clear: () => {
    writeIds([]);
    set({ ids: [] });
  },
}));

