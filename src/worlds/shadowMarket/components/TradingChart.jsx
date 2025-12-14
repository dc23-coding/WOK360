import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function TradingChart({ selectedPair, currentPrice }) {
  const chartContainerRef = useRef(null);
  const [chartType, setChartType] = useState("candlestick"); // candlestick, line, area
  const [timeframe, setTimeframe] = useState("1h"); // 1m, 5m, 15m, 1h, 4h, 1d
  const [indicators, setIndicators] = useState({
    volume: true,
    macd: false,
    rsi: false,
    ma: false,
  });
  const [drawingMode, setDrawingMode] = useState(null); // trendline, fibonacci, horizontal
  const [canvasData, setCanvasData] = useState({
    candlesticks: [],
    volume: [],
    macd: [],
    rsi: [],
  });

  // Generate mock OHLCV data
  useEffect(() => {
    const generateData = () => {
      const data = [];
      const volumeData = [];
      const macdData = [];
      const rsiData = [];
      let basePrice = currentPrice || 43000;
      
      const timeframes = {
        "1m": 200,
        "5m": 200,
        "15m": 200,
        "1h": 168,
        "4h": 180,
        "1d": 365,
      };

      const periods = timeframes[timeframe] || 200;

      for (let i = periods; i > 0; i--) {
        const timestamp = Date.now() - i * 60000;
        const open = basePrice;
        const volatility = basePrice * 0.02;
        const change = (Math.random() - 0.5) * volatility;
        const close = open + change;
        const high = Math.max(open, close) + Math.random() * volatility * 0.5;
        const low = Math.min(open, close) - Math.random() * volatility * 0.5;
        const volume = Math.random() * 1000000 + 500000;

        data.push({ timestamp, open, high, low, close });
        volumeData.push({ timestamp, value: volume, color: close > open ? "#22c55e" : "#ef4444" });
        
        // Mock MACD
        macdData.push({
          timestamp,
          macd: Math.sin(i / 20) * 100,
          signal: Math.sin(i / 20 + 0.5) * 100,
          histogram: Math.sin(i / 20) * 50 - Math.sin(i / 20 + 0.5) * 50,
        });

        // Mock RSI
        const rsi = 30 + Math.random() * 40;
        rsiData.push({ timestamp, value: rsi });

        basePrice = close;
      }

      setCanvasData({
        candlesticks: data,
        volume: volumeData,
        macd: macdData,
        rsi: rsiData,
      });
    };

    generateData();
  }, [selectedPair, timeframe, currentPrice]);

  // Draw canvas chart (simplified representation)
  useEffect(() => {
    const canvas = chartContainerRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillRect(0, 0, width, height);

    if (canvasData.candlesticks.length === 0) return;

    // Calculate price range
    const prices = canvasData.candlesticks.flatMap(c => [c.high, c.low]);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const priceRange = maxPrice - minPrice;

    const chartHeight = indicators.volume || indicators.macd || indicators.rsi ? height * 0.65 : height;
    const candleWidth = width / canvasData.candlesticks.length;

    // Draw grid
    ctx.strokeStyle = "rgba(139, 92, 246, 0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      // Price labels
      const price = maxPrice - (priceRange / 5) * i;
      ctx.fillStyle = "rgba(168, 85, 247, 0.5)";
      ctx.font = "10px monospace";
      ctx.fillText(price.toFixed(2), 5, y + 12);
    }

    // Draw candlesticks
    canvasData.candlesticks.forEach((candle, i) => {
      const x = i * candleWidth + candleWidth / 2;
      const openY = chartHeight - ((candle.open - minPrice) / priceRange) * chartHeight;
      const closeY = chartHeight - ((candle.close - minPrice) / priceRange) * chartHeight;
      const highY = chartHeight - ((candle.high - minPrice) / priceRange) * chartHeight;
      const lowY = chartHeight - ((candle.low - minPrice) / priceRange) * chartHeight;

      const isGreen = candle.close > candle.open;
      ctx.strokeStyle = isGreen ? "#22c55e" : "#ef4444";
      ctx.fillStyle = isGreen ? "#22c55e" : "#ef4444";

      // Draw wick
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // Draw body
      const bodyHeight = Math.abs(closeY - openY) || 1;
      const bodyY = Math.min(openY, closeY);
      ctx.fillRect(x - candleWidth / 3, bodyY, candleWidth * 0.66, bodyHeight);
    });

    // Draw volume bars
    if (indicators.volume) {
      const volumeHeight = height * 0.2;
      const volumeY = chartHeight + 10;
      const maxVolume = Math.max(...canvasData.volume.map(v => v.value));

      canvasData.volume.forEach((vol, i) => {
        const x = i * candleWidth;
        const barHeight = (vol.value / maxVolume) * volumeHeight;
        ctx.fillStyle = vol.color + "80";
        ctx.fillRect(x, volumeY + volumeHeight - barHeight, candleWidth * 0.8, barHeight);
      });

      // Volume label
      ctx.fillStyle = "rgba(168, 85, 247, 0.7)";
      ctx.font = "12px sans-serif";
      ctx.fillText("Volume", 10, volumeY + 15);
    }

    // Draw MACD
    if (indicators.macd) {
      const macdHeight = height * 0.15;
      const macdY = chartHeight + (indicators.volume ? height * 0.2 + 20 : 10);
      
      ctx.fillStyle = "rgba(168, 85, 247, 0.7)";
      ctx.font = "12px sans-serif";
      ctx.fillText("MACD", 10, macdY + 15);

      canvasData.macd.forEach((data, i) => {
        const x = i * candleWidth + candleWidth / 2;
        const histY = macdY + macdHeight / 2;
        const histHeight = (data.histogram / 200) * macdHeight;
        
        ctx.fillStyle = data.histogram > 0 ? "#22c55e80" : "#ef444480";
        ctx.fillRect(x - candleWidth / 3, histY - histHeight / 2, candleWidth * 0.66, Math.abs(histHeight));
      });
    }

    // Draw RSI
    if (indicators.rsi) {
      const rsiHeight = height * 0.15;
      const rsiY = chartHeight + (indicators.volume ? height * 0.2 + 20 : 10) + (indicators.macd ? height * 0.15 + 10 : 0);
      
      ctx.fillStyle = "rgba(168, 85, 247, 0.7)";
      ctx.font = "12px sans-serif";
      ctx.fillText("RSI", 10, rsiY + 15);

      // RSI lines (30, 70)
      ctx.strokeStyle = "rgba(168, 85, 247, 0.3)";
      ctx.setLineDash([5, 5]);
      [30, 70].forEach(level => {
        const y = rsiY + rsiHeight - (level / 100) * rsiHeight;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // RSI line
      ctx.strokeStyle = "#a855f7";
      ctx.lineWidth = 2;
      ctx.beginPath();
      canvasData.rsi.forEach((data, i) => {
        const x = i * candleWidth + candleWidth / 2;
        const y = rsiY + rsiHeight - (data.value / 100) * rsiHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

  }, [canvasData, indicators, chartType]);

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl overflow-hidden">
      {/* Chart Controls */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20">
        <div className="flex items-center gap-4">
          {/* Chart Type */}
          <div className="flex gap-2">
            {[
              { type: "candlestick", icon: "📊" },
              { type: "line", icon: "📈" },
              { type: "area", icon: "📉" },
            ].map(({ type, icon }) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  chartType === type
                    ? "bg-purple-500/30 text-purple-200"
                    : "bg-white/5 text-white/50 hover:bg-white/10"
                }`}
              >
                {icon}
              </button>
            ))}
          </div>

          {/* Timeframes */}
          <div className="flex gap-1">
            {["1m", "5m", "15m", "1h", "4h", "1d"].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  timeframe === tf
                    ? "bg-purple-500/30 text-purple-200"
                    : "bg-white/5 text-white/40 hover:bg-white/10"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Indicators */}
          <div className="flex gap-2">
            {[
              { key: "volume", label: "Vol" },
              { key: "macd", label: "MACD" },
              { key: "rsi", label: "RSI" },
              { key: "ma", label: "MA" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setIndicators(prev => ({ ...prev, [key]: !prev[key] }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  indicators[key]
                    ? "bg-purple-500/30 text-purple-200"
                    : "bg-white/5 text-white/40 hover:bg-white/10"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Drawing Tools */}
        <div className="flex gap-2">
          {[
            { mode: "trendline", icon: "📏", label: "Trend" },
            { mode: "fibonacci", icon: "🔢", label: "Fib" },
            { mode: "horizontal", icon: "—", label: "H-Line" },
          ].map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => setDrawingMode(drawingMode === mode ? null : mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                drawingMode === mode
                  ? "bg-pink-500/30 text-pink-200 shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                  : "bg-white/5 text-white/40 hover:bg-white/10"
              }`}
              title={label}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative p-6" style={{ height: "600px" }}>
        <canvas
          ref={chartContainerRef}
          width={1400}
          height={560}
          className="w-full h-full"
        />
        
        {/* Drawing Mode Indicator */}
        {drawingMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 bg-pink-500/20 backdrop-blur-xl border border-pink-500/40 rounded-lg px-4 py-2"
          >
            <span className="text-pink-200 text-sm font-medium">
              {drawingMode === "trendline" && "📏 Click two points to draw trend line"}
              {drawingMode === "fibonacci" && "🔢 Click two points for Fibonacci retracement"}
              {drawingMode === "horizontal" && "— Click to draw horizontal line"}
            </span>
          </motion.div>
        )}

        {/* Crosshair Info Box (mock) */}
        <div className="absolute top-8 right-8 bg-black/60 backdrop-blur-xl border border-purple-500/30 rounded-lg px-4 py-3 text-xs font-mono">
          <div className="text-purple-300/70 mb-1">O: <span className="text-white">{currentPrice?.toFixed(2)}</span></div>
          <div className="text-purple-300/70 mb-1">H: <span className="text-green-400">{(currentPrice * 1.005)?.toFixed(2)}</span></div>
          <div className="text-purple-300/70 mb-1">L: <span className="text-red-400">{(currentPrice * 0.995)?.toFixed(2)}</span></div>
          <div className="text-purple-300/70">C: <span className="text-white">{currentPrice?.toFixed(2)}</span></div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-3 border-t border-purple-500/20 flex items-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
          <span className="text-green-400">Bullish</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
          <span className="text-red-400">Bearish</span>
        </div>
        {indicators.macd && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-purple-400"></div>
            <span className="text-purple-400">MACD Signal</span>
          </div>
        )}
        {indicators.rsi && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-purple-400"></div>
            <span className="text-purple-400">RSI (14)</span>
          </div>
        )}
      </div>
    </div>
  );
}
