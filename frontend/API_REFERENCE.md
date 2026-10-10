# Stock Portfolio Pro - API Reference Guide

## Overview

This guide documents all API functions and data structures available in Stock Portfolio Pro v2.0. It's intended for developers integrating real data sources and extending functionality.

---

## Core APIs

### 1. Stock Data API (`stockApi.js`)

#### `getAllStocks()`
**Purpose**: Retrieve all available stocks (Indian + International)

**Parameters**: None

**Returns**: Array of stock objects
```javascript
[
  {
    symbol: string,
    name: string,
    country?: string,
    countryCode?: string,
    flag?: string,
    sector: string,
    price: number,
    change: number,
    previousClose: number,
    high: number,
    low: number,
    volume: number,
    currency?: string
  },
  // ... 61 more stocks
]
```

**Example**:
```javascript
import { getAllStocks } from '../services/stockApi';

const stocks = getAllStocks();
console.log(stocks[0].symbol); // "TCS"
console.log(stocks.length);    // 62
```

**Usage**: Dashboard initial load, Analytics calculations

---

#### `getIndianStocks()`
**Purpose**: Retrieve only Indian stocks (NSE/BSE)

**Parameters**: None

**Returns**: Array of 12 Indian stock objects

**Example**:
```javascript
import { getIndianStocks } from '../services/stockApi';

const indianStocks = getIndianStocks();
console.log(indianStocks.length); // 12
indianStocks.forEach(stock => {
  console.log(`${stock.symbol} - ${stock.name}`);
});
```

**Usage**: Indian stock search page initialization

---

#### `getInternationalStocks()`
**Purpose**: Retrieve only international stocks

**Parameters**: None

**Returns**: Array of 50+ international stock objects

**Example**:
```javascript
import { getInternationalStocks } from '../services/stockApi';

const intlStocks = getInternationalStocks();
console.log(intlStocks.length); // 50+
const usStocks = intlStocks.filter(s => s.country === 'USA');
console.log(usStocks.length);   // 15
```

**Usage**: Global stock browsing component

---

#### `searchStocks(query)`
**Purpose**: Search stocks by symbol, name, sector, or country

**Parameters**:
- `query` (string): Search term (case-insensitive)

**Returns**: Array of matching stock objects

**Examples**:
```javascript
import { searchStocks } from '../services/stockApi';

// Search by company name
searchStocks('apple');
// Returns: [{ symbol: 'AAPL', name: 'Apple Inc', ... }]

// Search by symbol
searchStocks('INFY');
// Returns: [{ symbol: 'INFY', name: 'Infosys', ... }]

// Search by sector
searchStocks('technology');
// Returns: [AAPL, MSFT, INFY, WIPRO, ...]

// Search by country
searchStocks('germany');
// Returns: [SAP, SIEMENS, ADIDAS]
```

**Usage**: Real-time search input filtering

---

#### `getStockBySymbol(symbol)`
**Purpose**: Get detailed information for a specific stock

**Parameters**:
- `symbol` (string): Stock ticker symbol

**Returns**: Stock object or null if not found

**Example**:
```javascript
import { getStockBySymbol } from '../services/stockApi';

const stock = getStockBySymbol('AAPL');
console.log(stock.name);      // "Apple Inc"
console.log(stock.price);     // 250.15
console.log(stock.country);   // "USA"
console.log(stock.flag);      // "🇺🇸"
```

**Usage**: Stock detail page, watchlist item lookup

---

#### `generateHistoricalData(symbol, days = 30)`
**Purpose**: Generate mock historical price data for charting

**Parameters**:
- `symbol` (string): Stock ticker symbol
- `days` (number, optional): Number of days of history (default: 30)

**Returns**: Array of daily price data
```javascript
[
  {
    date: string,     // "2024-03-27"
    price: number,    // 150.25
    volume: number    // 1000000
  },
  // ... 29 more days
]
```

**Example**:
```javascript
import { generateHistoricalData } from '../services/stockApi';

const history = generateHistoricalData('AAPL', 30);
console.log(history[0].date);   // "2024-02-27"
console.log(history[29].date);  // "2024-03-27"
console.log(history[0].price);  // Mock price
```

**Usage**: Line charts in Analytics and Stock Details pages

---

#### `getStockCategories()`
**Purpose**: Get all unique sectors/categories

**Parameters**: None

**Returns**: Array of sector names

**Example**:
```javascript
import { getStockCategories } from '../services/stockApi';

const sectors = getStockCategories();
console.log(sectors);
// ["Technology", "Banking", "Energy", "Healthcare", ...]
```

**Usage**: Filter/categorize stocks by sector

---

#### `getStocksByCountry(country)`
**Purpose**: Get all stocks from a specific country

**Parameters**:
- `country` (string): Country name (case-insensitive)

**Returns**: Array of stock objects from that country

**Example**:
```javascript
import { getStocksByCountry } from '../services/stockApi';

const usStocks = getStocksByCountry('USA');
console.log(usStocks.length);   // 15

const jpStocks = getStocksByCountry('Japan');
console.log(jpStocks.length);   // 4
```

**Usage**: Country filter in Global stocks page

---

### 2. Authentication API (`useAuth` Hook)

#### `useAuth()`
**Purpose**: Access authentication context and methods

**Returns**: Authentication object
```javascript
{
  isLoggedIn: boolean,
  currentUser: { id, email, name, country } | null,
  login: (email, password) => Promise<{success, error?}>,
  signup: (email, password, name, country) => Promise<{success, error?}>,
  logout: () => void
}
```

**Example**:
```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { isLoggedIn, currentUser, login, logout } = useAuth();

  if (!isLoggedIn) {
    return <div>Please login first</div>;
  }

  return (
    <div>
      Welcome, {currentUser.name}!
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

**Available Methods**:

##### `login(email, password)`
**Returns**: Promise<{ success: boolean, error?: string }>

```javascript
const { login } = useAuth();

const handleLogin = async () => {
  const result = await login('demo@stockportfolio.com', 'demo123');
  if (result.success) {
    console.log('Logged in!');
  } else {
    console.error(result.error); // "Invalid credentials"
  }
};
```

##### `signup(email, password, name, country)`
**Returns**: Promise<{ success: boolean, error?: string }>

```javascript
const { signup } = useAuth();

const handleSignup = async () => {
  const result = await signup(
    'newuser@example.com',
    'password123',
    'John Doe',
    'USA'
  );
  if (result.success) {
    console.log('Account created!');
  } else {
    console.error(result.error); // "Email already exists"
  }
};
```

##### `logout()`
**Returns**: void

```javascript
const { logout } = useAuth();

const handleLogout = () => {
  logout();
  // User session cleared, redirects to login
};
```

**Usage**: Authentication flow in Login component

---

### 3. Portfolio Management API (`useStock` Hook)

#### `useStock()`
**Purpose**: Access stock context and portfolio functions

**Returns**: Stock context object
```javascript
{
  portfolio: [...holdings],
  watchlist: [...watched stocks],
  addToPortfolio: (symbol, quantity, buyPrice) => void,
  removeFromPortfolio: (symbol) => void,
  updateHolding: (symbol, quantity, buyPrice) => void,
  addToWatchlist: (stock) => void,
  removeFromWatchlist: (symbol) => void,
  isInPortfolio: (symbol) => boolean,
  isInWatchlist: (symbol) => boolean,
  getHolding: (symbol) => holding | null
}
```

**Example**:
```javascript
import { useStock } from '../context/StockContext';

function PortfolioComponent() {
  const { portfolio, addToPortfolio, removeFromPortfolio } = useStock();

  return (
    <div>
      {portfolio.map(holding => (
        <div key={holding.symbol}>
          {holding.symbol}: {holding.quantity} shares
          <button onclick={() => removeFromPortfolio(holding.symbol)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
```

**Available Methods**:

##### `addToPortfolio(symbol, quantity, buyPrice)`
**Parameters**:
- `symbol` (string): Stock ticker
- `quantity` (number): Number of shares
- `buyPrice` (number): Purchase price per share

```javascript
const { addToPortfolio } = useStock();

addToPortfolio('AAPL', 10, 150.25);
// Adds 10 shares of Apple at $150.25 each
```

##### `removeFromPortfolio(symbol)`
**Parameters**:
- `symbol` (string): Stock ticker

```javascript
const { removeFromPortfolio } = useStock();

removeFromPortfolio('AAPL');
// Removes all Apple shares from portfolio
```

##### `updateHolding(symbol, quantity, buyPrice)`
**Parameters**:
- `symbol` (string): Stock ticker
- `quantity` (number): New quantity
- `buyPrice` (number): New average buy price

```javascript
const { updateHolding } = useStock();

updateHolding('AAPL', 15, 145.50);
// Updates Apple holding to 15 shares at new price
```

##### `addToWatchlist(stock)`
**Parameters**:
- `stock` (object): Stock object to watch

```javascript
const { addToWatchlist } = useStock();

const appleStock = getStockBySymbol('AAPL');
addToWatchlist(appleStock);
// Adds Apple to watchlist without buying
```

##### `removeFromWatchlist(symbol)`
**Parameters**:
- `symbol` (string): Stock ticker

```javascript
const { removeFromWatchlist } = useStock();

removeFromWatchlist('AAPL');
// Removes Apple from watchlist
```

##### `isInPortfolio(symbol)`
**Parameters**:
- `symbol` (string): Stock ticker

**Returns**: boolean

```javascript
const { isInPortfolio } = useStock();

if (isInPortfolio('AAPL')) {
  console.log('Already own Apple');
} else {
  console.log('Not in portfolio');
}
```

##### `isInWatchlist(symbol)`
**Parameters**:
- `symbol` (string): Stock ticker

**Returns**: boolean

```javascript
const { isInWatchlist } = useStock();

if (isInWatchlist('AAPL')) {
  console.log('Watching Apple');
}
```

##### `getHolding(symbol)`
**Parameters**:
- `symbol` (string): Stock ticker

**Returns**: Holding object or null
```javascript
{
  symbol: string,
  quantity: number,
  buyPrice: number,
  currentPrice: number,
  gainLoss: number,
  gainLossPercent: number
}
```

```javascript
const { getHolding } = useStock();

const appleHolding = getHolding('AAPL');
console.log(appleHolding.gainLoss);        // 500.50
console.log(appleHolding.gainLossPercent); // 12.5
```

**Usage**: Portfolio management throughout app

---

## Data Structures

### Stock Object (Indian)
```javascript
{
  symbol: "TCS",                    // Ticker symbol
  name: "Tata Consultancy Services", // Full name
  sector: "Information Technology",  // Industry sector
  price: 3250.50,                   // Current price in INR
  change: 2.5,                      // Daily % change
  previousClose: 3170.25,           // Previous day close
  high: 3285.75,                    // 52-week high
  low: 2950.00,                     // 52-week low
  volume: 5250000                   // Trading volume
}
```

### Stock Object (International)
```javascript
{
  symbol: "AAPL",                   // Ticker symbol
  name: "Apple Inc",                // Full name
  country: "USA",                   // Listing country
  countryCode: "US",                // 2-letter country code
  flag: "🇺🇸",                     // Country flag emoji
  sector: "Technology",             // Industry sector
  price: 250.15,                    // Current price in USD
  change: 1.8,                      // Daily % change
  previousClose: 245.80,            // Previous day close
  high: 275.50,                     // 52-week high
  low: 145.25,                      // 52-week low
  volume: 52500000                  // Trading volume in thousands
}
```

### Portfolio Holding
```javascript
{
  symbol: "AAPL",                   // Stock ticker
  quantity: 10,                     // Number of shares
  buyPrice: 145.50,                 // Average purchase price
  currentPrice: 250.15,             // Current market price
  gainLoss: 1046.50,                // Total gain/loss (₹ or $)
  gainLossPercent: 71.8             // % gain/loss
}
```

### User Object
```javascript
{
  id: 1711588800000,                // Unique ID (timestamp)
  email: "demo@stockportfolio.com", // Login email
  password: "demo123",              // Password (hashed in production)
  name: "Demo User",                // Display name
  country: "India",                 // User's country
  createdAt: "2024-03-27T..."       // Account creation date
}
```

---

## Real-Time Data Integration

### Steps to Connect Real APIs

#### 1. Choose Your Data Provider

**Recommended Providers:**

| Provider | Free Tier | Stocks | Update Frequency | Docs |
|----------|-----------|--------|------------------|------|
| **Finnhub** | Yes | All | Real-time | Excellent |
| **Alpha Vantage** | Yes | US/Crypto | 1-5 min | Good |
| **Polygon.io** | Yes | US | 1 min | Excellent |
| **Twelve Data** | Yes | All | Real-time | Good |
| **IEX Cloud** | Paid | US | Real-time | Excellent |

#### 2. Update `stockApi.js`

**Before (Mock Data)**
```javascript
const indianStocks = [
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3250.50, ... },
  // ...
];
```

**After (Real API)**
```javascript
export async function getAllStocks() {
  try {
    const [indian, intl] = await Promise.all([
      fetchIndianStocks(),
      fetchInternationalStocks()
    ]);
    return [...indian, ...intl];
  } catch (error) {
    console.error('Failed to fetch stocks:', error);
    return []; // Fallback to empty array
  }
}

async function fetchIndianStocks() {
  const response = await fetch(
    'https://api.example.com/stocks/india',
    { headers: { 'X-API-Key': process.env.REACT_APP_API_KEY } }
  );
  return response.json();
}

async function fetchInternationalStocks() {
  const response = await fetch(
    'https://api.example.com/stocks/international',
    { headers: { 'X-API-Key': process.env.REACT_APP_API_KEY } }
  );
  return response.json();
}
```

#### 3. Add Environment Configuration

**Create `.env` file:**
```
REACT_APP_API_KEY=your_api_key_here
REACT_APP_API_BASE_URL=https://api.example.com
REACT_APP_API_TIMEOUT=5000
```

**Use in code:**
```javascript
const API_KEY = process.env.REACT_APP_API_KEY;
const API_BASE = process.env.REACT_APP_API_BASE_URL;
```

#### 4. Add Error Handling

```javascript
async function fetchStockPrice(symbol) {
  try {
    const response = await fetch(
      `${API_BASE}/quote/${symbol}`,
      { headers: { 'X-API-Key': API_KEY } }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      symbol: data.symbol,
      price: data.price,
      change: data.changePercent,
      // ... map other fields
    };
  } catch (error) {
    console.error(`Failed to fetch ${symbol}:`, error);
    // Return cached/mock data as fallback
    return getCachedStock(symbol);
  }
}
```

#### 5. Implement Caching

```javascript
const stockCache = new Map();
const CACHE_DURATION = 60000; // 1 minute

async function getStockWithCache(symbol) {
  const cached = stockCache.get(symbol);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const data = await fetchStockPrice(symbol);
  stockCache.set(symbol, { data, timestamp: Date.now() });
  return data;
}
```

---

## Common Integration Patterns

### Pattern 1: Real-Time Price Updates
```javascript
// In LivePriceTracker component
useEffect(() => {
  const interval = setInterval(() => {
    portfolio.forEach(holding => {
      updateStockPrice(holding.symbol);
    });
  }, 5000); // Update every 5 seconds
  
  return () => clearInterval(interval);
}, [portfolio]);

async function updateStockPrice(symbol) {
  const stock = await getStockPrice(symbol);
  setStockPrices(prev => ({
    ...prev,
    [symbol]: stock
  }));
}
```

### Pattern 2: Historical Data
```javascript
// In PortfolioAnalytics component
useEffect(() => {
  portfolio.forEach(holding => {
    fetchHistoricalData(holding.symbol);
  });
}, [portfolio]);

async function fetchHistoricalData(symbol) {
  const response = await fetch(
    `${API_BASE}/historical/${symbol}?range=1mo`
  );
  const data = await response.json();
  setChartData(prev => ({
    ...prev,
    [symbol]: data
  }));
}
```

### Pattern 3: Multi-Data Sources
```javascript
// Use different APIs for different markets
const APIS = {
  INDIA: 'https://india-api.example.com',
  USA: 'https://usa-api.example.com',
  EUROPE: 'https://eu-api.example.com'
};

async function getStockByMarket(symbol, market) {
  const baseUrl = APIS[market];
  const response = await fetch(`${baseUrl}/quote/${symbol}`);
  return response.json();
}
```

---

## Performance Optimization

### 1. Request Batching
```javascript
// Instead of requesting each stock individually
async function getMultipleStocks(symbols) {
  const response = await fetch(
    `${API_BASE}/quotes?symbols=${symbols.join(',')}`
  );
  return response.json();
}
```

### 2. Request Deduplication
```javascript
new Set(['AAPL', 'AAPL', 'MSFT']) // Converts to unique symbols
```

### 3. Progressive Loading
```javascript
// Load critical stocks first, others in background
async function loadPortfolio() {
  // Load top 5 immediately
  const top5 = portfolio.slice(0, 5);
  const pricesTop5 = await getMultipleStocks(top5.map(s => s.symbol));
  
  // Load remaining in background
  const remaining = portfolio.slice(5);
  getMultipleStocks(remaining.map(s => s.symbol));
}
```

---

## Error Handling Best Practices

```javascript
// Specific error handling
try {
  const data = await fetchStockData(symbol);
} catch (error) {
  if (error instanceof NetworkError) {
    setError('Network connection issue. Please check your internet.');
  } else if (error instanceof TimeoutError) {
    setError('Request timeout. Please try again.');
  } else if (error instanceof InvalidSymbolError) {
    setError(`Stock symbol "${symbol}" not found.`);
  } else if (error instanceof RateLimitError) {
    setError('Too many requests. Please wait a moment and retry.');
  } else {
    setError('An unexpected error occurred. Please try again later.');
  }
}
```

---

## Testing APIs

### Unit Test Example
```javascript
import { getStockBySymbol, addToPortfolio } from '../stockApi';

describe('Stock API', () => {
  it('should return Apple stock details', () => {
    const stock = getStockBySymbol('AAPL');
    expect(stock.name).toBe('Apple Inc');
    expect(stock.country).toBe('USA');
  });

  it('should search stocks by name', () => {
    const results = searchStocks('apple');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].symbol).toBe('AAPL');
  });
});
```

### Integration Test Example
```javascript
describe('Portfolio API', () => {
  it('should add stock and calculate gains', () => {
    const { addToPortfolio, getHolding } = useStock();
    
    addToPortfolio('AAPL', 10, 150.00);
    const holding = getHolding('AAPL');
    
    expect(holding.quantity).toBe(10);
    expect(holding.gainLoss).toBe((250.15 - 150) * 10);
  });
});
```

---

## Troubleshooting

### Common Issues

**Q: API requests timing out**
```
A: Set longer timeout; implement retry logic:
const MAX_RETRIES = 3;
for (let i = 0; i < MAX_RETRIES; i++) {
  try {
    return await fetchWithTimeout(url, 5000);
  } catch (error) {
    if (i === MAX_RETRIES - 1) throw error;
    await delay(1000 * (i + 1)); // Exponential backoff
  }
}
```

**Q: Rate limits exceeded**
```
A: Implement request throttling and caching:
const throttle = (fn, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
};
```

**Q: Stale data in portfolio**
```
A: Refresh on component mount and at intervals:
useEffect(() => {
  refreshPrices();
  const interval = setInterval(refreshPrices, 60000);
  return () => clearInterval(interval);
}, []);
```

---

## Resources

- [Finnhub API Docs](https://finnhub.io/docs/api)
- [Alpha Vantage Docs](https://www.alphavantage.co/documentation)
- [Polygon.io Docs](https://polygon.io/docs)
- [React Query](https://react-query-v3.tanstack.com/) - Data fetching library
- [SWR](https://swr.vercel.app/) - Alternative fetching library

---

**Version**: 2.0  
**Last Updated**: March 27, 2026  
**Status**: Complete ✅

This guide covers all APIs available in Stock Portfolio Pro v2.0. For quick start, see QUICK_START.md.
