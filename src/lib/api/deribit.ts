// src/lib/api/deribit.ts
import axios from 'axios';

const DERIBIT_API_BASE = 'https://www.deribit.com/api/v2';

export const getDeribitGreeks = async (instrumentName: string) => {
  try {
    const response = await axios.get(`${DERIBIT_API_BASE}/public/get_order_book`, {
      params: { instrument_name: instrumentName },
    });
    return response.data.result;
  } catch (error) {
    console.error('Deribit API error:', error);
    return null;
  }
};

export async function getUnderlyingPrice() {
  try {
    const response = await axios.get(`${DERIBIT_API_BASE}/public/get_index_price`, {
      params: { index_name: 'btc_usd' },
    });
    return response.data.result.index_price;
  } catch (error) {
    console.error('Error fetching index price:', error);
    return null;
  }
}

export async function listDeribitOptionsChain(currency: string = 'BTC') {
  try {
    const response = await axios.get(`${DERIBIT_API_BASE}/public/get_instruments`, {
      params: {
        currency,
        kind: 'option',
        expired: false,
      },
    });

    const list = response.data.result || [];
    const grouped = list.reduce((acc, item) => {
      const date = new Date(item.expiration_timestamp);
      const expiry = date.toISOString().split('T')[0]; // e.g. '2025-06-01'
      if (!acc[expiry]) acc[expiry] = [];

      acc[expiry].push({
        instrument_name: item.instrument_name,
        strike: item.strike,
        option_type: item.option_type, // 'call' or 'put'
        bid: item.best_bid_price || 0,
        ask: item.best_ask_price || 0,
        iv: item.iv || 0,
        greeks: item.greeks || {},
      });

      return acc;
    }, {} as Record<string, any[]>);

    return grouped;
  } catch (error) {
    console.error('Error fetching options chain:', error);
    return {};
  }
}

export async function listDeribitInstrumentsWithPrices(baseCoin = 'BTC') {
  try {
    const { data } = await axios.get(`${DERIBIT_API_BASE}/public/get_instruments`, {
      params: { currency: baseCoin, kind: 'option', expired: false },
    });

    const list = data.result || [];

    // Group by expiry month with full instrument data
    const grouped = list.reduce((acc, item) => {
      const expiry = item.expiration_timestamp;
      const date = new Date(expiry);
      const expiryCode = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
      }).replace(/ /g, '').toUpperCase(); // e.g., 30MAY25

      if (!acc[expiryCode]) acc[expiryCode] = [];
      acc[expiryCode].push({
        name: item.instrument_name,
        bid: item.best_bid_price || 0,
        ask: item.best_ask_price || 0,
      });

      return acc;
    }, {} as Record<string, { name: string; bid: number; ask: number }[]>);

    return grouped;
  } catch (err) {
    console.error('Failed to fetch instruments with prices:', err.message || err);
    return {};
  }
}