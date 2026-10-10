import React, { useEffect, useMemo, useState } from 'react';
import { useStock } from '../context/StockContext';
import { formatCurrency } from '../services/stockApi';
import { INDIAN_STOCKS } from '../data/indianStocks';
import { FiSearch, FiX } from 'react-icons/fi';
import '../styles/StockSearch.css';

const PAGE_SIZE = 10;

const StockSearch = ({ onNavigate }) => {
  const { portfolio, watchlist, stockQuotes, refreshStockPrices, addToPortfolio, addToWatchlist } = useStock();
  const [catalog] = useState(INDIAN_STOCKS);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [quantity, setQuantity] = useState({});
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [pendingPurchase, setPendingPurchase] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('demo-wallet');

  const filtered = useMemo(() => {
    const term = query.trim().toUpperCase();
    if (!term) return catalog;
    return catalog.filter((stock) => `${stock.symbol} ${stock.name} ${stock.exchange} ${stock.sector}`.toUpperCase().includes(term));
  }, [catalog, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visibleStocks = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);

  useEffect(() => {
    if (!visibleStocks.length) return undefined;
    let active = true;
    refreshStockPrices(visibleStocks).then(() => {
      if (active) {
        setError('');
      }
    }).catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [visibleStocks, refreshKey, refreshStockPrices]);

  const changeQuery = (value) => { setQuery(value); setPage(1); };
  const isInPortfolio = (symbol) => portfolio.some((stock) => stock.symbol === symbol);
  const isWatching = (symbol) => watchlist.some((stock) => stock.symbol === symbol);

  const openPurchaseModal = (stock) => {
    const qty = Number(quantity[stock.symbol] || 1);
    const price = Number(stock.price || stock.averagePrice || stock.lastPrice || 0);

    setPendingPurchase({
      ...stock,
      quantity: qty,
      price,
      total: price * qty,
    });
  };

  const confirmPurchase = () => {
    if (!pendingPurchase) return;

    const methodMap = {
      'demo-wallet': 'Demo Wallet',
      gpay: 'GPay',
      card: 'Debit/Credit Card',
      upi: 'UPI',
      netbanking: 'Net Banking',
    };

    const selectedMethod = methodMap[paymentMethod] || 'Demo Wallet';

    addToPortfolio({
      ...pendingPurchase,
      quantity: Number(pendingPurchase.quantity || 1),
      price: Number(pendingPurchase.price || 0),
    });

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const storageKey = currentUser?.id ? `demoPaymentHistory_${currentUser.id}` : 'demoPaymentHistory_guest';
    const savedHistory = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const paymentRecord = {
      id: Date.now(),
      stock: pendingPurchase.symbol,
      amount: Number(pendingPurchase.total || pendingPurchase.price * (pendingPurchase.quantity || 1)),
      method: selectedMethod,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(storageKey, JSON.stringify([paymentRecord, ...savedHistory]));

    setPendingPurchase(null);
    setPaymentMethod('demo-wallet');
    onNavigate('payments');
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <h1>🇮🇳 Indian stocks - NSE/BSE</h1>
        <p>Live company names and market prices for leading NSE stocks.</p>
        <button className="back-btn" onClick={() => onNavigate('dashboard')}>← Back to Dashboard</button>
      </div>
      {error && <div className="error-banner">{error}</div>}
      {error && <button className="back-btn" onClick={() => setRefreshKey((value) => value + 1)}>Retry NSE prices</button>}
      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input className="search-input" value={query} onChange={(event) => changeQuery(event.target.value)} placeholder="Search all API stocks by symbol, company, or exchange" />
        {query && <FiX className="clear-icon" onClick={() => changeQuery('')} />}
      </div>
      <div className="filters">
        <button className="filter-btn active">All Stocks</button>
        <span className="result-count">{filtered.length.toLocaleString('en-IN')} results found</span>
      </div>

      {(
        <>
          <div className={`stocks-grid ${visibleStocks.some((stock) => !stockQuotes[stock.symbol]?.price) ? 'prices-pending' : ''}`}>
            {visibleStocks.map((catalogStock) => {
              const stock = stockQuotes[catalogStock.symbol] || catalogStock;
              const hasPrice = stock.price > 0;
              return (
                <div key={`${stock.symbol}:${stock.exchange}`} className="stock-card">
                  <div className="card-header"><div><h3>{stock.symbol}</h3><p className="company-name">{stock.name}</p></div>{isInPortfolio(stock.symbol) && <span className="portfolio-badge">In Portfolio</span>}</div>
                  <div className="card-price"><div className="current-price"><span className="label">Current Price</span><h2>{hasPrice ? formatCurrency(stock.price, 'INR') : ''}</h2></div>{hasPrice && <div className={`price-change ${stock.change >= 0 ? 'positive' : 'negative'}`}><span>{stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%</span></div>}</div>
                  <div className="card-stats"><div className="stat"><span className="stat-label">High</span><span>{stock.high ? formatCurrency(stock.high, stock.currency || 'INR') : '—'}</span></div><div className="stat"><span className="stat-label">Low</span><span>{stock.low ? formatCurrency(stock.low, stock.currency || 'INR') : '—'}</span></div><div className="stat"><span className="stat-label">Volume</span><span>{stock.volume ? `${(stock.volume / 1000000).toFixed(2)}M` : '—'}</span></div></div>
                  <div className="card-inputs"><div className="input-group"><label>Quantity</label><input className="input-field" type="number" min="1" value={quantity[stock.symbol] || 1} onChange={(event) => setQuantity((old) => ({ ...old, [stock.symbol]: Number(event.target.value) || 1 }))} /></div><div className="input-group"><label>Price ({stock.currency || 'INR'})</label><input className="input-field readonly-field" value={hasPrice ? stock.price : ''} readOnly /></div></div>
                  <div className="card-footer"><p className="total-investment">Total: {hasPrice ? formatCurrency(stock.price * (quantity[stock.symbol] || 1), stock.currency || 'INR') : '—'}</p><button className="add-btn" onClick={() => openPurchaseModal(stock)}>+ Add to Portfolio</button><button className="add-btn" onClick={() => addToWatchlist(stock)} disabled={isWatching(stock.symbol)}>{isWatching(stock.symbol) ? 'Watching' : '+ Watch'}</button></div>
                </div>
              );
            })}
          </div>
          <div className="pagination-controls"><button className="filter-btn" disabled={page === 1} onClick={() => setPage((old) => old - 1)}>← Previous</button><span>Page {page.toLocaleString()} of {totalPages.toLocaleString()}</span><button className="filter-btn" disabled={page === totalPages} onClick={() => setPage((old) => old + 1)}>Next →</button></div>
        </>
      )}

      {pendingPurchase && (
        <div className="demo-payment-overlay" role="dialog" aria-modal="true">
          <div className="demo-payment-modal">
            <div className="demo-payment-banner">DEMO PAYMENT — NO REAL MONEY WILL BE CHARGED</div>
            <h3>Confirm stock purchase</h3>

            <div className="purchase-summary">
              <div className="summary-row">
                <span className="label">Stock</span>
                <span className="value">{pendingPurchase.symbol} — {pendingPurchase.name}</span>
              </div>
              <div className="summary-row">
                <span className="label">Quantity</span>
                <span className="value">{pendingPurchase.quantity}</span>
              </div>
              <div className="summary-row">
                <span className="label">Market price</span>
                <span className="value">{formatCurrency(pendingPurchase.price, pendingPurchase.currency || 'INR')}</span>
              </div>
              <div className="summary-row total-row">
                <span className="label">Total</span>
                <span className="value">{formatCurrency(pendingPurchase.total, pendingPurchase.currency || 'INR')}</span>
              </div>
            </div>

            <div className="payment-method-block">
              <label>Demo payment method</label>
              <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
                <option value="demo-wallet">Demo Wallet</option>
                <option value="gpay">GPay</option>
                <option value="card">Debit/Credit Card</option>
                <option value="upi">UPI</option>
                <option value="netbanking">Net Banking</option>
              </select>
            </div>

            <p className="payment-note">No card number, CVV, bank account, or UPI credentials are collected.</p>

            <div className="payment-actions">
              <button className="cancel-btn" onClick={() => setPendingPurchase(null)}>Cancel</button>
              <button className="confirm-btn" onClick={confirmPurchase}>Complete Demo Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockSearch;
