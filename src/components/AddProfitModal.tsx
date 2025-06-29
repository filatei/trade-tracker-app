// src/components/AddProfitModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { submitProfit, getProfits } from '@/services/traderProfitService';

interface AddProfitModalProps {
  visible: boolean;
  onClose: () => void;
  targetId: string;
  onProfitSubmitted: (profits: any[]) => void;
}

export default function AddProfitModal({ visible, onClose, targetId, onProfitSubmitted }: AddProfitModalProps) {
  const [profit, setProfit] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddProfit = async () => {
    Alert.alert('Confirm', `Submit profit of $${profit} on ${date.toDateString()}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'OK',
        onPress: async () => {
          try {
            setLoading(true);
            await submitProfit({
              date: date.toISOString(),
              amount: parseFloat(profit),
              targetId,
            });

            Toast.show({
              type: 'success',
              text1: 'Profit Saved',
              text2: `$${profit} on ${date.toDateString()}`,
            });

            const updated = await getProfits(targetId);
            onProfitSubmitted(updated);
            onClose();
            setProfit('');
            setDate(new Date());
          } catch (err: any) {
            const offlineQueue = JSON.parse(await AsyncStorage.getItem('offlineProfits') || '[]');
            offlineQueue.push({ date, amount: parseFloat(profit), targetId });
            await AsyncStorage.setItem('offlineProfits', JSON.stringify(offlineQueue));

            if (err?.response?.status === 409) {
              Alert.alert('Duplicate', 'You already submitted profit for this day.');
            } else {
              Alert.alert('Offline', 'Saved locally and will sync later');
            }
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-white p-4">
        <Text className="text-lg font-bold mb-4">➕ Add Daily Profit</Text>

        <Text className="text-sm text-gray-700 mb-1">Profit Amount (USD)</Text>
        <TextInput
          placeholder="e.g. 250"
          keyboardType="numeric"
          value={profit}
          onChangeText={setProfit}
          className="border border-gray-300 rounded px-3 py-2 mb-4"
        />

        <Text className="text-sm text-gray-700 mb-1">Select Date</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className="border border-gray-300 rounded px-3 py-2 bg-gray-50 mb-4"
        >
          <Text>{date.toDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        <Button
          title="✅ Submit Profit"
          onPress={handleAddProfit}
          disabled={!profit || !targetId || loading}
        />

        <View className="mt-2">
          <Button title="❌ Cancel" onPress={onClose} color="gray" />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
