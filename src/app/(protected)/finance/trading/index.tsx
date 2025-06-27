// src/app/(protected)/finance/trading/index.tsx
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

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

export default function TradingOverviewScreen() {
  const [accounts, setAccounts] = useState<MTAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await fetch('http://192.168.1.197:3600/api/mt/accounts');
        const data = await res.json();
        setAccounts(data);
      } catch (err) {
        console.log('Error loading accounts', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-black p-4">
      <ScrollView>
        <Text className="text-white text-2xl font-bold mb-4">Trading Overview</Text>
        <Text className="text-white mb-4">Welcome to the Trading section. Select an account or place a trade.</Text>

        <Text className="text-yellow-400 font-semibold mb-2 text-lg">Connected Accounts</Text>

        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          accounts.map((acc) => (
            <Pressable
              key={acc.id}
              onPress={() => router.push({ pathname: 'trade', params: { accountId: acc.id } })}
              className="border border-gray-700 rounded-lg p-4 mb-4"
            >
              <Text className="text-yellow-400 font-bold text-lg">
                {acc.broker} - {acc.accountNumber}
              </Text>
              <Text className="text-white">Balance: {acc.balance} {acc.currency}</Text>
              <Text className="text-white">Equity: {acc.equity}</Text>
              <Text className="text-white">Margin: {acc.margin}</Text>
              <Text className="text-white">Free Margin: {acc.freeMargin}</Text>
              <Text className={`font-semibold ${acc.status === 'connected' ? 'text-green-500' : 'text-red-500'}`}>
                Status: {acc.status}
              </Text>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}