import React, { useState } from 'react';
import { useStock } from '../context/StockContext';
import { formatCurrency } from '../services/stockApi';
import { FiX, FiPlus } from 'react-icons/fi';
import '../styles/Watchlist.css';

const Watchlist = ({ onNavigate }) => {
  const { watchlist, stockQuotes, removeFromWatchlist, addToPortfolio } = useStock();
  const [quantity, setQuantity] = useState({});

  const buy = (stock) => addToPortfolio({
    symbol: stock.symbol,
    name: stock.name,
    sector: stock.sector,
    exchange: stock.exchange,
    currency: stock.currency,
    quantity: quantity[stock.symbol] || 1,
    price: stock.price,
  });

  return (
    <div className="watchlist-container">
      <button className="back-btn" onClick={() => onNavigate('dashboard')}>← Back to Dashboard</button>
      <h1> My Watchlist</h1>
      {watchlist.length === 0 ? (
        <div className="empty-watchlist">
          <p>Your watchlist is empty</p>
          <p className="secondary">Search the live market and add stocks you want to track.</p>
          <button className="add-btn" onClick={() => onNavigate('search')}><FiPlus /> Find stocks</button>
        </div>
      ) : (
        <div className="watchlist-content">
          <div className="watchlist-grid">
            {watchlist.map((item) => {
              const stock = stockQuotes[item.symbol] || item;
              return (
                <div key={item.id} className="watchlist-card">
                  <div className="card-header">
                    <div><h3>{stock.symbol}</h3><p className="company-name">{stock.name}</p></div>
                    <button className="remove-btn" onClick={() => removeFromWatchlist(item.id)} title="Remove from watchlist"><FiX /></button>
                  </div>
                  <div className="card-price">
                    <span className="price">{formatCurrency(stock.price, stock.currency || 'INR')}</span>
                    <span className={`change ${stock.change >= 0 ? 'positive' : 'negative'}`}>{stock.change >= 0 ? '+' : ''}{Number(stock.change || 0).toFixed(2)}%</span>
                  </div>
                  <div className="card-info">
                    <div className="info-row"><span>High: {stock.high || '—'}</span><span>Low: {stock.low || '—'}</span></div>
                    <div className="sector">{stock.exchange || stock.sector}</div>
                  </div>
                  <div className="card-actions">
                    <input type="number" min="1" value={quantity[stock.symbol] || 1} onChange={(e) => setQuantity((old) => ({ ...old, [stock.symbol]: Number(e.target.value) || 1 }))} className="qty-input" />
                    <button className="buy-btn" onClick={() => buy(stock)} disabled={!stock.price}>Buy</button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="add-more-section"><button className="add-btn" onClick={() => onNavigate('search')}>+ Find more stocks</button></div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
