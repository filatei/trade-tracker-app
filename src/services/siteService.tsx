// src/services/siteService.ts
import api from './api';

export const getSites = async () => {
  const response = await api.get('/sites/list');
  return response.data.sites;
};