import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Share } from 'react-native';
import { getGrowthSchedule } from '@/services/traderTargetService';

interface Props {
  startDate: string | Date;
  targetAmount: number;
  initialAmount: number;
}

const DailyGrowthTable: React.FC<Props> = ({ startDate, targetAmount, initialAmount }) => {
  const [schedule, setSchedule] = useState<any[]>([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await getGrowthSchedule(
          typeof startDate === 'string' ? startDate : startDate.toISOString(),
          targetAmount,
          initialAmount
        );
        setSchedule(response.schedule);
      } catch (err) {
        console.error('Failed to fetch schedule', err);
      }
    };

    fetchSchedule();
  }, [startDate, targetAmount, initialAmount]);

  const exportCSV = async () => {
    const headers = 'Index,Date,Day,Balance,Gain,Rate,Lot Size,Milestone\n';
    const rows = schedule
      .map(item =>
        `${item.index},${item.date},${item.day},${item.balance},${item.gain},${item.rate},${item.lotSize},${item.milestone}`
      )
      .join('\n');
    const csv = headers + rows;

    try {
      await Share.share({
        message: csv,
        title: 'Daily Growth Schedule',
      });
    } catch (err) {
      console.error('Failed to share CSV:', err);
    }
  };

  return (
    <View className="mt-4 border border-gray-200 rounded">
      <View className="flex-row justify-between items-center px-4 py-2 bg-gray-100 border-b border-gray-300">
        <Text className="font-bold text-base">📅 Daily Growth Plan</Text>
        <TouchableOpacity onPress={exportCSV} className="bg-blue-500 px-3 py-1 rounded">
          <Text className="text-white text-sm">Export CSV</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal>
        <View className="min-w-[800px]">
          <View className="flex-row bg-gray-50 py-2 px-3 border-b border-gray-200">
            <Text className="w-12 font-bold">#</Text>
            <Text className="w-24 font-bold">Date</Text>
            <Text className="w-16 font-bold">Day</Text>
            <Text className="w-28 font-bold">Balance</Text>
            <Text className="w-24 font-bold">Gain</Text>
            <Text className="w-20 font-bold">Rate</Text>
            <Text className="w-20 font-bold">Lot</Text>
            <Text className="w-32 font-bold">Milestone</Text>
          </View>
          <ScrollView style={{ maxHeight: 300 }}>
            {schedule.map((item, index) => (
              <View
                key={index}
                className={`flex-row px-3 py-1 border-b border-gray-100 ${
                  item.milestone ? 'bg-yellow-50' : ''
                }`}
              >
                <Text className="w-12">{item.index}</Text>
                <Text className="w-24">{item.date}</Text>
                <Text className="w-16">{item.day}</Text>
                <Text className="w-28">${Number(item.balance).toLocaleString()}</Text>
                <Text className="w-24">${Number(item.gain).toLocaleString()}</Text>
                <Text className="w-20">{item.rate}</Text>
                <Text className="w-20">{item.lotSize}</Text>
                <Text className="w-32">{item.milestone}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

export default DailyGrowthTable;
