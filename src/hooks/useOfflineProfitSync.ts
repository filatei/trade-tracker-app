// src/hooks/useOfflineProfitSync.ts
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { submitProfit, getProfits } from '@/services/traderProfitService';

export function useOfflineProfitSync(targetId: string, setProfits: (profits: any[]) => void) {
  useEffect(() => {
    if (!targetId) return;

    const syncOfflineProfits = async () => {
      const queue = JSON.parse(await AsyncStorage.getItem('offlineProfits') || '[]');
      if (!queue.length) return;

      const successful = [];
      for (const entry of queue) {
        try {
          await submitProfit({
            date: new Date(entry.date).toISOString(),
            amount: entry.amount,
            targetId: entry.targetId,
          });
          successful.push(entry);
        } catch (err) {
          console.warn('Sync failed for', entry);
        }
      }

      if (successful.length) {
        const remaining = queue.filter(q => !successful.includes(q));
        await AsyncStorage.setItem('offlineProfits', JSON.stringify(remaining));
        const updated = await getProfits(targetId);
        setProfits(updated);
      }
    };

    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) syncOfflineProfits();
    });

    return () => unsubscribe();
  }, [targetId]);
}
