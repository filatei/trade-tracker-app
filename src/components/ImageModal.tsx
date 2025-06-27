// src/components/ImageModal.tsx
import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Share,
  Platform,
  Alert
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  visible: boolean;
  uri: string | null;
  onClose: () => void;
}

export default function ImageModal({ visible, uri, onClose }: Props) {
  const scale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = event.scale;
    })
    .onEnd(() => {
      scale.value = withTiming(1);
    });

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const downloadImage = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        return Alert.alert('Permission Denied', 'Enable media permissions to save images.');
      }

      const fileUri = FileSystem.documentDirectory + uri?.split('/').pop();
      const download = await FileSystem.downloadAsync(uri!, fileUri);
      const asset = await MediaLibrary.createAssetAsync(download.uri);
      await MediaLibrary.createAlbumAsync('Downloads', asset, false);
      Alert.alert('Success', 'Image saved to your gallery.');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to download image.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <GestureDetector gesture={pinchGesture}>
          <Animated.Image source={{ uri: uri! }} style={[styles.image, imageStyle]} resizeMode="contain" />
        </GestureDetector>

        <View style={styles.footer}>
          <TouchableOpacity onPress={downloadImage} style={styles.button}>
            <Text style={styles.buttonText}>Download</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '80%',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});