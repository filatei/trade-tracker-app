// src/components/GreekChart.tsx
import { View, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width - 32;

interface GreekChartProps {
  deribit: { delta: number; gamma: number; theta: number; vega: number };
//   bybit: { delta: number; gamma: number; theta: number; vega: number };
}

export default function GreekChart({ deribit }: GreekChartProps) {
  return (
    <View className="mt-6">
      <Text className="text-white font-bold text-lg mb-2">Visual Comparison</Text>
      <BarChart
        data={{
          labels: ['Delta', 'Gamma', 'Theta', 'Vega'],
          datasets: [
            {
              data: [
                deribit?.delta ?? 0,
                deribit?.gamma ?? 0,
                deribit?.theta ?? 0,
                deribit?.vega ?? 0,
              ],
            },
            // {
            //   data: [
            //     bybit?.delta ?? 0,
            //     bybit?.gamma ?? 0,
            //     bybit?.theta ?? 0,
            //     bybit?.vega ?? 0,
            //   ],
            // },
          ],
        }}
        width={screenWidth}
        height={220}
        yAxisSuffix=""
        yAxisLabel=""
        fromZero
        withInnerLines={false}
        chartConfig={{
          backgroundColor: '#000',
          backgroundGradientFrom: '#1f2937',
          backgroundGradientTo: '#1f2937',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: () => '#aaa',
          barPercentage: 0.5,
          propsForLabels: {
            fontSize: 12,
          },
          propsForBackgroundLines: {
            strokeDasharray: '', // solid background lines with default color
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
          },
          barColors: ['#ff0000', '#00ff00'], // Red for Deribit, Green for Bybit
        } as any}
      />
    </View>
  );
}