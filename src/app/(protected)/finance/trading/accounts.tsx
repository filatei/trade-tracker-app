// src/app/(protected)/finance/trading/accounts.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';

interface MTAccount {
  id: string;
  broker: string;
  accountNumber: string;
  equity: number;
  balance: number;
  margin: number;
  freeMargin: number;
  currency: string;
  status: 'connected' | 'disconnected';
}

export default function AccountsScreen() {
  const [accounts, setAccounts] = useState<MTAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/mt/accounts');
        const data = await res.json();
        setAccounts(data);
      } catch (err) {
        console.log('Error loading accounts', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
    const interval = setInterval(fetchAccounts, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-black p-4">
      <ScrollView>
        <Text className="text-white text-2xl font-bold mb-4">Connected Accounts</Text>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          accounts.map((acc) => (
            <View key={acc.id} className="border border-gray-700 rounded-lg p-4 mb-4">
              <Text className="text-yellow-400 text-lg font-bold">
                {acc.broker} - {acc.accountNumber}
              </Text>
              <Text className="text-white">Balance: {acc.balance} {acc.currency}</Text>
              <Text className="text-white">Equity: {acc.equity}</Text>
              <Text className="text-white">Margin: {acc.margin}</Text>
              <Text className="text-white">Free Margin: {acc.freeMargin}</Text>
              <Text className={`font-semibold ${acc.status === 'connected' ? 'text-green-500' : 'text-red-500'}`}>Status: {acc.status}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}