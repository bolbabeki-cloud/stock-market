import React, { useEffect, useState } from 'react';
import { useStock } from '../context/StockContext';
import { FiRefreshCw } from 'react-icons/fi';
import '../styles/LivePriceTracker.css';

const CURRENCY_BY_COUNTRY = {
  India: 'INR',
  'United States': 'USD',
  'United Kingdom': 'GBP',
  Canada: 'CAD',
  Australia: 'AUD',
  Germany: 'EUR',
  France: 'EUR',
  Japan: 'JPY',
  Singapore: 'SGD',
  'South Korea': 'KRW',
  Brazil: 'BRL',
};

const currencyForStock = (stock) => stock.currency || CURRENCY_BY_COUNTRY[stock.country] || 'INR';

const LivePriceTracker = ({ onNavigate }) => {
  const { portfolio, watchlist, stockQuotes, refreshStockPrices } = useStock();
  const [isLive, setIsLive] = useState(true);
  const [updateInterval, setUpdateInterval] = useState(5);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLive) return;

    const refresh = async () => {
      try {
        await refreshStockPrices([...portfolio, ...watchlist]);
        setLastUpdate(new Date());
        setError('');
      } catch (error) {
        setError('Live prices are temporarily unavailable. Showing the last available values.');
      }
    };
    refresh();
    const interval = setInterval(refresh, updateInterval * 1000);

    return () => clearInterval(interval);
  }, [isLive, updateInterval, portfolio, watchlist, refreshStockPrices]);

  const allStocks = [...portfolio, ...watchlist];

  if (allStocks.length === 0) {
    return (
      <div className="tracker-container">
        <button className="back-btn" onClick={() => onNavigate('dashboard')}>
          ← Back to Dashboard
        </button>
        <div className="empty-state">
          <p>No stocks to track</p>
          <button onClick={() => onNavigate('search')}>Add stocks to your portfolio</button>
        </div>
      </div>
    );
  }

  return (
    <div className="tracker-container">
      <button className="back-btn" onClick={() => onNavigate('dashboard')}>
        ← Back to Dashboard
      </button>

      <div className="tracker-header">
        <div className="tracker-title">
          <div>
            <h1>Live Price Tracker</h1>
            <p>Monitor your portfolio and watchlist with live market prices.</p>
          </div>
        </div>
        <div className="tracker-controls">
          <button
            className={`live-btn ${isLive ? 'active' : ''}`}
            onClick={() => setIsLive(!isLive)}
          >
            <FiRefreshCw className={isLive ? 'spinning' : ''} />
            {isLive ? 'Stop Live' : 'Start Live'} Updates
          </button>

          <div className="update-interval">
            <label>Update every (seconds):</label>
            <select
              value={updateInterval}
              onChange={(e) => setUpdateInterval(parseInt(e.target.value))}
              disabled={isLive}
            >
              <option value={2}>2s</option>
              <option value={5}>5s</option>
              <option value={10}>10s</option>
              <option value={30}>30s</option>
              <option value={60}>1m</option>
            </select>
          </div>

          <span className="last-update">
            <span className={`live-indicator ${isLive ? 'active' : ''}`} />
            {isLive ? 'Live' : 'Paused'} · {lastUpdate.toLocaleTimeString('en-IN')}
          </span>
        </div>
      </div>

      {error && <div className="tracker-error" role="status">{error}</div>}

      <div className="price-ticker">
        <div className="ticker-content">
          {allStocks.map((item) => {
            const quote = stockQuotes[item.symbol];
            const currentPrice = quote?.price ?? item.price ?? item.averagePrice ?? 0;
            const previousClose = quote?.previousClose ?? item.previousClose ?? item.price ?? item.averagePrice ?? 0;
            const currency = quote?.currency || currencyForStock(item);
            const isHolding = portfolio.find((p) => p.symbol === item.symbol);
            const priceChange = currentPrice - previousClose;
            const changePercent = quote?.change ?? (previousClose ? (priceChange / previousClose) * 100 : 0);
            const isPositive = priceChange >= 0;

            return (
              <div key={item.id} className={`ticker-item ${isPositive ? 'positive' : 'negative'}`}>
                <div className="ticker-symbol">{item.symbol}</div>
                <div className="ticker-price">{new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(currentPrice)}</div>
                <div className="ticker-change">
                  <span className={`change-value ${isPositive ? 'positive' : 'negative'}`}>
                    {isPositive ? '+' : ''}{priceChange.toFixed(2)}
                  </span>
                  <span className={`change-percent ${isPositive ? 'positive' : 'negative'}`}>
                    {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
                  </span>
                </div>
                {isHolding && <span className="holding-badge">Holding</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="tracker-details">
        <div className="details-header">
          <div><h2>Stock Live Prices</h2><p>Current market values compared with the previous close.</p></div>
          <span className="quote-source">Live API</span>
        </div>
        <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Company</th>
              <th>Current Price</th>
              <th>Previous Close</th>
              <th>Change</th>
              <th>Type</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {allStocks.map((item) => {
              const quote = stockQuotes[item.symbol];
              const currentPrice = quote?.price ?? item.price ?? item.averagePrice ?? 0;
              const previousClose = quote?.previousClose ?? item.previousClose ?? item.price ?? item.averagePrice ?? 0;
              const currency = quote?.currency || currencyForStock(item);
              const priceChange = currentPrice - previousClose;
              const changePercent = quote?.change ?? (previousClose ? (priceChange / previousClose) * 100 : 0);
              const isPositive = priceChange >= 0;
              const isHolding = portfolio.find((p) => p.symbol === item.symbol);

              return (
                <tr key={item.id} className={isPositive ? 'positive-row' : 'negative-row'}>
                  <td className="symbol">{item.symbol}</td>
                  <td>{quote?.name || item.name || item.symbol}</td>
                  <td className="price">{new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(currentPrice)}</td>
                  <td>{new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(previousClose)}</td>
                  <td>
                    <span className={isPositive ? 'text-success' : 'text-danger'}>
                      {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
                    </span>
                  </td>
                  <td>{isHolding ? 'Portfolio' : 'Watchlist'}</td>
                  <td>{lastUpdate.toLocaleTimeString('en-IN')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default LivePriceTracker;
