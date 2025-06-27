// src/components/AccountSelector.tsx
import React from 'react';
import { View } from 'react-native';
import { Controller } from 'react-hook-form';
import { Text } from '@/components/Text';
import { Picker } from '@react-native-picker/picker';

const accounts = [
  'General Ledger',
  'Operations',
  'Logistics',
  'Procurement',
  'Cash',
  'Petty Cash',
  'Bank Account',
];

export default function AccountSelector({ control }) {
  return (
    <View className="mt-4">
      <Text className="mb-2 text-white">Select Expense Account</Text>
      <Controller
        control={control}
        name="account"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <View className="bg-gray-800 rounded">
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              dropdownIconColor="#fff"
             >
              <Picker.Item label="Select Account" value="" />
              {accounts.map((acc) => (
                <Picker.Item key={acc} label={acc} value={acc} />
              ))}
            </Picker>
          </View>
        )}
      />
    </View>
  );
}
