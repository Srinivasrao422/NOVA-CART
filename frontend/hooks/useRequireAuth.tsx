import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useHydrateAuth } from "@/hooks/useHydrateAuth";

export function RequireAuth({ children }: { children: ReactNode }) {
  useHydrateAuth();
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) nav("/auth", { replace: true, state: { from: loc.pathname } });
  }, [user, isHydrated, nav, loc.pathname]);

  if (!isHydrated) return null;
  if (!user) return null;
  return <>{children}</>;
}

