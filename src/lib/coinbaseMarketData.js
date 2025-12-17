/**
 * Coinbase Market Data Service
 * Provides real-time prices, candles, order book, and trades
 * Uses Coinbase Exchange API (public endpoints - no auth required)
 */

const COINBASE_API_BASE = 'https://api.exchange.coinbase.com';
const COINBASE_WS_URL = 'wss://ws-feed.exchange.coinbase.com';

// Map our pair format to Coinbase product IDs
const PAIR_MAP = {
  'BTC/USDT': 'BTC-USDT',
  'ETH/USDT': 'ETH-USDT',
  'SOL/USDT': 'SOL-USDT',
  'AVAX/USDT': 'AVAX-USDT',
};

/**
 * Fetch current ticker data for a trading pair
 */
export async function fetchTicker(pair) {
  const productId = PAIR_MAP[pair] || 'BTC-USDT';
  
  try {
    const response = await fetch(`${COINBASE_API_BASE}/products/${productId}/ticker`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    return {
      price: parseFloat(data.price),
      volume: parseFloat(data.volume),
      bid: parseFloat(data.bid),
      ask: parseFloat(data.ask),
      high: parseFloat(data.high_24h || data.price * 1.02),
      low: parseFloat(data.low_24h || data.price * 0.98),
    };
  } catch (error) {
    console.error('Error fetching ticker:', error);
    return null;
  }
}

/**
 * Fetch historical candles (OHLCV data)
 * @param {string} pair - Trading pair (e.g., 'BTC/USDT')
 * @param {string} granularity - Time interval in seconds (60, 300, 900, 3600, 21600, 86400)
 * @param {number} periods - Number of candles to fetch (max 300)
 */
export async function fetchCandles(pair, granularity = 3600, periods = 200) {
  const productId = PAIR_MAP[pair] || 'BTC-USDT';
  
  // Coinbase requires start/end timestamps
  const end = Math.floor(Date.now() / 1000);
  const start = end - (granularity * periods);
  
  try {
    const url = `${COINBASE_API_BASE}/products/${productId}/candles?start=${start}&end=${end}&granularity=${granularity}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    
    // Coinbase returns: [timestamp, low, high, open, close, volume]
    // Sort by timestamp ascending (oldest first)
    const candles = data
      .map(([timestamp, low, high, open, close, volume]) => ({
        timestamp: timestamp * 1000, // Convert to milliseconds
        open: parseFloat(open),
        high: parseFloat(high),
        low: parseFloat(low),
        close: parseFloat(close),
        volume: parseFloat(volume),
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
    
    return candles;
  } catch (error) {
    console.error('Error fetching candles:', error);
    return [];
  }
}

/**
 * Fetch order book (Level 2 - top 50 bids/asks)
 */
export async function fetchOrderBook(pair, level = 2) {
  const productId = PAIR_MAP[pair] || 'BTC-USDT';
  
  try {
    const response = await fetch(`${COINBASE_API_BASE}/products/${productId}/book?level=${level}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    
    // Format: [price, size, num-orders]
    const formatOrders = (orders) => orders.map(([price, size]) => ({
      price: parseFloat(price),
      amount: parseFloat(size),
      total: parseFloat(price) * parseFloat(size),
    }));
    
    return {
      bids: formatOrders(data.bids.slice(0, 15)), // Top 15 bids
      asks: formatOrders(data.asks.slice(0, 15)), // Top 15 asks
    };
  } catch (error) {
    console.error('Error fetching order book:', error);
    return { bids: [], asks: [] };
  }
}

/**
 * Fetch recent trades
 */
export async function fetchTrades(pair, limit = 20) {
  const productId = PAIR_MAP[pair] || 'BTC-USDT';
  
  try {
    const response = await fetch(`${COINBASE_API_BASE}/products/${productId}/trades?limit=${limit}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    
    return data.map(trade => ({
      id: trade.trade_id,
      price: parseFloat(trade.price),
      amount: parseFloat(trade.size),
      total: parseFloat(trade.price) * parseFloat(trade.size),
      type: trade.side === 'buy' ? 'buy' : 'sell',
      time: new Date(trade.time),
    }));
  } catch (error) {
    console.error('Error fetching trades:', error);
    return [];
  }
}

/**
 * Fetch 24hr stats
 */
export async function fetch24HourStats(pair) {
  const productId = PAIR_MAP[pair] || 'BTC-USDT';
  
  try {
    const response = await fetch(`${COINBASE_API_BASE}/products/${productId}/stats`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    
    return {
      open: parseFloat(data.open),
      high: parseFloat(data.high),
      low: parseFloat(data.low),
      volume: parseFloat(data.volume),
      last: parseFloat(data.last),
    };
  } catch (error) {
    console.error('Error fetching 24h stats:', error);
    return null;
  }
}

/**
 * WebSocket connection for real-time updates
 */
export class CoinbaseWebSocket {
  constructor(pairs, channels = ['ticker', 'matches']) {
    this.ws = null;
    this.pairs = pairs;
    this.channels = channels;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(COINBASE_WS_URL);

    this.ws.onopen = () => {
      console.log('Coinbase WebSocket connected');
      this.reconnectAttempts = 0;
      
      // Subscribe to channels
      const productIds = this.pairs.map(pair => PAIR_MAP[pair] || pair);
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        product_ids: productIds,
        channels: this.channels,
      }));
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Emit to registered listeners
      this.listeners.forEach((callback) => {
        callback(data);
      });
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket closed');
      
      // Attempt reconnection
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => this.connect(), 2000 * this.reconnectAttempts);
      }
    };
  }

  on(event, callback) {
    this.listeners.set(event, callback);
  }

  off(event) {
    this.listeners.delete(event);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
  }
}

/**
 * Convert timeframe string to granularity in seconds
 */
export function getGranularity(timeframe) {
  const map = {
    '1m': 60,
    '5m': 300,
    '15m': 900,
    '1h': 3600,
    '4h': 14400,
    '1d': 86400,
    '1w': 604800,      // 1 week
    '1M': 2592000,     // ~30 days (approximation)
    '3M': 7776000,     // ~90 days
    '6M': 15552000,    // ~180 days
    '1y': 31536000,    // ~365 days
  };
  return map[timeframe] || 3600;
}

/**
 * Calculate technical indicators
 */
export function calculateMACD(candles, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  if (candles.length < slowPeriod) return [];
  
  const ema = (data, period) => {
    const k = 2 / (period + 1);
    let emaValue = data[0];
    return data.map(value => {
      emaValue = value * k + emaValue * (1 - k);
      return emaValue;
    });
  };

  const closes = candles.map(c => c.close);
  const fastEMA = ema(closes, fastPeriod);
  const slowEMA = ema(closes, slowPeriod);
  const macdLine = fastEMA.map((fast, i) => fast - slowEMA[i]);
  const signalLine = ema(macdLine, signalPeriod);
  
  return candles.map((candle, i) => ({
    timestamp: candle.timestamp,
    macd: macdLine[i] || 0,
    signal: signalLine[i] || 0,
    histogram: (macdLine[i] || 0) - (signalLine[i] || 0),
  }));
}

export function calculateRSI(candles, period = 14) {
  if (candles.length < period) return [];
  
  const changes = [];
  for (let i = 1; i < candles.length; i++) {
    changes.push(candles[i].close - candles[i - 1].close);
  }
  
  const rsiValues = [];
  for (let i = period; i < changes.length; i++) {
    const recentChanges = changes.slice(i - period, i);
    const gains = recentChanges.filter(c => c > 0).reduce((sum, c) => sum + c, 0) / period;
    const losses = Math.abs(recentChanges.filter(c => c < 0).reduce((sum, c) => sum + c, 0)) / period;
    
    const rs = losses === 0 ? 100 : gains / losses;
    const rsi = 100 - (100 / (1 + rs));
    
    rsiValues.push({
      timestamp: candles[i + 1].timestamp,
      value: rsi,
    });
  }
  
  return rsiValues;
}
