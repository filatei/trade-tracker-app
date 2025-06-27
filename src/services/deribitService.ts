// src/services/deribitService.ts
import axios from 'axios';
import { APP_CONFIG } from '@/config/constants';

const DERIBIT_BASE_URL = APP_CONFIG.DERIBIT_API_URL;

// Set your access key/token from .env if available
const ACCESS_KEY = APP_CONFIG.DERIBIT_API_KEY;
const SECRET_KEY = APP_CONFIG.DERIBIT_API_SECRET;

const deribitApi = axios.create({
  baseURL: DERIBIT_BASE_URL,
  timeout: 10000,
});

export const getInstruments = async (currency = 'BTC') => {
  const res = await deribitApi.get(`/public/get_instruments`, {
    params: {
      currency,
      kind: 'option',
      expired: false,
    },
  });
  return res.data.result;
};

export const getGreeksForInstrument = async (instrumentName: string) => {
  const res = await deribitApi.get(`/public/ticker`, {
    params: { instrument_name: instrumentName },
  });
  const {
    delta,
    gamma,
    theta,
    vega,
    rho,
    underlying_price,
    mark_price,
  } = res.data.result;

  return {
    instrument: instrumentName,
    delta,
    gamma,
    theta,
    vega,
    rho,
    underlying_price,
    mark_price,
  };
};

export const getGreeksForTopInstruments = async (currency = 'BTC', limit = 5) => {
  const instruments = await getInstruments(currency);
  const top = instruments.slice(0, limit);

  const results = await Promise.all(
    top.map((inst) => getGreeksForInstrument(inst.instrument_name))
  );
  return results;
};
