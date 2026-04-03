import { create } from "zustand";

type UiState = {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
};

export const useUiStore = create<UiState>((set) => ({
  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),
}));

