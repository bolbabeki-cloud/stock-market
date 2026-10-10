const express = require('express');
const path = require('path');
require('dotenv').config();
const { connectDatabase, getDatabaseStatus } = require('./database');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  if (req.get('Access-Control-Request-Private-Network') === 'true') {
    res.setHeader('Access-Control-Allow-Private-Network', 'true');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  return next();
});
app.use('/api/auth', async (req, res, next) => {
  await connectDatabase();
  return next();
});
app.use('/api/auth', authRoutes);

const suffixFor = ({ exchange = '', country = '' }) => {
  const code = exchange.toUpperCase();
  if (country === 'India') return code === 'BSE' ? '.BO' : '.NS';
  if (country === 'United Kingdom') return '.L';
  if (country === 'Australia') return '.AX';
  if (country === 'France') return '.PA';
  if (country === 'Japan') return '.T';
  if (country === 'Singapore') return '.SI';
  if (country === 'Brazil') return '.SA';
  if (country === 'Canada') return /VENTURE|TSXV/.test(code) ? '.V' : '.TO';
  if (country === 'South Korea') return /KOSDAQ/.test(code) ? '.KQ' : '.KS';
  if (country === 'Germany') {
    if (/MUNICH|XMUN/.test(code)) return '.MU';
    if (/FRANKFURT|XFRA/.test(code)) return '.F';
    if (/STUTTGART|XSTU/.test(code)) return '.SG';
    if (/BERLIN|XBER/.test(code)) return '.BE';
    if (/DUSSELDORF|XDUS/.test(code)) return '.DU';
    if (/HAMBURG|XHAM/.test(code)) return '.HM';
    if (/HANOVER|XHAN/.test(code)) return '.HA';
    return '.DE';
  }
  return '';
};

const yahooTicker = (stock) => `${stock.symbol}${suffixFor(stock)}`;

const nseHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36',
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  Referer: 'https://www.nseindia.com/get-quotes/equity',
};
let nseCookie = '';
const quoteCache = new Map();

const fetchNseQuote = async (stock) => {
  if (!nseCookie) {
    const home = await fetch('https://www.nseindia.com/', { headers: nseHeaders, signal: AbortSignal.timeout(3500) });
    if (!home.ok) throw new Error(`NSE session returned ${home.status}`);
    nseCookie = home.headers.getSetCookie?.().map((cookie) => cookie.split(';')[0]).join('; ') || '';
  }
  const url = new URL('https://www.nseindia.com/api/NextApi/apiClient/GetQuoteApi');
  url.search = new URLSearchParams({ functionName: 'getSymbolData', marketType: 'N', series: 'EQ', symbol: stock.symbol });
  const response = await fetch(url, { headers: { ...nseHeaders, Cookie: nseCookie }, signal: AbortSignal.timeout(5000) });
  if (response.status === 401 || response.status === 403) nseCookie = '';
  if (!response.ok) throw new Error(`NSE returned ${response.status}`);
  const payload = await response.json();
  const equity = payload?.equityResponse?.[0];
  const orderBook = equity?.orderBook || {};
  const meta = equity?.metaData || {};
  const trade = equity?.tradeInfo || {};
  const price = Number(orderBook.lastPrice);
  if (!Number.isFinite(price) || price <= 0) throw new Error('NSE price unavailable');
  const previousClose = Number(meta.previousClose || meta.basePrice || price);
  return {
    ...stock,
    name: meta.companyName || equity?.companyName || equity?.secInfo?.companyName || stock.name,
    currency: 'INR',
    exchange: 'NSE',
    price,
    previousClose,
    change: Number(meta.pChange ?? (previousClose ? ((price - previousClose) / previousClose) * 100 : 0)),
    high: Number(meta.dayHigh || 0),
    low: Number(meta.dayLow || 0),
    volume: Number(trade.totalTradedVolume || trade.quantityTraded || 0),
    source: 'NSE India',
  };
};

const fetchYahooQuote = async (stock) => {
  const ticker = yahooTicker(stock);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=5d`;
  const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 StockPortfolioPro/1.0' } });
  if (!response.ok) throw new Error(`Yahoo returned ${response.status}`);
  const payload = await response.json();
  const result = payload?.chart?.result?.[0];
  if (!result?.meta) throw new Error('Quote unavailable');
  const meta = result.meta;
  const quote = result.indicators?.quote?.[0] || {};
  const closes = (quote.close || []).filter(Number.isFinite);
  const price = Number(meta.regularMarketPrice || closes[closes.length - 1]);
  if (!Number.isFinite(price)) throw new Error('Price unavailable');
  const previousClose = Number(meta.chartPreviousClose || meta.previousClose || closes[closes.length - 2] || price);
  return { ...stock, yahooTicker: ticker, name: meta.longName || meta.shortName || stock.name || stock.symbol,
    currency: meta.currency || stock.currency, exchange: stock.exchange || meta.exchangeName, price, previousClose,
    change: previousClose ? ((price - previousClose) / previousClose) * 100 : 0,
    high: Number(meta.regularMarketDayHigh || quote.high?.filter(Number.isFinite).at(-1) || 0),
    low: Number(meta.regularMarketDayLow || quote.low?.filter(Number.isFinite).at(-1) || 0),
    volume: Number(meta.regularMarketVolume || quote.volume?.filter(Number.isFinite).at(-1) || 0), source: 'Yahoo Finance' };
};

app.post('/api/market/nse-quotes', async (req, res) => {
  const stocks = Array.isArray(req.body?.stocks) ? req.body.stocks.slice(0, 12) : [];
  const settled = await Promise.allSettled(stocks.map(async (stock) => {
    const normalized = { ...stock, country: 'India', exchange: 'NSE', currency: 'INR' };
    const cached = quoteCache.get(stock.symbol);
    if (cached && Date.now() - cached.cachedAt < 60000) return cached.quote;
    let quote;
    try { quote = await fetchNseQuote(normalized); }
    catch (nseError) { quote = await fetchYahooQuote(normalized); }
    quoteCache.set(stock.symbol, { quote, cachedAt: Date.now() });
    return quote;
  }));
  const data = settled.filter((item) => item.status === 'fulfilled').map((item) => item.value);
  res.json({ data, requested: stocks.length, returned: data.length });
});

app.post('/api/market/quotes', async (req, res) => {
  const stocks = Array.isArray(req.body?.stocks) ? req.body.stocks.slice(0, 12) : [];
  const settled = await Promise.allSettled(stocks.map(async (stock) => {
    if (stock.country === 'India' && stock.exchange !== 'BSE') {
      try { return await fetchNseQuote(stock); } catch (error) { return fetchYahooQuote(stock); }
    }
    return fetchYahooQuote(stock);
  }));
  res.json({ data: settled.filter((item) => item.status === 'fulfilled').map((item) => item.value) });
});

app.get('/api/health', (req, res) => {
  const database = getDatabaseStatus();
  // Market quotes remain available without MongoDB; expose the database state
  // so deployments can diagnose auth configuration.
  res.status(200).json({
    server: 'ok',
    database,
  });
});

const buildDirectory = path.join(__dirname, '../frontend/build');
app.use(express.static(buildDirectory));
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api/')) return next();
  return res.sendFile(path.join(buildDirectory, 'index.html'));
});

const port = Number(process.env.PORT || process.env.MARKET_PROXY_PORT || 3001);
const startServer = () => {
  return app.listen(port, '0.0.0.0', () => {
    console.log(`Stock Portfolio Pro running on http://localhost:${port}`);
    connectDatabase();
    const initialSymbols = ['RELIANCE', 'TCS', 'HDFCBANK', 'BHARTIARTL', 'ICICIBANK', 'INFY', 'SBIN', 'LICI', 'ITC', 'HINDUNILVR'];
    Promise.allSettled(initialSymbols.map(async (symbol) => {
      const stock = { symbol, name: symbol, country: 'India', exchange: 'NSE', currency: 'INR' };
      let quote;
      try { quote = await fetchNseQuote(stock); } catch (error) { quote = await fetchYahooQuote(stock); }
      quoteCache.set(symbol, { quote, cachedAt: Date.now() });
    })).catch(() => {});
  });
};

if (require.main === module) startServer();

module.exports = app;
