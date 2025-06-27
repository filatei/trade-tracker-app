// src/lib/api/bybit.ts
import axios from 'axios';

const BYBIT_API_BASE = 'https://api.bybit.com';

// ✅ Fetch option greeks (ticker stats) for a given symbol
export const getBybitOptionsGreeks = async (symbol: string) => {
  try {
    const response = await axios.get(`${BYBIT_API_BASE}/v5/market/tickers`, {
      params: {
        category: 'option',
        symbol,
      },
    });

    const data = response.data.result?.list?.[0];
    if (!data) return null;

    return {
      markPrice: parseFloat(data.markPrice),
      bid1Price: parseFloat(data.bid1Price),
      ask1Price: parseFloat(data.ask1Price),
      delta: parseFloat(data.delta),
      gamma: parseFloat(data.gamma),
      vega: parseFloat(data.vega),
      theta: parseFloat(data.theta),
      iv: parseFloat(data.iv),
    };
  } catch (error) {
    console.error('Bybit API error (getBybitOptionsGreeks):', error?.message || error);
    return null;
  }
};

// ✅ List all BTC option instruments (for dropdowns)
export async function listBybitInstruments() {
  try {
    const res = await axios.get(`${BYBIT_API_BASE}/v5/market/instruments-info`, {
      params: {
        category: 'option',
        baseCoin: 'BTC',
      },
    });

    const instruments = res.data.result.list;
    return instruments
      .filter((inst: any) => inst.status === 'Trading')
      .map((inst: any) => ({
        symbol: inst.symbol,
        expiry: inst.expiryDate, // in epoch ms
        strike: inst.strike,
        type: inst.optionType, // 'Call' | 'Put'
        quote: inst.quoteCoin,
      }));
  } catch (err) {
    console.error('Bybit API error (listBybitInstruments):', err?.message || err);
    return [];
  }
}