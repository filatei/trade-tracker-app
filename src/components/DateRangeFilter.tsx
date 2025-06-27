// components/DateRangeFilter.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';

interface DateRangeFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  showDatePicker: (mode: 'start' | 'end') => void;
  onClear: () => void;
  onApply: () => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  showDatePicker,
  onClear,
  onApply,
}) => {
  return (
    <View className="px-4 mt-2">
      <Text className="text-white mb-1">Filter by Date Range</Text>

      <View className="flex-row justify-between">
        <Pressable
          onPress={() => showDatePicker('start')}
          className="bg-gray-700 rounded p-3 flex-1 mr-2"
        >
          <Text className="text-white">
            {startDate ? format(startDate, 'MMM dd, yyyy') : 'Start Date'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => showDatePicker('end')}
          className="bg-gray-700 rounded p-3 flex-1"
        >
          <Text className="text-white">
            {endDate ? format(endDate, 'MMM dd, yyyy') : 'End Date'}
          </Text>
        </Pressable>
      </View>

      {startDate && endDate && (
        <View className="flex-row items-center gap-2 mt-3">
          <Pressable
            onPress={onApply}
            disabled={!startDate || !endDate}
            className={`flex-1 rounded p-3 items-center ${
              startDate && endDate ? 'bg-green-600' : 'bg-gray-600 opacity-50'
            }`}
          >
            <Text className="text-white font-bold">Apply</Text>
          </Pressable>

          <Pressable
            onPress={onClear}
            className="bg-red-500 rounded-full p-3 justify-center items-center"
            style={{ width: 48, height: 48 }}
          >
            <Ionicons name="close" size={20} color="white" />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default DateRangeFilter;
