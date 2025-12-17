# Coinbase Integration - Quick Reference

## ✅ What Was Integrated

### Real Market Data from Coinbase Exchange API

**New Service:** `src/lib/coinbaseMarketData.js`
- ✅ Real-time price feeds via WebSocket
- ✅ Historical candlestick data (OHLCV)
- ✅ Order book (Level 2 - top 50 bids/asks)
- ✅ Recent trade history
- ✅ 24-hour statistics
- ✅ Technical indicators (MACD, RSI)

### Updated Components

1. **TradingChart.jsx**
   - Fetches real candles from Coinbase
   - Calculates real MACD and RSI indicators
   - Stable historical data (no morphing)
   - Only last candle updates with live price
   - Loading states + error handling

2. **DexExchange.jsx**
   - Real-time price via WebSocket
   - Live 24h high/low/volume stats
   - Ticker data updates every second

3. **OrderBook.jsx**
   - Real order book from Coinbase
   - Updates every 3 seconds
   - Top 15 bids and asks

4. **TradeHistory.jsx**
   - Real trade history
   - Live trade updates via WebSocket
   - Last 20 trades displayed

## 🔑 API Info

**No API Key Required!** 
Coinbase Exchange public endpoints are free and don't require authentication for:
- Market data
- Price feeds
- Order books
- Trade history

Your `CLIENT_API_KEY` in `.env.local` is for Coinbase CDP SDK (blockchain operations), not needed for market data.

## 📡 Endpoints Used

### REST API
```
Base: https://api.exchange.coinbase.com

GET /products/{pair}/ticker      → Current price, volume
GET /products/{pair}/candles     → Historical OHLCV data
GET /products/{pair}/book        → Order book
GET /products/{pair}/trades      → Recent trades
GET /products/{pair}/stats       → 24h statistics
```

### WebSocket
```
URL: wss://ws-feed.exchange.coinbase.com

Channels:
- ticker   → Real-time price updates
- matches  → Live trade executions
```

## 🎯 Trading Pairs Available

Currently configured:
- BTC/USDT (BTC-USDT on Coinbase)
- ETH/USDT (ETH-USDT)
- SOL/USDT (SOL-USDT)
- AVAX/USDT (AVAX-USDT)

**To add more pairs:**
Edit `PAIR_MAP` in `src/lib/coinbaseMarketData.js`

## ⚙️ How It Works

### Price Updates
1. Initial fetch via REST API
2. WebSocket connects on component mount
3. Real-time updates stream every ~1 second
4. Only current candle updates (no chart morphing!)

### Chart Behavior
- **Historical candles**: Fixed, loaded once per timeframe
- **Current candle**: Updates OHLC with live price
- **Indicators**: Calculated from real candle data
- **Stable**: Perfect for drawing trend lines

### Performance
- WebSocket connections reuse across components
- Auto-reconnect on disconnect (5 attempts)
- Efficient updates (only changed data)

## 🚀 Features

### Real Data ✅
- Live prices from Coinbase Exchange
- Accurate historical candles
- Real order book depth
- Actual trade executions

### Stable Charts ✅
- No morphing/shifting
- Fixed historical data
- Smooth current candle updates
- Trend lines stay in place

### Professional ✅
- Loading states
- Error handling
- WebSocket reconnection
- Clean data formatting

## 🔧 Customization

### Adjust Update Frequency

**Order Book:**
```javascript
// In OrderBook.jsx, line ~30
intervalId = setInterval(loadOrderBook, 3000); // 3 seconds
```

**Chart Candles:**
```javascript
// In TradingChart.jsx
// Auto-updates with WebSocket price changes
```

### Add New Indicators

```javascript
// In coinbaseMarketData.js
export function calculateBollingerBands(candles, period = 20) {
  // Your calculation here
}
```

### Change Timeframes

Supported granularities (in seconds):
- 60 (1m)
- 300 (5m)
- 900 (15m)
- 3600 (1h)
- 21600 (4h)
- 86400 (1d)

## 📊 Data Flow

```
Coinbase Exchange
    ↓
REST API → Initial data fetch
    ↓
WebSocket → Real-time updates
    ↓
coinbaseMarketData.js → Data formatting
    ↓
Components → Display & UI
```

## ⚠️ Important Notes

1. **Rate Limits**: Coinbase public API has rate limits (~10 requests/second)
2. **WebSocket**: Maintains persistent connection (auto-reconnects)
3. **CORS**: Works in browser (Coinbase allows cross-origin)
4. **No Auth**: Market data is public, no API key needed
5. **Production**: This is production-ready for market data

## 🐛 Troubleshooting

### "Loading market data..." forever
- Check browser console for errors
- Verify internet connection
- Coinbase API may be down (check status.coinbase.com)

### WebSocket disconnects
- Auto-reconnect enabled (up to 5 attempts)
- Check firewall/proxy settings
- Network may be blocking WSS connections

### Wrong prices
- Verify trading pair format (BTC/USDT vs BTC-USDT)
- Check `PAIR_MAP` in coinbaseMarketData.js
- Ensure pair exists on Coinbase Exchange

## 📈 Next Steps

Want more features?
1. **Advanced Charts**: Integrate TradingView library
2. **More Pairs**: Add all Coinbase Exchange pairs
3. **Depth Chart**: Visualize order book as area chart
4. **Trade Execution**: Connect to Coinbase Advanced Trade API
5. **Portfolio**: Track user holdings and P&L

---

**You now have REAL market data! 🎉**
