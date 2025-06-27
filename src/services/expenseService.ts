// src/services/expenseService.ts
import api from './api';

interface ExpensePayload {
  title: string;
  remarks?: string;
  category: string;
  account: string;
  site: string;
  vendor: string;
  products: string; // JSON stringified array
}

export const createExpense = async (formData: FormData): Promise<any> => {
  const res = await api.post('/expenses/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const deleteExpense = async (id: string) => {
  const res = await api.delete(`/expenses/delete/${id}`);
  return res.data;
};

export const getExpenses = async (params: {
  page?: number;
  search?: string;
  status?: string;
  site?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const qs = new URLSearchParams();
  qs.append('pagesize', '10');
  if (params.page) qs.append('page', String(params.page));
  if (params.search) qs.append('search', params.search);
  if (params.status && params.status !== 'ALL') qs.append('status', params.status);
  if (params.site) qs.append('site', params.site);
  if (params.startDate) qs.append('startDate', params.startDate);
  if (params.endDate) qs.append('endDate', params.endDate);

  const res = await api.get(`/expenses/list?${qs.toString()}`);
  return res.data.expenses;
};

export const getExpenseById = async (id: string) => {
  const res = await api.get(`/expenses/get-expense/${id}`);
  return res.data.expense;
};

export const updateExpense = async (id: string, payload: any) => {
  const res = await api.put(`/expenses/update-expense/${id}`, payload);
  return res.data;
};

export const updateExpenseStatus = async (id: string, status: string) => {
  const res = await api.put(`/expenses/update-expense/${id}`, {
    action: 'status',
    status,
  });
  return res.data.expense;
};


export const updateExpenseNote = async (id: string, formData: FormData) => {
  const res = await api.put(`/expenses/update-expense/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const resetExpenseStatus = async (id: string) => {
  const res = await api.put(`/expenses/update-expense/${id}`, {
    action: 'reset'
  });
  return res.data.expense;
};

export const editExpense = async (id: string, payload: {
  title: string;
  category: string;
  site: string;
  vendor: string;
  products: any[];
}) => {
  const res = await api.put(`/expenses/update-expense/${id}`, {
    action: 'edit',
    ...payload,
    products: JSON.stringify(payload.products), // <-- 👈 stringified here
  });
  return res.data.expense;
};

export const submitPayment = async (id: string, formData: FormData) => {
  const res = await api.put(`/expenses/update-expense/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};
