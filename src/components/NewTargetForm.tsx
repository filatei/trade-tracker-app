// src/components/NewTargetForm.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  Alert,
  Modal,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { submitTarget, getTargets } from '@/services/traderTargetService';
import { z } from 'zod';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DatePickerModal } from 'react-native-paper-dates';
import { format } from 'date-fns';

const TargetSchema = z.object({
  targetAmount: z.string().min(1, 'Required'),
  initialAmount: z.string().min(1, 'Required'),
});

export default function NewTargetForm({ visible, onClose, onTargetCreated }: {
  visible: boolean;
  onClose: () => void;
  onTargetCreated: (targets: any[]) => void;
}) {
  const [newTargetAmount, setNewTargetAmount] = useState('');
  const [newInitialAmount, setNewInitialAmount] = useState('');
  const [newStartDate, setNewStartDate] = useState(new Date());
  const [newTargetDate, setNewTargetDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showTargetDatePicker, setShowTargetDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const result = TargetSchema.safeParse({
      targetAmount: newTargetAmount,
      initialAmount: newInitialAmount,
    });

    if (!result.success) {
      Alert.alert('Validation Error', 'Please enter both amounts.');
      return;
    }

    try {
      setLoading(true);
      await submitTarget({
        targetAmount: parseFloat(newTargetAmount),
        initialAmount: parseFloat(newInitialAmount),
        startDate: newStartDate.toISOString(),
        targetDate: newTargetDate.toISOString(),
      });

      Toast.show({ type: 'success', text1: 'Target Created Successfully' });
      setNewInitialAmount('');
      setNewTargetAmount('');
      const ts = await getTargets();
      onTargetCreated(ts);
      onClose();
    } catch (err) {
      console.error('Target creation failed:', err);
      Toast.show({ type: 'error', text1: 'Failed to create target' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-white px-4 py-6">
        <Text className="text-xl font-bold mb-4 text-gray-800">🎯 Create New Trading Target</Text>

        <View className="space-y-4">
          <View>
            <Text className="text-sm mb-1 text-gray-600">🎯 Target Amount (USD)</Text>
            <TextInput
              placeholder="e.g. 1000000"
              keyboardType="numeric"
              value={newTargetAmount}
              onChangeText={setNewTargetAmount}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </View>

          <View>
            <Text className="text-sm mb-1 text-gray-600">💰 Initial Capital (USD)</Text>
            <TextInput
              placeholder="e.g. 200"
              keyboardType="numeric"
              value={newInitialAmount}
              onChangeText={setNewInitialAmount}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </View>

          <View>
            <Text className="text-sm mb-1 text-gray-600">📅 Start Date</Text>
            <TouchableOpacity
              onPress={() => setShowStartDatePicker(true)}
              className="border border-gray-300 rounded px-3 py-2 bg-gray-50"
            >
              <Text>{format(newStartDate, 'PPP')}</Text>
            </TouchableOpacity>

            <DatePickerModal
              locale="en"
              mode="single"
              visible={showStartDatePicker}
              date={newStartDate}
              onDismiss={() => setShowStartDatePicker(false)}
              onConfirm={({ date }) => {
                if (date) setNewStartDate(date);
                setShowStartDatePicker(false);
              }}
            />
          </View>

          <View>
            <Text className="text-sm mb-1 text-gray-600">🎯 Target Date</Text>
            <TouchableOpacity
              onPress={() => setShowTargetDatePicker(true)}
              className="border border-gray-300 rounded px-3 py-2 bg-gray-50"
            >
              <Text>{format(newTargetDate, 'PPP')}</Text>
            </TouchableOpacity>

            <DatePickerModal
              locale="en"
              mode="single"
              visible={showTargetDatePicker}
              date={newTargetDate}
              onDismiss={() => setShowTargetDatePicker(false)}
              onConfirm={({ date }) => {
                if (date) setNewTargetDate(date);
                setShowTargetDatePicker(false);
              }}
            />
          </View>

          <View className="pt-6 space-y-2">
            <Button title="✅ Save Target" onPress={handleSubmit} disabled={loading} />
            <Button title="❌ Cancel" onPress={onClose} color="gray" />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}