import { View, TextInput, Button, FlatList, Text, useColorScheme, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function ProfitEditorScreen() {
  const currentDay = 8;
  const totalTarget = 1000000;
  const startingCapital = 200.0;
  const colorScheme = useColorScheme();

  const [profitEntries, setProfitEntries] = useState(
    Array.from({ length: currentDay }, (_, i) => ({
      day: i + 1,
      profit: 0.0,
      date: `2025-06-${String(10 + i).padStart(2, '0')}`,
    }))
  );

  const totalProfits = profitEntries.reduce((acc, val) => acc + Number(val.profit || 0), 0);
  const grandTotal = startingCapital + totalProfits;

  const updateProfit = (day: number, newValue: string) => {
    const numeric = parseFloat(newValue.replace(/[^0-9.]/g, '')) || 0;
    setProfitEntries((entries) =>
      entries.map((e) =>
        e.day === day ? { ...e, profit: numeric } : e
      )
    );
  };

  const handleSave = () => {
    console.log('Saved:', profitEntries);
  };

  return (
    <SafeAreaView className={`flex-1 ${colorScheme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <View className="p-4">
          <Text className={`text-2xl font-bold mb-4 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
            Edit Profits (Days 1–{currentDay})
          </Text>

          <FlatList
            data={profitEntries}
            keyExtractor={(item) => item.day.toString()}
            renderItem={({ item }) => (
              <View className="flex-row items-center mb-3 gap-3">
                <Text className={`w-20 text-base ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                  Day {item.day}
                </Text>
                <TextInput
                  className={`border rounded px-3 py-1 w-28 ${
                    colorScheme === 'dark'
                      ? 'border-gray-600 text-white bg-gray-800'
                      : 'border-gray-300 text-black bg-white'
                  }`}
                  keyboardType="decimal-pad"
                  value={item.profit.toString()}
                  onChangeText={(val) => updateProfit(item.day, val)}
                />
                <Text className={`${colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  ${item.profit}
                </Text>
              </View>
            )}
          />

          <Text className={`text-lg font-semibold mt-4 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
            Total Profits: ${totalProfits.toFixed(2)}  
          </Text>
          <Text className={`text-lg font-semibold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
            Total with Capital: ${grandTotal.toFixed(2)} / ${totalTarget.toLocaleString()}
          </Text>

          <View className="mt-4 space-y-3">
            <Button title="Save Changes" onPress={handleSave} />
            <Button title="← Back" onPress={() => router.back()} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
