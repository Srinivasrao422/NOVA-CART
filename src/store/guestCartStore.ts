import { create } from "zustand";

type GuestCartLine = { productId: string; quantity: number };

type GuestCartState = {
  items: GuestCartLine[];
  add: (productId: string, quantity?: number) => void;
  update: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  hydrate: () => void;
};

const KEY = "nova_cart_guest_cart";

function read(): GuestCartLine[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as GuestCartLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: GuestCartLine[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export const useGuestCartStore = create<GuestCartState>((set, get) => ({
  items: [],

  hydrate: () => set({ items: read() }),

  add: (productId, quantity = 1) => {
    const qty = Math.max(1, Number(quantity || 1));
    const prev = get().items;
    const idx = prev.findIndex((i) => i.productId === productId);
    const next =
      idx >= 0
        ? prev.map((i) => (i.productId === productId ? { ...i, quantity: i.quantity + qty } : i))
        : [...prev, { productId, quantity: qty }];
    write(next);
    set({ items: next });
  },

  update: (productId, quantity) => {
    const qty = Math.max(1, Number(quantity || 1));
    const next = get().items.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i));
    write(next);
    set({ items: next });
  },

  remove: (productId) => {
    const next = get().items.filter((i) => i.productId !== productId);
    write(next);
    set({ items: next });
  },

  clear: () => {
    write([]);
    set({ items: [] });
  },
}));

