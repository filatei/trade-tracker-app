// src/store/authStore.ts
import { create } from 'zustand';

interface AuthState {
  token: string | null;
  expiresAt: number | null;
  refreshToken: string | null;
  setToken: (token: string, expiresAt: number, refreshToken?: string) => void;
  clearToken: () => void;
  isTokenValid: () => boolean;
  getToken: () => string | null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  expiresAt: null,
  refreshToken: null,

  setToken: (token, expiresAt, refreshToken) => {
    set({ token, expiresAt, refreshToken });
  },

  clearToken: () => {
    set({ token: null, expiresAt: null, refreshToken: null });
  },

  isTokenValid: () => {
    const { token, expiresAt } = get();
    return !!token && (!expiresAt || Date.now() < expiresAt);
  },

  getToken: () => {
    const { token, expiresAt } = get();
    if (token && (!expiresAt || Date.now() < expiresAt)) {
      return token;
    }
    return null;
  },
}));