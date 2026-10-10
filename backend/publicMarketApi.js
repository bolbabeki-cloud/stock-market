// A narrowly scoped public relay for the Firebase static site. Only market
// quote and health routes are reachable; authentication and profile routes
// stay on the local backend and are never forwarded by this server.
const express = require('express');

const app = express();
const PORT = Number(process.env.PUBLIC_MARKET_API_PORT || 3002);
const FIREBASE_ORIGIN = 'https://stockmarketportfolio-13849.web.app';
const requestTimes = new Map();
const MAX_REQUESTS_PER_MINUTE = 40;

app.use((req, res, next) => {
  const origin = req.get('Origin');
  if (origin && origin !== FIREBASE_ORIGIN) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }
  res.setHeader('Access-Control-Allow-Origin', FIREBASE_ORIGIN);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);

  const client = req.get('CF-Connecting-IP') || req.ip;
  const now = Date.now();
  const recent = (requestTimes.get(client) || []).filter((time) => now - time < 60000);
  if (recent.length >= MAX_REQUESTS_PER_MINUTE) {
    return res.status(429).json({ error: 'Too many requests; try again shortly' });
  }
  recent.push(now);
  requestTimes.set(client, recent);
  return next();
});

app.use(express.json({ limit: '32kb' }));

app.get('/api/health', (req, res) => res.json({ server: 'ok' }));

const relayQuotes = async (req, res, route) => {
  const stocks = req.body?.stocks;
  if (!Array.isArray(stocks) || stocks.length > 12) {
    return res.status(400).json({ error: 'Provide up to 12 stocks per request' });
  }
  const safeStocks = [];
  for (const stock of stocks) {
    const symbol = String(stock?.symbol || '');
    if (!/^[A-Za-z0-9.&=_-]{1,24}$/.test(symbol)) {
      return res.status(400).json({ error: 'Invalid stock symbol' });
    }
    safeStocks.push({
      symbol,
      name: String(stock.name || symbol).slice(0, 100),
      country: String(stock.country || '').slice(0, 40),
      exchange: String(stock.exchange || '').slice(0, 40),
      currency: String(stock.currency || '').slice(0, 8),
    });
  }

  try {
    const upstream = await fetch(`http://127.0.0.1:3001${route}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stocks: safeStocks }),
      signal: AbortSignal.timeout(26000),
    });
    const payload = await upstream.json();
    return res.status(upstream.status).json(payload);
  } catch (error) {
    return res.status(502).json({ error: 'Local market API is unavailable' });
  }
};

app.post('/api/market/quotes', (req, res) => relayQuotes(req, res, '/api/market/quotes'));
app.post('/api/market/nse-quotes', (req, res) => relayQuotes(req, res, '/api/market/nse-quotes'));
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Public market relay listening on http://127.0.0.1:${PORT}`);
  console.log('Only quote and health routes are available through the relay.');
});
