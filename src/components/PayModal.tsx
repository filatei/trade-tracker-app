// src/components/PayModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import { Text as ThemedText } from '@/components/Text';
import { submitPayment } from '@/services/expenseService';

interface PayModalProps {
  visible: boolean;
  onClose: () => void;
  expense: {
    _id: string;
    txn_amount: number;
    balance: number;
  };
  onUpdate: (updated: any) => void;
}

export default function PayModal({ visible, onClose, expense, onUpdate }: PayModalProps) {
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [bankAcct, setBankAcct] = useState('');
  const [paymentDate] = useState(new Date());
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const MAX_IMAGE_SIZE = 1 * 1024 * 1024; 

  const pickImage = async (useCamera = false) => {
    const perm = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!perm.granted) {
      Alert.alert('Permission required', 'Please grant access to your camera or gallery.');
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.1 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.1 });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const fileInfo = await fetch(uri).then(res => res.blob());

      if (fileInfo.size > MAX_IMAGE_SIZE) {
        Alert.alert('Image Too Large', `Image is ${(fileInfo.size / (1024 * 1024)).toFixed(2)}MB. Max is 1MB.`);
        return;
      }

      setReceiptImage(uri);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('action', 'payment');
      formData.append('paymentDate', paymentDate.toISOString());
      formData.append('paidAmount', amount);
      formData.append('memo', memo);
      formData.append('bankAcct', bankAcct);

      if (receiptImage) {
        const filename = receiptImage.split('/').pop() || 'receipt.jpg';
        const type = `image/${filename.split('.').pop()}`;
        formData.append('receipt', { uri: receiptImage, name: filename, type } as any);
      }

      const res = await submitPayment(expense._id, formData);
      Toast.show({ type: 'success', text1: 'Payment submitted successfully' });
      onUpdate(res.expense);
      onClose();
    } catch (e) {
      console.error(e);
      Alert.alert('Submission Failed', 'An error occurred while submitting payment.');
    } finally {
      setLoading(false);
    }
  };

  const balanceAfterPay = () => {
    const amt = parseFloat(amount);
    const bal = expense?.balance ?? expense?.txn_amount ?? 0;
    return isNaN(amt) ? bal : Math.max(0, bal - amt);
  };

  const isFormValid = amount && parseFloat(amount) > 0 && bankAcct;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView className="flex-1 bg-black px-4 py-6">
        <ThemedText className="text-xl font-bold text-white mb-4">Make Payment</ThemedText>

        <ThemedText className="text-white mb-1">Txn Amount</ThemedText>
        <Text className="text-green-400 text-lg mb-3">
          ₦{(expense?.txn_amount ?? 0).toLocaleString()}
        </Text>

        <ThemedText className="text-white mb-1">Balance After Payment</ThemedText>
        <Text className="text-yellow-400 text-lg mb-3">
          ₦{balanceAfterPay().toLocaleString()}
        </Text>

        <ThemedText className="text-white mb-1">Amount Paying</ThemedText>
        <TextInput
          className="bg-gray-900 text-white rounded-lg p-2 mb-4 border border-gray-700"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <ThemedText className="text-white mb-1">Bank Account</ThemedText>
        <View className="bg-gray-900 rounded-lg mb-4 border border-gray-700">
          <Picker
            selectedValue={bankAcct}
            onValueChange={setBankAcct}
            style={{ color: 'white' }}
            dropdownIconColor="white"
          >
            <Picker.Item label="Select Account" value="" />
            <Picker.Item label="GTB - 0001234567" value="GTB" />
            <Picker.Item label="UBA - 0007654321" value="UBA" />
          </Picker>
        </View>

        <ThemedText className="text-white mb-1">Memo</ThemedText>
        <TextInput
          className="bg-gray-900 text-white rounded-lg p-2 mb-4 border border-gray-700"
          value={memo}
          onChangeText={setMemo}
        />

        <View className="flex-row justify-between mb-4">
          <TouchableOpacity
            className="bg-gray-700 rounded-lg px-3 py-2 flex-1 mr-2"
            onPress={() => pickImage(false)}
          >
            <Text className="text-white text-center">From Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-gray-700 rounded-lg px-3 py-2 flex-1 ml-2"
            onPress={() => pickImage(true)}
          >
            <Text className="text-white text-center">Take Photo</Text>
          </TouchableOpacity>
        </View>

        {receiptImage && (
          <Text className="text-white text-sm mb-4">✅ Image selected – under 1MB</Text>
        )}

        <TouchableOpacity
          className={`rounded-lg p-3 ${isFormValid ? 'bg-green-600' : 'bg-gray-600'}`}
          disabled={!isFormValid || loading}
          onPress={() => {
            Alert.alert(
              'Confirm Payment',
              `Pay ₦${Number(amount).toLocaleString()} from ${bankAcct}?`,
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Yes, Pay', style: 'destructive', onPress: handleSubmit },
              ]
            );
          }}
        >
          <Text className="text-white text-center">
            {loading ? 'Submitting...' : 'Submit Payment'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="mt-4" onPress={onClose}>
          <Text className="text-red-500 text-center">Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
}
