// src/app/(protected)/finance/trading/placeTrade.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  SafeAreaView,
} from 'react-native';

export default function PlaceTradeScreen() {
  const [symbol, setSymbol] = useState('EURUSD');
  const [volume, setVolume] = useState('0.1');
  const [type, setType] = useState<'buy' | 'sell'>('buy');
  const [accounts, setAccounts] = useState<string[]>([]); // Account IDs to send trade to
  const [log, setLog] = useState<string>('');

  const handlePlaceTrade = async () => {
    try {
      const res = await fetch('https://your-server.com/api/placeTrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, volume, type, accounts }),
      });
      const data = await res.json();
      setLog(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setLog('Error placing trade: ' + err.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black p-4">
      <ScrollView>
        <Text className="text-white text-2xl font-bold mb-4">Place Trade</Text>

        <Text className="text-white mb-1">Symbol</Text>
        <TextInput
          className="bg-gray-800 text-white p-2 rounded mb-4"
          value={symbol}
          onChangeText={setSymbol}
        />

        <Text className="text-white mb-1">Volume (e.g., 0.1)</Text>
        <TextInput
          className="bg-gray-800 text-white p-2 rounded mb-4"
          value={volume}
          onChangeText={setVolume}
          keyboardType="decimal-pad"
        />

        <Text className="text-white mb-1">Type</Text>
        <View className="flex-row mb-4">
          <Pressable
            onPress={() => setType('buy')}
            className={`flex-1 p-2 rounded ${type === 'buy' ? 'bg-green-600' : 'bg-gray-700'}`}
          >
            <Text className="text-white text-center">Buy</Text>
          </Pressable>
          <Pressable
            onPress={() => setType('sell')}
            className={`flex-1 p-2 rounded ml-2 ${type === 'sell' ? 'bg-red-600' : 'bg-gray-700'}`}
          >
            <Text className="text-white text-center">Sell</Text>
          </Pressable>
        </View>

        <Text className="text-white mb-1">Select Accounts</Text>
        {/* This should be replaced with a dynamic account list */}
        <View className="bg-gray-800 rounded p-2 mb-4">
          <Pressable
            onPress={() => setAccounts((prev) => prev.includes('acc1') ? prev.filter(a => a !== 'acc1') : [...prev, 'acc1'])}
          >
            <Text className={`text-white ${accounts.includes('acc1') ? 'font-bold' : ''}`}>Account #acc1</Text>
          </Pressable>
          <Pressable
            onPress={() => setAccounts((prev) => prev.includes('acc2') ? prev.filter(a => a !== 'acc2') : [...prev, 'acc2'])}
          >
            <Text className={`text-white ${accounts.includes('acc2') ? 'font-bold' : ''}`}>Account #acc2</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handlePlaceTrade}
          className="bg-yellow-500 p-3 rounded mb-4"
        >
          <Text className="text-black text-center font-bold">Place Trade</Text>
        </Pressable>

        <Text className="text-white mt-4">Log Output:</Text>
        <Text className="text-gray-300 text-xs mt-2 whitespace-pre-line">{log}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}