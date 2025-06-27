// src/screens/SplashScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { router } from 'expo-router';

const { height } = Dimensions.get('window');

export default function SplashScreen() {

  // Animated values
  const logoY = useRef(new Animated.Value(-100)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence: slide logo down, then fade in text, then navigate
    Animated.sequence([
      Animated.spring(logoY, {
        toValue: height * 0.3,
        useNativeDriver: true,
        friction: 5,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.delay(1300),
    ]).start(() => {
      // After splash, go to main app
      // delay 1 second
      setTimeout(() => {
        router.replace('/(auth)/sign-in');  // or your initial route
      }, 1000);
    });
  }, [logoY, textOpacity]);

  return (
    <View style={[styles.container, { backgroundColor: '#000'  }]}>
      <Animated.View style={[styles.logoContainer, { transform: [{ translateY: logoY }] }]}>
        {/* Replace require with your logo path */}
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
      </Animated.View>
      <Animated.Text
        style={[
          styles.tagline,
          {
            opacity: textOpacity,
            color: '#fff'
          },
        ]}
      >
        Powered by Torama
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  tagline: {
    position: 'absolute',
    top: height * 0.3 + 140, // logoY + logo height + spacing
    fontSize: 18,
    fontWeight: '600',
  },
});