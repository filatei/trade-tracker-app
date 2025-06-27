// src/components/ExpenseItem.tsx
import React from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { format } from 'date-fns';
import { router } from 'expo-router';
import { getStatusBg } from '@/utils/getStatusBg';
import * as Haptics from 'expo-haptics';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.2;

export default function ExpenseItem({ item, onDelete, onEdit }) {
  const translateX = useSharedValue(0);
  const isActionTriggered = useSharedValue(false);

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationX < 0) {
        translateX.value = e.translationX;
      }
    })
    .onEnd((e) => {
      if (e.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-100);
        if (!isActionTriggered.value) {
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
          isActionTriggered.value = true;
        }
      } else {
        translateX.value = withSpring(0);
        isActionTriggered.value = false;
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleEdit = () => {
    translateX.value = withSpring(0);
    onEdit(item);
  };

  const handleDelete = () => {
    translateX.value = withSpring(0);
    onDelete(item);
  };

  return (
    <View className="relative">
      {/* Left swipe button (Edit) */}
      <View className="absolute left-4 top-0 bottom-0 justify-center z-[-1]">
        <Pressable onPress={handleEdit} className="bg-blue-600 px-4 py-2 rounded">
          <Text className="text-white font-bold">Edit</Text>
        </Pressable>
      </View>

      {/* Right swipe button (Delete) */}
      <View className="absolute right-4 top-0 bottom-0 justify-center z-[-1]">
        <Pressable onPress={handleDelete} className="bg-red-600 px-4 py-2 rounded">
          <Text className="text-white font-bold">Delete</Text>
        </Pressable>
      </View>

      <GestureDetector gesture={gesture}>
        <Animated.View style={animatedStyle}>
          <Pressable
            onPress={() => router.push({ pathname: '/expenses/(id)', params: { id: item._id } })}
            className="p-4 m-2 rounded-lg bg-gray-800"
          >
            <Text className="text-base font-semibold text-white" numberOfLines={1}>
              {item.title}
            </Text>
            <Text className="text-sm text-gray-400" numberOfLines={1}>
              {item.vendor?.name}
            </Text>

            <View className="flex-row justify-between mt-2">
              <Text className="text-sm text-gray-400">Site: {item.site}</Text>
              <Text className="text-sm text-gray-400">#{item.expense_id}</Text>
              <View className={`px-2 py-1 rounded-full ${getStatusBg(item.status)}`}>
                <Text className="text-xs text-white font-bold">{item.status}</Text>
              </View>
            </View>

            <View className="flex-row justify-between mt-1 items-center">
              <Text
                className={`text-lg font-bold ${
                  item.status === 'PART-PAY' ? 'text-yellow-400' : 'text-green-400'
                }`}
              >
                ₦{(item.status === 'PART-PAY' ? item.balance : item.txn_amount).toLocaleString()}
              </Text>
              <Text className="text-sm text-gray-400">
                {item.date ? format(new Date(item.date), 'MMM dd, yyyy') : 'N/A'}
              </Text>
            </View>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}