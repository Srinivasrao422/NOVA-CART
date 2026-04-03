import { create } from "zustand";

type RecentlyViewedState = {
  ids: string[];
  hydrate: () => void;
  push: (productId: string) => void;
  clear: () => void;
};

const KEY = "nova_cart_recently_viewed";
const MAX = 12;

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

export const useRecentlyViewedStore = create<RecentlyViewedState>((set, get) => ({
  ids: [],
  hydrate: () => set({ ids: readIds() }),
  push: (productId) => {
    const prev = get().ids;
    const next = [productId, ...prev.filter((id) => id !== productId)].slice(0, MAX);
    writeIds(next);
    set({ ids: next });
  },
  clear: () => {
    writeIds([]);
    set({ ids: [] });
  },
}));

