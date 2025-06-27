// src/components/DarkPicker.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Controller } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';

interface Option {
  label: string;
  value: string;
}

interface DarkPickerProps {
  control?: any; // optional now
  name?: string;
  label: string;
  options?: Option[];
  required?: boolean;

  // For controlled local state mode:
  value?: string;
  onChange?: (val: string) => void;

  onSelect?: (item: Option) => void;
}

export default function DarkPicker({
  control,
  name,
  label,
  options = [],
  required = true,
  value,
  onChange,
  onSelect,
}: DarkPickerProps) {
  const handleSelect = (val: string, fieldOnChange?: (val: string) => void) => {
    if (fieldOnChange) fieldOnChange(val);
    if (onChange) onChange(val);
    const selected = options.find((opt) => opt.value === val);
    if (onSelect && selected) onSelect(selected);
  };

  if (control && name) {
    return (
      <View className="mt-4">
        <Text className="mb-2 text-white">{label}</Text>
        <Controller
          control={control}
          name={name}
          rules={required ? { required: true } : {}}
          render={({ field: { onChange: fieldOnChange, value: fieldValue } }) => (
            <View className="bg-gray-800 rounded border border-gray-600">
              <Picker
                selectedValue={fieldValue}
                onValueChange={(val) => handleSelect(val, fieldOnChange)}
                dropdownIconColor="#fff"
                style={{ color: 'white', backgroundColor: '#1f2937' }}
              >
                <Picker.Item label={`Select ${label}`} value="" />
                {options.map((opt) => (
                  <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                ))}
              </Picker>
            </View>
          )}
        />
      </View>
    );
  }

  // Local controlled mode
  return (
    <View className="mt-4">
      <Text className="mb-2 text-white">{label}</Text>
      <View className="bg-gray-800 rounded border border-gray-600">
        <Picker
          selectedValue={value}
          onValueChange={(val) => handleSelect(val)}
          dropdownIconColor="#fff"
          style={{ color: 'white', backgroundColor: '#1f2937' }}
        >
          <Picker.Item label={`Select ${label}`} value="" />
          {options.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
}