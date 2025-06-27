// src/app/(protected)/finance/options/index.tsx
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';

export default function OptionsIntroScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black p-4">
      <ScrollView>
        <Text className="text-white text-3xl font-bold mb-4">Options Trading Hub</Text>

        <View className="mb-6 bg-gray-900 p-4 rounded-xl border border-gray-700">
          <Text className="text-yellow-400 text-xl font-semibold mb-1">📘 Learn the Greeks</Text>
          <Text className="text-white mb-2">
            Understand how Delta, Gamma, Theta, Vega, and Rho affect your option trades.
          </Text>
          <Link href="/finance/options/greeks">
            <Text className="text-indigo-400 font-bold">Explore Greeks →</Text>
          </Link>
        </View>

        <View className="mb-6 bg-gray-900 p-4 rounded-xl border border-gray-700">
          <Text className="text-yellow-400 text-xl font-semibold mb-1">📈 Strategies</Text>
          <Text className="text-white mb-2">
            Discover effective strategies like spreads, straddles, condors, and more — with Greek profiles.
          </Text>
          <Link href="/finance/options/strategyDefinitions">
            <Text className="text-indigo-400 font-bold">Explore Strategies →</Text>
          </Link>
        </View>

        <View className="mb-6 bg-gray-900 p-4 rounded-xl border border-gray-700">
          <Text className="text-yellow-400 text-xl font-semibold mb-1">📊 Risk/Reward Charts</Text>
          <Text className="text-white mb-2">
            Visualise the profit/loss profile of common option strategies with charts.
          </Text>
          <Link href="/finance/options/riskDiagrams">
            <Text className="text-indigo-400 font-bold">Explore Charts →</Text>
          </Link>

          <Link href="/finance/options/greekLiveData">
            <Text className="text-indigo-400 font-bold">View Live Greeks →</Text>
        </Link>
        </View>

        <Text className="text-gray-400 text-sm mt-4">
          More features coming soon: Real-time Greek scanners, AI-powered strategy advisor, BTC COT signals.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
