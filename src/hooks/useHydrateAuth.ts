import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export function useHydrateAuth() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    if (!isHydrated) hydrate();
  }, [hydrate, isHydrated]);
}

