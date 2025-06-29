import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
  Image,
  Easing,
  Text,
} from 'react-native';
import { router } from 'expo-router';

const { height } = Dimensions.get('window');

export default function SplashScreen() {
  const logoY = useRef(new Animated.Value(-100)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const containerY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoY, {
        toValue: height * 0.3,
        duration: 1000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
    ]).start(() => {
      // Animate out
      Animated.parallel([
        Animated.timing(containerOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(containerY, {
          toValue: -50,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        router.replace('/(auth)/sign-in');
      });
    });
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: '#000',
          opacity: containerOpacity,
          transform: [{ translateY: containerY }],
        },
      ]}
    >
      <Animated.View style={[styles.logoContainer, { transform: [{ translateY: logoY }] }]}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
        />
      </Animated.View>
      <Animated.Text style={[styles.tagline, { opacity: textOpacity, color: '#fff' }]}>
        Powered by Torama
      </Animated.Text>
    </Animated.View>
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
    top: height * 0.3 + 140,
    fontSize: 18,
    fontWeight: '600',
  },
});