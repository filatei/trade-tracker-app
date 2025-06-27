// src/app/(protected)/finance/options/greeks.tsx
import { View, Text, ScrollView, SafeAreaView } from 'react-native';

const greeks = [
  {
    name: 'Delta',
    description: 'Measures the rate of change of option price with respect to changes in the underlying asset price.',
    insight: 'Delta values range from -1 to 1. A high positive delta (close to 1) indicates the option behaves like the underlying asset (call). A negative delta (close to -1) indicates a put option. Buyers benefit when the underlying moves in their favour.',
  },
  {
    name: 'Gamma',
    description: 'Measures the rate of change in delta with respect to the underlying price.',
    insight: 'High gamma means delta will change rapidly — important for short-term traders. At-the-money options have the highest gamma.',
  },
  {
    name: 'Theta',
    description: 'Measures the time decay of an option — how much value the option loses each day as it nears expiration.',
    insight: 'Sellers benefit from positive theta (option value decays). Buyers face time decay as a cost.',
  },
  {
    name: 'Vega',
    description: 'Measures sensitivity to volatility. How much the price of an option changes with a 1% change in implied volatility.',
    insight: 'Options become more valuable with higher volatility. Vega is highest for at-the-money options and for longer timeframes.',
  },
  {
    name: 'Rho',
    description: 'Measures sensitivity to interest rate changes.',
    insight: 'Least important for short-term trades. Positive for calls, negative for puts — but only significant when rates shift strongly.',
  },
];

export default function GreeksScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black p-4">
      <ScrollView>
        <Text className="text-white text-3xl font-bold mb-4">Understanding the Greeks</Text>
        {greeks.map((gk, idx) => (
          <View key={idx} className="mb-6 bg-gray-900 rounded-xl p-4 border border-gray-700">
            <Text className="text-yellow-400 text-xl font-semibold">{gk.name}</Text>
            <Text className="text-white mt-2">{gk.description}</Text>
            <Text className="text-gray-400 mt-1 italic">{gk.insight}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
