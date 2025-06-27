// src/lib/ws/deribitStream.ts
import ReconnectingWebSocket from 'reconnecting-websocket';
import WS from 'isomorphic-ws';

const ws = new ReconnectingWebSocket('wss://www.deribit.com/ws/api/v2', [], {
  WebSocket: WS,
});

const subscribers: Record<string, (data: any) => void> = {};

export function subscribeToIVStrikeChain(
  instrumentName: string,
  onUpdate: (ivByStrike: { strike: number; iv: number }[]) => void
) {
  const subscriptionId = `iv_smile_${instrumentName}`;

  const handleMessage = (event: MessageEvent) => {
    const message = JSON.parse(event.data);

    if (message.method === 'subscription' && message.params?.channel.includes('book.')) {
      const { instrument_name, greeks, underlying_price } = message.params?.data;
      if (!instrument_name || !greeks) return;

      const strike = parseFloat(instrument_name.split('-')[2]);
      const iv = greeks.iv;
      onUpdate([{ strike, iv }]);
    }
  };

  ws.addEventListener('message', handleMessage);

  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        jsonrpc: '2.0',
        id: subscriptionId,
        method: 'public/subscribe',
        params: {
          channels: [`book.${instrumentName}.none.10.100ms`],
        },
      })
    );
  };

  subscribers[subscriptionId] = handleMessage;

  return () => {
    delete subscribers[subscriptionId];
    ws.send(
      JSON.stringify({
        jsonrpc: '2.0',
        id: subscriptionId,
        method: 'public/unsubscribe',
        params: {
          channels: [`book.${instrumentName}.none.10.100ms`],
        },
      })
    );
    ws.removeEventListener('message', handleMessage);
  };
}