// src/components/ProfitCalendar.tsx
import React from 'react';
import { Calendar } from 'react-native-calendars';
import { Alert } from 'react-native';

interface ProfitCalendarProps {
  profits: { date: string; amount: number }[];
}

export default function ProfitCalendar({ profits }: ProfitCalendarProps) {
  const markedDates = profits.reduce((acc, p) => {
    const dateKey = new Date(p.date).toISOString().split('T')[0];
    acc[dateKey] = { marked: true, dotColor: '#0A84FF' };
    return acc;
  }, {} as Record<string, any>);

  return (
    <Calendar
      markedDates={markedDates}
      onDayPress={(day) => {
        const profit = profits.find(p => p.date.startsWith(day.dateString));
        if (profit) {
          Alert.alert('Profit Entry', `$${profit.amount} on ${day.dateString}`);
        } else {
          Alert.alert('No Entry', `No profit submitted on ${day.dateString}`);
        }
      }}
      theme={{
        selectedDayBackgroundColor: '#0A84FF',
        todayTextColor: '#0A84FF',
        arrowColor: '#0A84FF',
      }}
      style={{ borderRadius: 10, marginBottom: 16 }}
    />
  );
}