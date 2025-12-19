import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { fetchCandles, getGranularity, calculateMACD, calculateRSI } from "../../../lib/coinbaseMarketData";

export default function TradingChart({ selectedPair, currentPrice }) {
  const chartContainerRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const [chartType, setChartType] = useState("candlestick"); // candlestick, line, area
  const [timeframe, setTimeframe] = useState("1h");
  const [showExtendedTimeframes, setShowExtendedTimeframes] = useState(false);
  const [indicators, setIndicators] = useState({
    volume: true,
    macd: false,
    rsi: false,
    ma: false,
  });
  const [drawingMode, setDrawingMode] = useState(null); // trendline, ray, fibonacci, horizontal
  const [drawings, setDrawings] = useState([]); // Store all drawn elements
  const [drawingPoints, setDrawingPoints] = useState([]); // Temporary points while drawing
  const [canvasData, setCanvasData] = useState({
    candlesticks: [],
    volume: [],
    macd: [],
    rsi: [],
  });
  const historicalDataRef = useRef(null); // Store stable historical data
  const lastCandleRef = useRef(null); // Track current candle
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const priceScaleRef = useRef({ min: 0, max: 0, range: 0 });

  // Fetch REAL historical OHLCV data from Coinbase
  useEffect(() => {
    const loadHistoricalData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const granularity = getGranularity(timeframe);
        const candles = await fetchCandles(selectedPair, granularity, 200);
        
        if (!candles || candles.length === 0) {
          throw new Error('No data received from Coinbase');
        }

        // Generate volume data with colors
        const volumeData = candles.map(candle => ({
          timestamp: candle.timestamp,
          value: candle.volume,
          color: candle.close > candle.open ? "#22c55e" : "#ef4444",
        }));

        // Calculate technical indicators
        const macdData = calculateMACD(candles);
        const rsiData = calculateRSI(candles);

        historicalDataRef.current = {
          candlesticks: candles,
          volume: volumeData,
          macd: macdData,
          rsi: rsiData,
        };

        // Initialize current candle (last one)
        const lastCandle = candles[candles.length - 1];
        lastCandleRef.current = {
          open: lastCandle.open,
          high: lastCandle.high,
          low: lastCandle.low,
          close: lastCandle.close,
          timestamp: lastCandle.timestamp,
        };

        setCanvasData(historicalDataRef.current);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading Coinbase data:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    loadHistoricalData();
  }, [selectedPair, timeframe]); // Only reload when pair or timeframe changes

  // Update ONLY the current candle with live price changes
  useEffect(() => {
    if (!currentPrice || !historicalDataRef.current || !lastCandleRef.current) return;
    
    // Skip updates if we're still loading historical data
    if (isLoading) return;

    const updateCurrentCandle = () => {
      const current = lastCandleRef.current;
      
      // Update current candle OHLC
      current.close = currentPrice;
      current.high = Math.max(current.high, currentPrice);
      current.low = Math.min(current.low, currentPrice);

      // Clone historical data and update last candle
      const updatedData = { ...historicalDataRef.current };
      const lastIndex = updatedData.candlesticks.length - 1;
      
      updatedData.candlesticks[lastIndex] = {
        ...updatedData.candlesticks[lastIndex],
        close: current.close,
        high: current.high,
        low: current.low,
      };

      updatedData.volume[lastIndex] = {
        ...updatedData.volume[lastIndex],
        color: current.close > current.open ? "#22c55e" : "#ef4444",
      };

      setCanvasData(updatedData);
    };

    updateCurrentCandle();
  }, [currentPrice, isLoading]); // Only update when current price changes and not loading

  // Handle canvas clicks for drawing tools
  const handleCanvasClick = (event) => {
    if (!drawingMode || !chartContainerRef.current) return;

    const canvas = chartContainerRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert pixel coordinates to price
    const { min, max, range } = priceScaleRef.current;
    const chartHeight = canvas.height * (indicators.volume || indicators.macd || indicators.rsi ? 0.65 : 1);
    const price = max - (y / chartHeight) * range;

    const newPoint = { x, y, price, timestamp: Date.now() };

    if (drawingMode === 'horizontal') {
      // Horizontal line only needs one point
      setDrawings(prev => [...prev, {
        type: 'horizontal',
        points: [newPoint],
        color: '#0ea5e9',
      }]);
      setDrawingMode(null);
    } else if (drawingMode === 'trendline' || drawingMode === 'ray') {
      if (drawingPoints.length === 0) {
        // First point
        setDrawingPoints([newPoint]);
      } else {
        // Second point - complete the drawing
        setDrawings(prev => [...prev, {
          type: drawingMode,
          points: [drawingPoints[0], newPoint],
          color: '#0ea5e9',
        }]);
        setDrawingPoints([]);
        setDrawingMode(null);
      }
    } else if (drawingMode === 'fibonacci') {
      if (drawingPoints.length === 0) {
        // First point
        setDrawingPoints([newPoint]);
      } else {
        // Second point - complete Fibonacci retracement
        setDrawings(prev => [...prev, {
          type: 'fibonacci',
          points: [drawingPoints[0], newPoint],
          color: '#a855f7',
        }]);
        setDrawingPoints([]);
        setDrawingMode(null);
      }
    }
  };

  // Clear drawing mode on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setDrawingMode(null);
        setDrawingPoints([]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Draw canvas chart
  useEffect(() => {
    const canvas = chartContainerRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, width, height);

    if (canvasData.candlesticks.length === 0) return;

    // Calculate vertical space distribution
    const activeIndicators = [];
    if (indicators.volume) activeIndicators.push('volume');
    if (indicators.macd) activeIndicators.push('macd');
    if (indicators.rsi) activeIndicators.push('rsi');
    
    const indicatorCount = activeIndicators.length;
    const spacing = 20; // Gap between sections
    
    // Calculate heights
    let chartHeight;
    if (indicatorCount === 0) {
      chartHeight = height;
    } else if (indicatorCount === 1) {
      chartHeight = height * 0.70;
    } else if (indicatorCount === 2) {
      chartHeight = height * 0.60;
    } else {
      chartHeight = height * 0.50;
    }
    
    const indicatorHeightEach = indicatorCount > 0 ? (height - chartHeight - spacing * (indicatorCount + 1)) / indicatorCount : 0;
    
    // Calculate price range
    const prices = canvasData.candlesticks.flatMap(c => [c.high, c.low]);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const priceRange = maxPrice - minPrice;
    const candleWidth = width / canvasData.candlesticks.length;

    // Draw grid for main chart
    ctx.strokeStyle = "rgba(14, 165, 233, 0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      // Price labels
      const price = maxPrice - (priceRange / 5) * i;
      ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
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

    // Track current Y position for indicators
    let currentY = chartHeight + spacing;

    // Draw volume bars
    if (indicators.volume) {
      const volumeY = currentY;
      const volumeHeight = indicatorHeightEach;
      const maxVolume = Math.max(...canvasData.volume.map(v => v.value));

      // Volume label
      ctx.fillStyle = "rgba(14, 165, 233, 0.8)";
      ctx.font = "12px sans-serif";
      ctx.fillText("Volume", 10, volumeY + 15);

      canvasData.volume.forEach((vol, i) => {
        const x = i * candleWidth;
        const barHeight = (vol.value / maxVolume) * (volumeHeight - 20);
        ctx.fillStyle = vol.color + "60";
        ctx.fillRect(x, volumeY + volumeHeight - barHeight, candleWidth * 0.8, barHeight);
      });

      currentY += volumeHeight + spacing;
    }

    // Draw MACD
    if (indicators.macd) {
      const macdY = currentY;
      const macdHeight = indicatorHeightEach;
      
      ctx.fillStyle = "rgba(14, 165, 233, 0.8)";
      ctx.font = "12px sans-serif";
      ctx.fillText("MACD", 10, macdY + 15);

      canvasData.macd.forEach((data, i) => {
        const x = i * candleWidth + candleWidth / 2;
        const histY = macdY + macdHeight / 2;
        const histHeight = (data.histogram / 200) * (macdHeight - 40);
        
        ctx.fillStyle = data.histogram > 0 ? "#22c55e80" : "#ef444480";
        ctx.fillRect(x - candleWidth / 3, histY - histHeight / 2, candleWidth * 0.66, Math.abs(histHeight));
      });

      currentY += macdHeight + spacing;
    }

    // Draw RSI
    if (indicators.rsi) {
      const rsiY = currentY;
      const rsiHeight = indicatorHeightEach;
      
      ctx.fillStyle = "rgba(14, 165, 233, 0.8)";
      ctx.font = "12px sans-serif";
      ctx.fillText("RSI", 10, rsiY + 15);

      // RSI lines (30, 70)
      ctx.strokeStyle = "rgba(14, 165, 233, 0.3)";
      ctx.setLineDash([5, 5]);
      [30, 70].forEach(level => {
        const y = rsiY + rsiHeight - (level / 100) * (rsiHeight - 20);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // RSI line
      ctx.strokeStyle = "#0ea5e9";
      ctx.lineWidth = 2;
      ctx.beginPath();
      canvasData.rsi.forEach((data, i) => {
        const x = i * candleWidth + candleWidth / 2;
        const y = rsiY + rsiHeight - (data.value / 100) * (rsiHeight - 20);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // Store price scale for drawing tools
    priceScaleRef.current = { min: minPrice, max: maxPrice, range: priceRange };

    // Draw user drawings (trend lines, Fibonacci, etc.)
    drawings.forEach(drawing => {
      ctx.save();
      ctx.strokeStyle = drawing.color;
      ctx.lineWidth = 2;

      if (drawing.type === 'horizontal') {
        // Horizontal line across entire chart
        const y = chartHeight - ((drawing.points[0].price - minPrice) / priceRange) * chartHeight;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Price label
        ctx.fillStyle = drawing.color;
        ctx.font = "11px monospace";
        ctx.fillText(drawing.points[0].price.toFixed(2), width - 70, y - 5);
      } else if (drawing.type === 'trendline') {
        // Trend line between two points
        const y1 = chartHeight - ((drawing.points[0].price - minPrice) / priceRange) * chartHeight;
        const y2 = chartHeight - ((drawing.points[1].price - minPrice) / priceRange) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(drawing.points[0].x, y1);
        ctx.lineTo(drawing.points[1].x, y2);
        ctx.stroke();
      } else if (drawing.type === 'ray') {
        // Ray extends infinitely in one direction
        const y1 = chartHeight - ((drawing.points[0].price - minPrice) / priceRange) * chartHeight;
        const y2 = chartHeight - ((drawing.points[1].price - minPrice) / priceRange) * chartHeight;
        
        // Calculate slope and extend to edge of canvas
        const dx = drawing.points[1].x - drawing.points[0].x;
        const dy = y2 - y1;
        const slope = dy / dx;
        
        // Extend to right edge
        const extendX = width;
        const extendY = y1 + slope * (extendX - drawing.points[0].x);
        
        ctx.beginPath();
        ctx.moveTo(drawing.points[0].x, y1);
        ctx.lineTo(extendX, extendY);
        ctx.stroke();
      } else if (drawing.type === 'fibonacci') {
        // Fibonacci retracement levels
        const price1 = drawing.points[0].price;
        const price2 = drawing.points[1].price;
        const priceDiff = price2 - price1;
        
        const levels = [
          { ratio: 0, label: '0%', color: '#a855f7' },
          { ratio: 0.236, label: '23.6%', color: '#ec4899' },
          { ratio: 0.382, label: '38.2%', color: '#f97316' },
          { ratio: 0.5, label: '50%', color: '#eab308' },
          { ratio: 0.618, label: '61.8%', color: '#22c55e' },
          { ratio: 0.786, label: '78.6%', color: '#06b6d4' },
          { ratio: 1, label: '100%', color: '#a855f7' },
        ];
        
        levels.forEach(level => {
          const levelPrice = price1 + (priceDiff * level.ratio);
          const y = chartHeight - ((levelPrice - minPrice) / priceRange) * chartHeight;
          
          ctx.strokeStyle = level.color + '80';
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
          ctx.setLineDash([]);
          
          // Label
          ctx.fillStyle = level.color;
          ctx.font = "10px monospace";
          ctx.fillText(`${level.label} (${levelPrice.toFixed(2)})`, 10, y - 3);
        });
      }
      
      ctx.restore();
    });

    // Draw temporary drawing in progress
    if (drawingPoints.length > 0 && drawingMode) {
      ctx.save();
      ctx.strokeStyle = '#0ea5e9';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      
      const y1 = chartHeight - ((drawingPoints[0].price - minPrice) / priceRange) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(drawingPoints[0].x, y1, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#0ea5e9';
      ctx.fill();
      
      ctx.restore();
    }

  }, [canvasData, indicators, chartType, drawings, drawingPoints, drawingMode]);

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl overflow-hidden">
      {/* Chart Controls */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
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
                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                    : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800"
                }`}
              >
                {icon}
              </button>
            ))}
          </div>

          {/* Timeframes */}
          <div className="flex gap-1 items-center">
            {["1m", "5m", "15m", "1h", "4h", "1d"].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  timeframe === tf
                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                    : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800"
                }`}
              >
                {tf}
              </button>
            ))}
            
            {/* Extended Timeframes Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExtendedTimeframes(!showExtendedTimeframes)}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  ["1w", "1M", "3M", "6M", "1y"].includes(timeframe)
                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                    : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800"
                }`}
              >
                {["1w", "1M", "3M", "6M", "1y"].includes(timeframe) ? timeframe : "•••"}
              </button>
              
              {showExtendedTimeframes && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-1 right-0 bg-slate-900 border border-slate-700/50 rounded-lg shadow-xl p-2 z-50 min-w-[100px]"
                >
                  {[
                    { value: "1w", label: "1 Week" },
                    { value: "1M", label: "1 Month" },
                    { value: "3M", label: "3 Months" },
                    { value: "6M", label: "6 Months" },
                    { value: "1y", label: "1 Year" },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => {
                        setTimeframe(value);
                        setShowExtendedTimeframes(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded text-xs transition-all ${
                        timeframe === value
                          ? "bg-sky-500/20 text-sky-300"
                          : "text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
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
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Drawing Tools */}
        <div className="flex gap-2 items-center">
          {[
            { mode: "trendline", icon: "📏", label: "Trend Line" },
            { mode: "ray", icon: "➡️", label: "Ray" },
            { mode: "horizontal", icon: "—", label: "H-Line" },
            { mode: "fibonacci", icon: "🔢", label: "Fibonacci" },
          ].map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => {
                setDrawingMode(drawingMode === mode ? null : mode);
                setDrawingPoints([]);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                drawingMode === mode
                  ? "bg-orange-500/20 text-orange-300 border border-orange-500/40 shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                  : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800"
              }`}
              title={label}
            >
              {icon}
            </button>
          ))}
          
          {/* Clear all drawings */}
          {drawings.length > 0 && (
            <button
              onClick={() => setDrawings([])}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 transition-all"
              title="Clear all drawings"
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative p-6" style={{ height: "600px" }}>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-400">Loading market data from Coinbase...</p>
            </div>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-400 mb-2">⚠️ Error loading data</p>
              <p className="text-slate-500 text-sm">{error}</p>
            </div>
          </div>
        ) : (
          <>
            <canvas
              ref={chartContainerRef}
              width={1400}
              height={560}
              className="w-full h-full cursor-crosshair"
              onClick={handleCanvasClick}
            />
            
            {/* Drawing Mode Indicator */}
            {drawingMode && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-8 left-1/2 -translate-x-1/2 bg-orange-500/20 backdrop-blur-xl border border-orange-500/40 rounded-lg px-4 py-2"
              >
                <span className="text-orange-200 text-sm font-medium">
                  {drawingMode === "trendline" && `📏 ${drawingPoints.length === 0 ? "Click first point" : "Click second point"} for trend line`}
                  {drawingMode === "ray" && `➡️ ${drawingPoints.length === 0 ? "Click first point" : "Click second point"} for ray`}
                  {drawingMode === "fibonacci" && `🔢 ${drawingPoints.length === 0 ? "Click first point" : "Click second point"} for Fibonacci`}
                  {drawingMode === "horizontal" && "— Click to place horizontal line"}
                  <span className="ml-3 text-orange-300/70 text-xs">(ESC to cancel)</span>
                </span>
              </motion.div>
            )}

            {/* Crosshair Info Box (mock) */}
            <div className="absolute top-8 right-8 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-lg px-4 py-3 text-xs font-mono">
              <div className="text-slate-400 mb-1">O: <span className="text-white">{currentPrice?.toFixed(2)}</span></div>
              <div className="text-slate-400 mb-1">H: <span className="text-green-400">{(currentPrice * 1.005)?.toFixed(2)}</span></div>
              <div className="text-slate-400 mb-1">L: <span className="text-red-400">{(currentPrice * 0.995)?.toFixed(2)}</span></div>
              <div className="text-slate-400">C: <span className="text-white">{currentPrice?.toFixed(2)}</span></div>
            </div>
          </>
        )}
      </div>

      {/* Legend */}
      <div className="px-6 py-3 border-t border-slate-700/50 flex items-center gap-6 text-xs">
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
            <div className="w-3 h-0.5 bg-sky-400"></div>
            <span className="text-slate-400">MACD Signal</span>
          </div>
        )}
        {indicators.rsi && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-sky-400"></div>
            <span className="text-slate-400">RSI (14)</span>
          </div>
        )}
      </div>
    </div>
  );
}
