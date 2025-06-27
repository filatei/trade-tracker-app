import { useAuth } from '@clerk/clerk-expo';
import { getToken as getStoredToken, saveToken as saveStoredToken, deleteToken as deleteStoredToken } from '@/utils/tokenStorage';
import { useState, useCallback } from 'react';

export const BACKEND_TOKEN_KEY = 'backendToken';

export function useSessionTokens() {
  const { getToken: getClerkToken } = useAuth();
  const [backendToken, setBackendToken] = useState<string | null>(null);

  // 🔐 Fetch Clerk session token
  const fetchClerkToken = useCallback(async () => {
    try {
      const token = await getClerkToken();
      return token;
    } catch (err) {
      console.error('Failed to get Clerk session token:', err);
      return null;
    }
  }, [getClerkToken]);

  // 🔐 Fetch backend token (from storage or memory)
  const fetchBackendToken = useCallback(async () => {
    try {
      const token = await getStoredToken(BACKEND_TOKEN_KEY);
      setBackendToken(token);
      return token;
    } catch (err) {
      console.error('Failed to get backend token:', err);
      return null;
    }
  }, []);

  // 🧼 Clear backend token
  const clearBackendToken = useCallback(async () => {
    await deleteStoredToken(BACKEND_TOKEN_KEY);
    setBackendToken(null);
  }, []);

  // 💾 Save backend token
  const persistBackendToken = useCallback(async (token: string) => {
    await saveStoredToken(BACKEND_TOKEN_KEY, token);
    setBackendToken(token);
  }, []);

  return {
    fetchClerkToken,
    fetchBackendToken,
    persistBackendToken,
    clearBackendToken,
    backendToken,
  };
}
