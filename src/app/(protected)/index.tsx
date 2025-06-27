// Imports and setup
import { View, TextInput, Button, Modal, Pressable, Alert, TouchableOpacity, ActivityIndicator, FlatList, ScrollView } from 'react-native';
import { Text } from '@/components/Text';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Image } from 'expo-image';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { submitProfit, getProfits } from '@/services/traderProfitService';
import { ProgressChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { getTargets, submitTarget } from '@/services/traderTargetService';
import DailyGrowthTable from '@/components/DailyGrowthTable';

export default function HomeScreen() {
  const { user, isSignedIn } = useUser();
  const { signOut } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [targetModalVisible, setTargetModalVisible] = useState(false);
  const [newTargetModalVisible, setNewTargetModalVisible] = useState(false);
  const [profit, setProfit] = useState('');
  const [profits, setProfits] = useState<any[]>([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [targetId, setTargetId] = useState('');
  const [targets, setTargets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTargetAmount, setNewTargetAmount] = useState('');
  const [newInitialAmount, setNewInitialAmount] = useState('');
  const [newStartDate, setNewStartDate] = useState(new Date());
  const [newTargetDate, setNewTargetDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showTargetDatePicker, setShowTargetDatePicker] = useState(false);
  const [expandSchedule, setExpandSchedule] = useState(false);

  const activeTarget = targets.find(t => t._id === targetId);
  const currentAmount = profits.reduce((acc, p) => acc + p.amount, 0);
  const targetAmount = activeTarget?.targetAmount || 1000000;
  const percentageAchieved = (currentAmount + (activeTarget?.initialAmount || 0)) / targetAmount || 0.01;

  useEffect(() => {
    if (!isSignedIn) {
      router.replace('/(auth)/sign-in');
      return;
    }
    const fetchData = async () => {
      try {
        const ts = await getTargets();
        setTargets(ts);
        const active = ts.find(t => t.status === 'active');
        if (active) setTargetId(active._id);
        else if (ts.length > 0) setTargetId(ts[0]._id);
      } catch (err) {
        console.error('Failed to fetch targets:', err);
      }
    };
    fetchData();
  }, [isSignedIn]);

  useEffect(() => {
    if (!targetId) return;
    const fetchProfits = async () => {
      try {
        const profits = await getProfits(targetId);
        setProfits(profits);
      } catch (err) {
        console.error('Failed to fetch profits:', err);
        Toast.show({ type: 'error', text1: 'Could not load profits' });
      }
    };
    fetchProfits();
  }, [targetId]);

  const handleAddProfit = async () => {
    Alert.alert('Confirm', `Submit profit of $${profit} on ${date.toDateString()}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'OK',
        onPress: async () => {
          try {
            setLoading(true);
            await submitProfit({ date: date.toISOString(), amount: parseFloat(profit), targetId });
            Toast.show({ type: 'success', text1: 'Profit Saved', text2: `$${profit} on ${date.toDateString()}` });
            setAddModalVisible(false);
            setProfit('');
            setDate(new Date());
          } catch (err) {
            const offlineQueue = JSON.parse(await AsyncStorage.getItem('offlineProfits') || '[]');
            offlineQueue.push({ date, amount: parseFloat(profit), targetId });
            await AsyncStorage.setItem('offlineProfits', JSON.stringify(offlineQueue));
            Alert.alert('Offline', 'Saved locally and will sync later');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  if (!targetId && targets.length > 0) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0A84FF" />
        <Text className="mt-2">Loading target data...</Text>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView className="flex-1 px-4 pt-6 bg-white">
      {/* Dashboard remains above */}
      <Text className="text-xl font-bold text-gray-800 mb-4">📈 Trader Dashboard</Text>
      <Text className="text-lg mb-2">Progress toward ${targetAmount.toLocaleString()}</Text>
      <ProgressChart
        data={{ labels: ['Profit'], data: [percentageAchieved] }}
        width={Dimensions.get('window').width - 40}
        height={160}
        strokeWidth={12}
        radius={32}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          color: (opacity = 1) => `rgba(10, 132, 255, ${opacity})`,
          labelColor: () => '#333',
        }}
        hideLegend={false}
      />
      <Text className="mt-2 text-center mb-4">
        ${currentAmount.toLocaleString()} / ${targetAmount.toLocaleString()}
      </Text>

      {/* Control buttons */}
      <View className="flex-row justify-end space-x-3 mb-4">
        <TouchableOpacity onPress={() => setAddModalVisible(true)} className="bg-blue-500 px-4 py-2 rounded">
          <Text className="text-white font-semibold">➕ Add Profit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTargetModalVisible(true)} className="bg-gray-500 px-4 py-2 rounded">
          <Text className="text-white font-semibold">🎯 Select Target</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setNewTargetModalVisible(true)} className="bg-green-500 px-4 py-2 rounded">
          <Text className="text-white font-semibold">➕ New Target</Text>
        </TouchableOpacity>
      </View>

      {/* Daily Growth Estimates Toggle */}
      <TouchableOpacity onPress={() => setExpandSchedule(!expandSchedule)} className="mb-2">
        <Text className="text-lg text-blue-600 underline">{expandSchedule ? 'Hide' : 'Show'} Daily Growth Estimates</Text>
      </TouchableOpacity>

      {expandSchedule && activeTarget?.startDate && (
        <DailyGrowthTable
          startDate={activeTarget.startDate}
          initialAmount={activeTarget.initialAmount || 200}
          targetAmount={activeTarget.targetAmount || 1000000}
        />
      )}

    </ScrollView>
  );
}
