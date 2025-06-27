// src/app/(protected)/finance/options/strategyDefinitions.tsx
import { View, Text, ScrollView, SafeAreaView } from 'react-native';

const strategies = [
  {
    name: 'Bull Call Spread',
    type: 'Vertical Spread',
    description: 'Buy a call at a lower strike, sell a call at a higher strike. Limited risk and reward.',
    idealGreeks: 'Moderate Delta, Low Theta, Moderate Vega',
    whenToUse: 'Expect moderate rise in underlying asset.',
  },
  {
    name: 'Bear Put Spread',
    type: 'Vertical Spread',
    description: 'Buy a put at a higher strike, sell a put at a lower strike. Limited risk and reward.',
    idealGreeks: 'Negative Delta, Low Theta, Moderate Vega',
    whenToUse: 'Expect moderate fall in underlying asset.',
  },
  {
    name: 'Long Straddle',
    type: 'Volatility Strategy',
    description: 'Buy a call and a put at the same strike and expiration. Profits if price moves sharply.',
    idealGreeks: 'High Vega, Low Theta',
    whenToUse: 'Expect high volatility but unsure of direction.',
  },
  {
    name: 'Iron Condor',
    type: 'Neutral Strategy',
    description: 'Sell a bull put spread and a bear call spread. Limited risk/reward, profits if price stays in range.',
    idealGreeks: 'Low Delta, Positive Theta',
    whenToUse: 'Expect low volatility and range-bound market.',
  },
  {
    name: 'Butterfly Spread',
    type: 'Neutral Strategy',
    description: 'Combines bull and bear spreads. Maximum profit if underlying remains near middle strike.',
    idealGreeks: 'Low Delta, High Theta',
    whenToUse: 'Expect underlying to stay near strike price.',
  },
];

export default function StrategyDefinitionsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black p-4">
      <ScrollView>
        <Text className="text-white text-3xl font-bold mb-4">Options Strategies Overview</Text>
        {strategies.map((strat, idx) => (
          <View key={idx} className="mb-6 bg-gray-900 rounded-xl p-4 border border-gray-700">
            <Text className="text-yellow-400 text-xl font-semibold">{strat.name}</Text>
            <Text className="text-white mt-1">Type: {strat.type}</Text>
            <Text className="text-white mt-2">{strat.description}</Text>
            <Text className="text-gray-300 mt-2">When to Use: {strat.whenToUse}</Text>
            <Text className="text-gray-400 mt-1 italic">Ideal Greeks: {strat.idealGreeks}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
