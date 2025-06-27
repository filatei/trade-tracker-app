// src/app/(protected)/finance/options/VolatilitySmileScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Share,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { listDeribitOptionsChain, getUnderlyingPrice } from '@/lib/api/deribit';
import VolatilitySmileChart from './VolatilitySmileChart';

export default function VolatilitySmileScreen() {
  const [expiries, setExpiries] = useState<string[]>([]);
  const [selectedExpiry, setSelectedExpiry] = useState('');
  const [ivData, setIvData] = useState<{ strike: number; iv: number }[]>([]);
  const [underlying, setUnderlying] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [pattern, setPattern] = useState<string>('');

  useEffect(() => {
    const loadUnderlying = async () => {
      const price = await getUnderlyingPrice();
      setUnderlying(price);
    };
    loadUnderlying();
    const interval = setInterval(loadUnderlying, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadOptions = async () => {
      setLoading(true);
      try {
        const chain = await listDeribitOptionsChain();
        const keys = Object.keys(chain);
        setExpiries(keys);

        const defaultExpiry = selectedExpiry || keys[0];
        setSelectedExpiry(defaultExpiry);

        const strikes = chain[defaultExpiry]
          .filter((o) => o.option_type === 'call')
          .map((o) => ({ strike: o.strike, iv: o.iv }))
          .sort((a, b) => a.strike - b.strike);

        setIvData(strikes);
        detectPattern(strikes);
      } catch (err) {
        console.log('Error loading IV data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadOptions();
  }, [selectedExpiry]);

  const detectPattern = (data: { strike: number; iv: number }[]) => {
    if (data.length < 3) return;
    const minIV = Math.min(...data.map((d) => d.iv));
    const minIndex = data.findIndex((d) => d.iv === minIV);

    if (minIndex > 0 && minIndex < data.length - 1) {
      setPattern('U-shape (Volatility Smile)');
    } else if (minIndex === 0) {
      setPattern('Skewed Right (Falling Smile)');
    } else if (minIndex === data.length - 1) {
      setPattern('Skewed Left (Rising Smile)');
    } else {
      setPattern('Flat or Irregular');
    }
  };

  const exportToCSV = () => {
    const csv = 'Strike,IV\n' + ivData.map((d) => `${d.strike},${d.iv}`).join('\n');
    Share.share({
      message: csv,
      title: 'Volatility Smile Data',
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-black p-4">
      <ScrollView>
        <Text className="text-white text-2xl font-bold mb-2 text-center">Volatility Smile</Text>
        <Text className="text-white text-center mb-2">
          Underlying: {underlying ? `$${underlying.toFixed(2)}` : 'Loading...'}
        </Text>

        <Picker
          selectedValue={selectedExpiry}
          onValueChange={(v) => setSelectedExpiry(v)}
          style={{ color: 'white', marginBottom: 12 }}
        >
          {expiries.map((e) => (
            <Picker.Item key={e} label={e} value={e} />
          ))}
        </Picker>

        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <VolatilitySmileChart data={ivData} />
            <Text className="text-indigo-400 text-center font-semibold mb-4">
              Detected Pattern: {pattern || 'Analysing...'}
            </Text>
            <Pressable
              onPress={exportToCSV}
              className="bg-yellow-600 py-2 rounded-lg mx-8 mt-2"
            >
              <Text className="text-white text-center font-bold">Export Smile Data</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}