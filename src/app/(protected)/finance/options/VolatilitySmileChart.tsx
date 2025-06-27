// src/app/(protected)/finance/options/VolatilitySmileChart.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#1E1E1E',
  backgroundGradientTo: '#1E1E1E',
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: () => '#FFD700',
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#ffa726',
  },
};

export default function VolatilitySmileChart({
  data = [],
}: {
  data?: { strike: number; iv: number }[];
}) {
  if (!data || data.length === 0) {
    return (
      <View className="mb-8 items-center justify-center">
        <Text className="text-white text-lg">No data available yet.</Text>
      </View>
    );
  }

  const sorted = [...data].sort((a, b) => a.strike - b.strike);
  const labels = sorted.map((d) => d.strike.toString());
  const ivData = sorted.map((d) => d.iv);

  return (
    <View className="mb-8">
      <Text className="text-white text-lg font-bold mb-2 text-center">
        Implied Volatility Smile
      </Text>
      <LineChart
        data={{
          labels,
          datasets: [{ data: ivData }],
        }}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{ borderRadius: 16 }}
      />
    </View>
  );
}