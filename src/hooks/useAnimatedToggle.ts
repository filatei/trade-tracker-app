// hooks/useAnimatedToggle.ts
import { useRef, useState } from 'react';
import { Animated } from 'react-native';

export default function useAnimatedToggle(initialVisible = false, height = 80) {
  const [visible, setVisible] = useState(initialVisible);
  const animValue = useRef(new Animated.Value(initialVisible ? height : 0)).current;

  const toggle = () => {
    const toValue = visible ? 0 : height;
    Animated.timing(animValue, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setVisible(!visible);
  };

  const show = () => {
    if (!visible) toggle();
  };

  const hide = () => {
    if (visible) toggle();
  };

  return { visible, toggle, show, hide, animValue };
}