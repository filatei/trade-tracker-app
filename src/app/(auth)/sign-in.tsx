import * as React from "react";
import { View, Image, SafeAreaView } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import {
  isClerkAPIResponseError,
  useSignIn,
  useSSO,
  useUser,
} from "@clerk/clerk-expo";
import { ClerkAPIError } from "@clerk/types";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { APP_CONFIG } from "@/config/constants";
import { useSessionTokens } from "@/hooks/useSessionTokens";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  const { startSSOFlow } = useSSO();
  const { signIn, setActive } = useSignIn();
  const [errors, setErrors] = React.useState<ClerkAPIError[]>([]);
  const { fetchClerkToken } = useSessionTokens();
  const API_URL = APP_CONFIG.API_URL;

  const saveToken = (token: string) => {
    const decoded: any = jwtDecode(token);
    const exp = decoded.exp * 1000; // Convert to ms
    useAuthStore.getState().setToken(token, exp);
  };

  const handleSignInWithGoogle = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: AuthSession.makeRedirectUri({
          scheme: APP_CONFIG.SCHEME,
          path: APP_CONFIG.REDIRECT_URL.PROTECTED,
        }),
      });

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        const sessionToken = await fetchClerkToken();
        if (!sessionToken) throw new Error("Missing Clerk session token");
        saveToken(sessionToken);
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) setErrors(err.errors);
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  const signInWithPasskey = async () => {
    try {
      const signInAttempt = await signIn?.authenticateWithPasskey({
        flow: "discoverable",
      });

      if (signInAttempt?.status === "complete") {
        if (setActive !== undefined) {
          await setActive({ session: signInAttempt.createdSessionId });
        }

        const sessionToken = await fetchClerkToken();
        if (!sessionToken) throw new Error("Missing Clerk session token");
        saveToken(sessionToken);

        const response = await fetch(`${API_URL}/users/clerk-protected`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
        });
        console.log(response, " response");
        if (!response.ok) throw new Error("Backend login failed");

        requestAnimationFrame(() => {
          router.replace(APP_CONFIG.REDIRECT_URL.PROTECTED);
        });
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error("Error:", JSON.stringify(err, null, 2));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 0.1 }} />

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
        }}
      >
        <View style={{ gap: 20, alignItems: "center" }}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={{ width: 100, height: 100 }}
          />
          <Text style={{ fontSize: 32, fontWeight: "bold" }}>
            Modern Business App
          </Text>
          <Text>Sign in to continue</Text>
          {errors.map((error) => (
            <Text key={error.code}>{error.code}</Text>
          ))}
        </View>

        <View style={{ flex: 1 }} />
        {/* <Button
          onPress={signInWithPasskey}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginBottom: 20,
            backgroundColor: "black",
            borderColor: "white",
            borderWidth: 1,
          }}
        >
          <Text style={{ color: "white", fontWeight: "500" }}>
            Sign in with Passkey
          </Text>
        </Button> */}
        <Button
          onPress={handleSignInWithGoogle}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginBottom: 30,
          }}
        >
          <Image
            source={require("@/assets/images/google-icon.png")}
            style={{ width: 20, height: 20 }}
          />
          <Text style={{ color: "black", fontWeight: "500" }}>
            Sign in with Google
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
