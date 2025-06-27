// src/services/vendorService.ts
import api from './api';

export const searchVendors = async (searchTerm: string) => {
  const res = await api.get(`/contact/search`, {
    params: { searchTerm },
  });
  return res.data.contacts;
};

export const createVendor = async (data: { name: string }) => {
  const res = await api.post('/contact/create', data); // data = { name: "Vendor Name" }
  return res.data.contact;
};