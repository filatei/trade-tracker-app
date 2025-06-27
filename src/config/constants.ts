// src/config/constants.ts
export const APP_CONFIG = {
  SCHEME: 'torapp',
  REDIRECT_URL: {
    SIGN_IN: '/(auth)/sign-in',
    PROTECTED: '/(protected)',
  },
  API_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
  MT_API_URL: process.env.EXPO_PUBLIC_MT_API_BASE_URL,
  CLERK_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
  DERIBIT_API_KEY: process.env.EXPO_PUBLIC_DERIBIT_API_KEY,
  DERIBIT_API_SECRET: process.env.EXPO_PUBLIC_DERIBIT_API_SECRET,
  DERIBIT_API_URL: process.env.EXPO_PUBLIC_DERIBIT_API_URL,
} as const; 