import { create } from "zustand";
import type { User } from "@/types/user";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;

  setUser: (user: User) => void;
  clearAuth: () => void;
}

const initialStore: Omit<AuthStore, "setUser" | "clearAuth"> = {
  user: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()((set) => ({
  ...initialStore,

  setUser: (user: User) =>
    set({
      user,
      isAuthenticated: true,
    }),

  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));
