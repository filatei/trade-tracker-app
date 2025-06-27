// src/services/traderProfitService.ts
import api from './api';

export interface ProfitEntry {
  date: string; // ISO string or Date.toISOString()
  amount: number;
  targetId: string;
}

export const submitProfit = async (payload: ProfitEntry): Promise<any> => {
  const res = await api.post('/trade-profits', payload);
  return res.data;
};

export const getProfits = async (targetId: string): Promise<any[]> => {
  const res = await api.get(`/trade-profits?targetId=${targetId}`);
  return res.data;
};

export const deleteProfit = async (id: string): Promise<void> => {
  await api.delete(`/trade-profits/${id}`);
}
