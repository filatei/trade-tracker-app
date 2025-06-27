// src/app/(protected)/finance/options/OptionsChainScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { getUnderlyingPrice, listDeribitOptionsChain } from '@/lib/api/deribit';

interface OptionRow {
  strike: number;
  mark: number;
  bid?: number;
  ask?: number;
}

export default function OptionsChainScreen() {
  const [underlying, setUnderlying] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [expiryTabs, setExpiryTabs] = useState<string[]>([]);
  const [selectedExpiry, setSelectedExpiry] = useState('');
  const [calls, setCalls] = useState<OptionRow[]>([]);
  const [puts, setPuts] = useState<OptionRow[]>([]);

  useEffect(() => {
    const fetchUnderlying = async () => {
      const price = await getUnderlyingPrice();
      setUnderlying(price);
    };
    fetchUnderlying();
    const interval = setInterval(fetchUnderlying, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const chain = await listDeribitOptionsChain('BTC');
        const expiries = Object.keys(chain);
        setExpiryTabs(expiries);
        const selected = selectedExpiry || expiries[0];
        setSelectedExpiry(selected);

        const options = chain[selected];
        const callRows: OptionRow[] = [];
        const putRows: OptionRow[] = [];

        for (const item of options) {
          const strike = parseFloat(item.strike);
          const row: OptionRow = {
            strike,
            mark: (item.bid + item.ask) / 2,
            bid: item.bid,
            ask: item.ask,
          };
          if (item.option_type === 'call') callRows.push(row);
          else putRows.push(row);
        }

        callRows.sort((a, b) => a.strike - b.strike);
        putRows.sort((a, b) => a.strike - b.strike);

        setCalls(callRows);
        setPuts(putRows);
      } catch (err) {
        console.log('Error loading options:', err.message || err);
      } finally {
        setLoading(false);
      }
    };

    if (selectedExpiry) fetchOptions();
  }, [selectedExpiry]);

  const atmStrike = underlying ? Math.round(underlying / 500) * 500 : 0;

  return (
    <SafeAreaView className="flex-1 bg-black p-4">
      <ScrollView>
        <Text className="text-white text-2xl font-bold mb-2">BTC Options Chain</Text>
        <Text className="text-white mb-4 text-lg">
          Underlying: {underlying ? `$${underlying.toFixed(2)}` : 'Loading...'}
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {expiryTabs.map((exp) => (
            <Pressable
              key={exp}
              className={`px-4 py-2 mr-2 rounded-full ${
                exp === selectedExpiry ? 'bg-yellow-600' : 'bg-gray-700'
              }`}
              onPress={() => setSelectedExpiry(exp)}
            >
              <Text className="text-white font-semibold">{exp}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <View className="flex-row border-b border-gray-700 py-2">
            <Text className="text-white flex-1 text-center font-bold">CALL Bid</Text>
            <Text className="text-white flex-1 text-center font-bold">CALL Ask</Text>
            <Text className="text-white flex-1 text-center font-bold">Strike</Text>
            <Text className="text-white flex-1 text-center font-bold">PUT Bid</Text>
            <Text className="text-white flex-1 text-center font-bold">PUT Ask</Text>
          </View>
        )}

        {!loading &&
          calls.map((call, idx) => {
            const put = puts.find((p) => p.strike === call.strike);
            const isATM = call.strike === atmStrike;
            return (
              <View
                key={call.strike}
                className={`flex-row py-2 border-b border-gray-800 ${
                  isATM ? 'bg-yellow-900/30' : ''
                }`}
              >
                <Text className="text-green-400 flex-1 text-center">{call.bid}</Text>
                <Text className="text-green-400 flex-1 text-center">{call.ask}</Text>
                <Text className="text-yellow-400 flex-1 text-center font-bold">
                  {call.strike}
                </Text>
                <Text className="text-red-400 flex-1 text-center">{put?.bid ?? '-'}</Text>
                <Text className="text-red-400 flex-1 text-center">{put?.ask ?? '-'}</Text>
              </View>
            );
          })}
      </ScrollView>
    </SafeAreaView>
  );
}