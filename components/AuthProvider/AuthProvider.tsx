"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { checkSession } from "@/lib/api/clientApi";
import { usePathname, useRouter } from "next/navigation";
import css from "./AuthProvider.module.css";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up", "/"];

function isPrivateRoute(pathname: string) {
  return (
    !PUBLIC_ROUTES.includes(pathname) &&
    (pathname.startsWith("/notes") || pathname.startsWith("/profile"))
  );
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { setUser, clearAuth, isAuthenticated } = useAuthStore();
  const [isSessionChecked, setIsSessionChecked] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && isSessionChecked) return;

    if (!isAuthenticated && isSessionChecked && !isPrivateRoute(pathname))
      return;

    const checkUserSession = async () => {
      if (isAuthenticated && isSessionChecked) return;

      try {
        const user = await checkSession();
        if (user) {
          setUser(user);
        } else {
          clearAuth();

          if (isPrivateRoute(pathname)) {
            router.replace("/sign-in");
          }
        }
      } catch (error) {
        console.error("Session check failed:", error);
        clearAuth();
        if (isPrivateRoute(pathname)) {
          router.replace("/sign-in");
        }
      } finally {
        setIsSessionChecked(true);
      }
    };

    if (!isSessionChecked || isPrivateRoute(pathname)) {
      checkUserSession();
    }
  }, [
    pathname,
    router,
    setUser,
    clearAuth,
    isAuthenticated,
    isSessionChecked,
    setIsSessionChecked,
  ]);

  if (isPrivateRoute(pathname) && !isSessionChecked) {
    return <div className={css.loader}>Loading application...</div>;
  }

  return <>{children}</>;
}
