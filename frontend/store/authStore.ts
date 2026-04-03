import { create } from "zustand";
import { authApi, setToken as persistToken } from "@/services/api";

type Role = "user" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  isHydrated: boolean;
  hydrate: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  googleLogin: (payload: { email: string; name: string; googleId: string }) => Promise<void>;
  logout: () => void;
};

function readToken() {
  return localStorage.getItem("nova_cart_token");
}

function readUser() {
  const raw = localStorage.getItem("nova_cart_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function persistUser(user: AuthUser | null) {
  if (!user) localStorage.removeItem("nova_cart_user");
  else localStorage.setItem("nova_cart_user", JSON.stringify(user));
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isHydrated: false,

  hydrate: () => {
    const token = readToken();
    const user = readUser();
    set({ token, user, isHydrated: true });
  },

  login: async (email, password) => {
    const res = await authApi.login({ email, password });
    const token = res?.token;
    const user = res?.user;
    if (!token || !user?.id) throw new Error("Invalid login response");
    persistToken(token);
    persistUser(user);
    set({ token, user });
  },

  register: async (name, email, password) => {
    const res = await authApi.register({ name, email, password });
    const token = res?.token;
    const user = res?.user;
    if (!token || !user?.id) throw new Error("Invalid register response");
    persistToken(token);
    persistUser(user);
    set({ token, user });
  },

  googleLogin: async ({ email, name, googleId }) => {
    const res = await authApi.google({ email, name, googleId });
    const token = res?.token;
    const user = res?.user;
    if (!token || !user?.id) throw new Error("Invalid Google login response");
    persistToken(token);
    persistUser(user);
    set({ token, user });
  },

  logout: () => {
    persistToken(null);
    persistUser(null);
    set({ token: null, user: null });
  },
}));

