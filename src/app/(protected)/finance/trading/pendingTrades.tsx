// src/app/(protected)/finance/trading/pendingTrades.tsx
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { io, Socket } from 'socket.io-client';
import { APP_CONFIG } from '@/config/constants';

interface Trade {
  _id: string;
  symbol: string;
  volume: number;
  type: 'buy' | 'sell';
  accounts: string[];
  status: 'pending' | 'executed' | 'failed';
  createdAt: string;
}

export default function PendingTradesScreen() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingTrades = async () => {
    try {
      const res = await fetch(`${APP_CONFIG.MT_API_URL}/pendingTrades`);
      const data = await res.json();
      setTrades(data);
    } catch (err) {
      console.error('Error loading trades:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (tradeId: string) => {
    try {
      const res = await fetch(`${APP_CONFIG.MT_API_URL}/approveTrade/${tradeId}`, {
        method: 'POST',
      });
      const data = await res.json();
      console.log('Approval result:', data);
    } catch (err) {
      console.error('Error approving trade:', err);
    }
  };

  const handleReject = async (tradeId: string) => {
    try {
      const res = await fetch(`${APP_CONFIG.MT_API_URL}/rejectTrade/${tradeId}`, {
        method: 'POST',
      });
      const data = await res.json();
      console.log('Rejection result:', data);
    } catch (err) {
      console.error('Error rejecting trade:', err);
    }
  };

  useEffect(() => {
    fetchPendingTrades();

    const socket: Socket = io(APP_CONFIG.MT_API_URL!.replace('/api', ''));

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('tradeUpdate', (updatedTrade: Trade) => {
      setTrades((prev) =>
        prev.map((t) => (t._id === updatedTrade._id ? updatedTrade : t))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-black p-4">
      <ScrollView>
        <Text className="text-white text-2xl font-bold mb-4">Pending Trades</Text>

        {loading ? (
          <ActivityIndicator color="white" />
        ) : trades.length === 0 ? (
          <Text className="text-white">No pending trades.</Text>
        ) : (
          trades.map((trade) => (
            <View
              key={trade._id}
              className="border border-gray-700 rounded-lg p-4 mb-4"
            >
              <Text className="text-yellow-400 font-bold text-lg">
                {trade.symbol} - {trade.type.toUpperCase()}
              </Text>
              <Text className="text-white">Volume: {trade.volume}</Text>
              <Text className="text-white">Accounts: {trade.accounts.join(', ')}</Text>
              <Text className="text-white">Status: {trade.status}</Text>
              <Text className="text-white text-xs">Created: {new Date(trade.createdAt).toLocaleString()}</Text>

              {trade.status === 'pending' && (
                <View className="flex-row mt-3">
                  <Pressable
                    className="flex-1 bg-green-600 p-2 rounded mr-2"
                    onPress={() => handleApprove(trade._id)}
                  >
                    <Text className="text-white text-center font-bold">Approve</Text>
                  </Pressable>
                  <Pressable
                    className="flex-1 bg-red-600 p-2 rounded"
                    onPress={() => handleReject(trade._id)}
                  >
                    <Text className="text-white text-center font-bold">Reject</Text>
                  </Pressable>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}