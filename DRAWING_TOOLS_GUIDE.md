# Trading Chart Drawing Tools - User Guide

## 🎨 Drawing Tools Available

### 1. **📏 Trend Line**
- **Purpose**: Draw straight lines connecting two price points
- **How to use**:
  1. Click the 📏 button to activate
  2. Click first point on chart
  3. Click second point to complete
  4. Line connects the two points exactly

### 2. **➡️ Ray**
- **Purpose**: Draw a line that extends infinitely in one direction
- **How to use**:
  1. Click the ➡️ button to activate
  2. Click starting point
  3. Click second point to set direction
  4. Ray extends to edge of chart based on angle

### 3. **— Horizontal Line**
- **Purpose**: Draw support/resistance levels
- **How to use**:
  1. Click the — button to activate
  2. Click once on chart at desired price
  3. Line appears across entire chart at that price
  4. Price label shows on right side

### 4. **🔢 Fibonacci Retracement**
- **Purpose**: Show key Fibonacci levels between two price points
- **How to use**:
  1. Click the 🔢 button to activate
  2. Click swing low (or high)
  3. Click swing high (or low)
  4. Shows all Fibonacci levels with colors:
     - **0%** (Purple) - Start point
     - **23.6%** (Pink)
     - **38.2%** (Orange)
     - **50%** (Yellow)
     - **61.8%** (Green) - Golden ratio
     - **78.6%** (Cyan)
     - **100%** (Purple) - End point

## ⌨️ Keyboard Shortcuts

- **ESC** - Cancel current drawing / Exit drawing mode
- Drawing tools toggle on/off when clicked

## 🗑️ Managing Drawings

- **Clear All**: Click the 🗑️ button to remove all drawings
- **Visual Feedback**: 
  - Active tool highlighted in orange
  - First point marked with blue dot
  - Progress shown in top banner

## 📊 Extended Timeframes

### Standard Timeframes (Always Visible)
- **1m** - 1 minute
- **5m** - 5 minutes
- **15m** - 15 minutes
- **1h** - 1 hour
- **4h** - 4 hours
- **1d** - 1 day

### Extended Timeframes (••• Dropdown)
Click the **•••** button to access:
- **1w** - 1 Week
- **1M** - 1 Month
- **3M** - 3 Months (Quarterly)
- **6M** - 6 Months (Semi-Annual)
- **1y** - 1 Year (Annual)

## 🎯 Drawing Behavior

### Trend Lines & Rays
- Both require two points
- **Trend line**: Stops at second point
- **Ray**: Extends infinitely from first point through second

### Fibonacci Levels
- All 7 standard levels displayed
- Each level has unique color
- Price labels show exact values
- Useful for identifying potential support/resistance

### Horizontal Lines
- One-click placement
- Extends across entire chart
- Great for marking key price levels
- Price value displayed on right

## 💡 Pro Tips

1. **Use Rays for long-term trends** - They extend to show future projections
2. **Fibonacci works best on clear swings** - Use significant highs and lows
3. **Horizontal lines for round numbers** - Mark psychological levels (e.g., $100k, $50k)
4. **Combine tools** - Use multiple drawings for comprehensive analysis
5. **Clear old drawings** - Keep chart clean for new analysis

## 🎨 Visual Guide

### Drawing States
- **Inactive tool**: Gray with border
- **Active tool**: Orange with glow effect
- **First point placed**: Blue dot on chart
- **Completed drawing**: Rendered in tool color

### Color Scheme
- **Trend Lines/Rays**: Sky blue (#0ea5e9)
- **Horizontal Lines**: Sky blue (#0ea5e9)
- **Fibonacci Levels**: Rainbow gradient (purple → pink → orange → yellow → green → cyan)

## 📈 Real-World Use Cases

### Trend Line
```
Use Case: Identify uptrend in BTC
1. Find swing low from yesterday
2. Connect to today's low
3. Watch for price bounces off the line
```

### Ray
```
Use Case: Project resistance level
1. Mark previous all-time high
2. Draw ray through recent rejection
3. See where resistance extends
```

### Fibonacci
```
Use Case: Find entry points in ETH
1. Mark recent swing high
2. Mark recent swing low
3. Look for support at 61.8% or 50% level
```

### Horizontal Line
```
Use Case: Mark round number resistance
1. Click — button
2. Click at $100,000 on BTC chart
3. Monitor price reaction at level
```

## 🔧 Technical Details

- **Drawings persist** during timeframe changes
- **Zoom compatible** (canvas rescales automatically)
- **Real-time updates** - Current candle updates don't affect drawings
- **Stable coordinates** - Drawings stay anchored to price levels
- **No storage** - Drawings reset on page refresh (add persistence later)

## 🚀 Coming Soon

Potential future enhancements:
- Save/load drawing templates
- Edit existing drawings
- Delete individual drawings
- More tools (rectangles, channels, Elliott waves)
- Drawing notes/labels
- Export drawings as image

---

**Enjoy professional-grade charting tools! 📊**
