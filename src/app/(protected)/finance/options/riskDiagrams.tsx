// src/app/(protected)/finance/options/riskDiagrams.tsx
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const chartWidth = Dimensions.get('window').width - 40;

const strategies = [
  {
    name: 'Long Call',
    description: 'Buy a call option expecting the underlying asset to rise.',
    labels: ['-20%', '-10%', '0%', '+10%', '+20%'],
    data: [-100, -50, -20, 50, 150],
  },
  {
    name: 'Long Put',
    description: 'Buy a put option expecting the asset to fall.',
    labels: ['-20%', '-10%', '0%', '+10%', '+20%'],
    data: [150, 50, -20, -50, -100],
  },
  {
    name: 'Covered Call',
    description: 'Own stock + sell call. Limits upside, earns premium.',
    labels: ['-20%', '-10%', '0%', '+10%', '+20%'],
    data: [-100, -50, 0, 50, 50],
  },
  {
    name: 'Straddle',
    description: 'Buy call + put. Profits from large move either direction.',
    labels: ['-20%', '-10%', '0%', '+10%', '+20%'],
    data: [-50, -30, -20, 60, 150],
  },
];

export default function RiskDiagramsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black p-4">
      <ScrollView>
        <Text className="text-white text-3xl font-bold mb-4">Risk/Reward Charts</Text>
        {strategies.map((s, idx) => (
          <View key={idx} className="mb-8 bg-gray-900 p-4 rounded-xl border border-gray-700">
            <Text className="text-yellow-400 text-xl font-semibold mb-1">{s.name}</Text>
            <Text className="text-white mb-4">{s.description}</Text>
            <LineChart
              data={{
                labels: s.labels,
                datasets: [{ data: s.data }],
              }}
              width={chartWidth}
              height={200}
              withDots={true}
              withShadow={false}
              chartConfig={{
                backgroundColor: '#000000',
                backgroundGradientFrom: '#1f2937',
                backgroundGradientTo: '#1f2937',
                decimalPlaces: 0,
                color: () => `rgba(255, 255, 255, 0.9)`,
                labelColor: () => `rgba(255, 255, 255, 0.6)`,
                style: { borderRadius: 16 },
              }}
              bezier
              style={{ borderRadius: 12 }}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
