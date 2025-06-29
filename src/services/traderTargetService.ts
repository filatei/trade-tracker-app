// src/services/traderProfitService.ts
import api from './api';

export interface TargetEntry {
  targetDate: string; // ISO string or Date.toISOString()
  initialAmount: number;
  targetAmount: number;
  startDate: string;
}

export const submitTarget = async (payload: TargetEntry): Promise<any> => {
  console.log('submitTarget', payload);
  const res = await api.post('/tradetargets', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const getTargets = async (): Promise<any[]> => {
  console.log('getTargets');
  const res = await api.get(`/tradetargets/`);
  console.log('getTargets', res.data);
  return res.data;
};


export const getGrowthSchedule = async (
  startDate: string,
  targetAmount: number,
  initialAmount: number
): Promise<any> => {
  const res = await api.get(`/tradetargets/growthschedule?startDate=${startDate}&targetAmount=${targetAmount}&initialAmount=${initialAmount}`);
  return res.data;
};


export const deleteTarget = async (id: string): Promise<void> => {
  await api.delete(`/tradetargets/${id}`);
}
