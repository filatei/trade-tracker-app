// src/services/traderProfitService.ts
import api from './api';

export interface TargetEntry {
  targetDate: string; // ISO string or Date.toISOString()
  initialAmount: number;
  targetAmount: number;
  startDate: string;
}

export const submitTarget = async (payload: TargetEntry): Promise<any> => {
  const res = await api.post('/trade-targets', payload);
  return res.data;
};

export const getTargets = async (): Promise<any[]> => {
  const res = await api.get(`/trade-targets`);
  return res.data;
};


export const getGrowthSchedule = async (
  startDate: string,
  targetAmount: number,
  initialAmount: number
): Promise<any> => {
  const res = await api.get(`/trade-targets/growth-schedule?startDate=${startDate}&targetAmount=${targetAmount}&initialAmount=${initialAmount}`);
  return res.data;
};


export const deleteTarget = async (id: string): Promise<void> => {
  await api.delete(`/trade-targets/${id}`);
}
