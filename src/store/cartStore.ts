import { create } from "zustand";
import { cartApi } from "@/services/api";
import type { ApiCart as Cart } from "@/services/types";

type CartState = {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  fetchCart: (userId: string) => Promise<void>;
  add: (productId: string, quantity?: number) => Promise<void>;
  update: (productId: string, quantity: number) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  applyCoupon: (couponCode: string) => Promise<void>;
  clearLocal: () => void;
};

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,

  clearLocal: () => set({ cart: null, error: null, isLoading: false }),

  fetchCart: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await cartApi.getByUserId(userId);
      set({ cart: res.data, isLoading: false });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load cart";
      set({ error: msg, isLoading: false });
    }
  },

  add: async (productId, quantity = 1) => {
    set({ isLoading: true, error: null });
    try {
      const res = await cartApi.add({ productId, quantity });
      set({ cart: res.data, isLoading: false });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to add to cart";
      set({ error: msg, isLoading: false });
      throw e instanceof Error ? e : new Error(msg);
    }
  },

  update: async (productId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const res = await cartApi.update({ productId, quantity });
      set({ cart: res.data, isLoading: false });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to update cart";
      set({ error: msg, isLoading: false });
      throw e instanceof Error ? e : new Error(msg);
    }
  },

  remove: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await cartApi.remove(productId);
      set({ cart: res.data, isLoading: false });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to remove item";
      set({ error: msg, isLoading: false });
      throw e instanceof Error ? e : new Error(msg);
    }
  },

  applyCoupon: async (couponCode) => {
    set({ isLoading: true, error: null });
    try {
      const res = await cartApi.applyCoupon(couponCode);
      set({ cart: res.data, isLoading: false });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to apply coupon";
      set({ error: msg, isLoading: false });
      throw e instanceof Error ? e : new Error(msg);
    }
  },
}));

