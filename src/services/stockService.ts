// src/services/stockService.ts
import api from './api';

export const searchStockItems = async (searchTerm: string) => {
  const res = await api.get('/stockitem/search', {
    params: {
      pagesize: 50,
      page: 1,
      searchTerm,
    },
  });
  return res.data.stockItems || [];
};

export const createStockItem = async (data: { name: string }) => {
  const res = await api.post('/stockitem/create', data);
  return res.data.stockitem;
};
