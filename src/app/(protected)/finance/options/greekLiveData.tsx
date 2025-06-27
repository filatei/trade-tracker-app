// src/app/(protected)/finance/options/greekLiveData.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { getDeribitGreeks, listDeribitOptionsChain, getUnderlyingPrice } from '@/lib/api/deribit';

export default function OptionsChainScreen() {
  const [underlyingPrice, setUnderlyingPrice] = useState<number | null>(null);
  const [expiryDates, setExpiryDates] = useState<string[]>([]);
  const [selectedExpiry, setSelectedExpiry] = useState<string>('');
  const [chainData, setChainData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGreeks, setShowGreeks] = useState(false);

  useEffect(() => {
    const fetchUnderlying = async () => {
      const price = await getUnderlyingPrice();
      setUnderlyingPrice(price);
    };
    fetchUnderlying();
    const interval = setInterval(fetchUnderlying, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadExpiries = async () => {
      const chain = await listDeribitOptionsChain();
      const dates = Object.keys(chain);
      setExpiryDates(dates);
      if (dates.length > 0) setSelectedExpiry(dates[0]);
    };
    loadExpiries();
  }, []);

  useEffect(() => {
    if (!selectedExpiry) return;
    const loadChain = async () => {
      setLoading(true);
      try {
        const chain = await listDeribitOptionsChain();
        setChainData(chain[selectedExpiry] || []);
      } catch (err) {
        console.log('Chain load error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadChain();
  }, [selectedExpiry]);

  return (
    <SafeAreaView className="flex-1 bg-black p-4">
      <ScrollView>
        <Text className="text-white text-2xl font-bold mb-2">Options Chain</Text>
        <Text className="text-white mb-4 text-sm">
          BTC Index: {underlyingPrice ? `$${underlyingPrice.toFixed(2)}` : '...'}
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {expiryDates.map((expiry) => (
            <Pressable
              key={expiry}
              onPress={() => setSelectedExpiry(expiry)}
              className={`px-4 py-2 rounded-full mr-2 ${selectedExpiry === expiry ? 'bg-yellow-600' : 'bg-gray-700'}`}
            >
              <Text className="text-white font-semibold">{expiry}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-white">Show Greeks</Text>
          <Switch value={showGreeks} onValueChange={setShowGreeks} />
        </View>

        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <ScrollView horizontal>
            <View>
              <View className="flex-row border-b border-gray-600 py-2">
                <Text className="text-gray-300 w-28">Call Bid</Text>
                <Text className="text-gray-300 w-28">Call Ask</Text>
                <Text className="text-gray-300 w-20">Strike</Text>
                <Text className="text-gray-300 w-28">Put Bid</Text>
                <Text className="text-gray-300 w-28">Put Ask</Text>
              </View>
              {chainData.map((row, i) => (
                <View
                  key={i}
                  className={`flex-row py-2 border-b border-gray-800 ${Math.abs(row.strike - (underlyingPrice || 0)) < 100 ? 'bg-yellow-800/20' : ''}`}
                >
                  <Text className="text-green-400 w-28">{row.call_bid}</Text>
                  <Text className="text-green-400 w-28">{row.call_ask}</Text>
                  <Text className="text-white w-20">{row.strike}</Text>
                  <Text className="text-red-400 w-28">{row.put_bid}</Text>
                  <Text className="text-red-400 w-28">{row.put_ask}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}