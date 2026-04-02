import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useHydrateAuth } from "@/hooks/useHydrateAuth";

export function RequireRole({ role, children }: { role: "admin"; children: ReactNode }) {
  useHydrateAuth();
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) nav("/auth", { replace: true, state: { from: loc.pathname } });
    else if (user.role !== role) nav("/", { replace: true });
  }, [user, isHydrated, nav, loc.pathname, role]);

  if (!isHydrated || !user) return null;
  if (user.role !== role) return null;
  return <>{children}</>;
}

