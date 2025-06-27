import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useEffect, useCallback } from 'react';
import { useSSO } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { Pressable, Image, Platform } from 'react-native';
import { APP_CONFIG } from '@/config/constants';
import { useSessionTokens } from '@/hooks/useSessionTokens';

// Icons for each strategy
const strategyIcons = {
  oauth_google: require('@/assets/social-providers/google.png'),
  oauth_apple: require('@/assets/social-providers/apple.png'),
  oauth_facebook: require('@/assets/social-providers/facebook.png'),
};

type SignInWithProps = {
  strategy: keyof typeof strategyIcons;
};

// Preload browser to reduce auth delay on Android
export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      void WebBrowser.warmUpAsync();
    }
    return () => {
      if (Platform.OS === 'android') {
        void WebBrowser.coolDownAsync();
      }
    };
  }, []);
};

// Final component
export default function SignInWith({ strategy }: SignInWithProps) {
  useWarmUpBrowser();

  const { startSSOFlow } = useSSO();
  const { fetchClerkToken, persistBackendToken } = useSessionTokens();
  const API_URL = APP_CONFIG.API_URL;


  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl: AuthSession.makeRedirectUri({
          scheme: APP_CONFIG.SCHEME,
          path: APP_CONFIG.REDIRECT_URL.PROTECTED,
        }),
      });

      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
        console.log('✅ Clerk session created', createdSessionId);

        const sessionToken = await fetchClerkToken();
        if (!sessionToken) throw new Error('Missing Clerk session token');

        console.log(API_URL, ' API_URL');
        const response = await fetch(`${API_URL}/users/clerk-protected`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            'Content-Type': 'application/json',
          },
        });
        console.log(response, ' response');

        if (!response.ok) throw new Error('Backend login failed');

        // const { token } = await response.json();
        // await persistBackendToken(token);
        // console.log('✅ Backend token stored');

        requestAnimationFrame(() => {
          router.replace(APP_CONFIG.REDIRECT_URL.PROTECTED);
        });
      } else {
        console.warn('No session created');
        router.replace(APP_CONFIG.REDIRECT_URL.SIGN_IN);
      }
    } catch (err) {
      console.error('❌ Auth error:', err);
      router.replace(APP_CONFIG.REDIRECT_URL.SIGN_IN);
    }
  }, [strategy]);

  return (
    <Pressable onPress={onPress}>
      <Image
        source={strategyIcons[strategy]}
        style={{ width: 62, height: 62 }}
        resizeMode="contain"
      />
    </Pressable>
  );
}
