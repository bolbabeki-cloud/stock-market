import React, { useEffect, useState } from 'react';
import { useStock } from '../context/StockContext';
import { calculatePortfolioMetrics, formatCurrency, formatPercentage } from '../services/stockApi';
import { FiTrendingUp, FiTrendingDown, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import '../styles/PortfolioDashboard.css';

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

const PortfolioDashboard = ({ onNavigate }) => {
  const { portfolio, stockPrices, stockQuotes, updatePortfolioStock, removeFromPortfolio, addToPortfolio } = useStock();
  const [metrics, setMetrics] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editQuantity, setEditQuantity] = useState(1);
  const [editPrice, setEditPrice] = useState(0);
  const [demoPurchase, setDemoPurchase] = useState(null);
  const [demoPaymentMethod, setDemoPaymentMethod] = useState('demo-wallet');

  const openDemoPurchase = () => {
    const price = 2850;
    const quantity = 1;
    setDemoPurchase({
      symbol: 'RELIANCE',
      name: 'Reliance Industries Limited',
      quantity,
      price,
      total: price * quantity,
      currency: 'INR',
    });
  };

  const confirmDemoPurchase = () => {
    if (!demoPurchase) return;

    const methodMap = {
      'demo-wallet': 'Demo Wallet',
      gpay: 'GPay',
      card: 'Debit/Credit Card',
      upi: 'UPI',
      netbanking: 'Net Banking',
    };

    const selectedMethod = methodMap[demoPaymentMethod] || 'Demo Wallet';

    addToPortfolio({
      symbol: demoPurchase.symbol,
      name: demoPurchase.name,
      quantity: demoPurchase.quantity,
      price: demoPurchase.price,
      currency: demoPurchase.currency,
    });

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const storageKey = currentUser?.id ? `demoPaymentHistory_${currentUser.id}` : 'demoPaymentHistory_guest';
    const savedHistory = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const paymentRecord = {
      id: Date.now(),
      stock: demoPurchase.symbol,
      amount: demoPurchase.total,
      method: selectedMethod,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(storageKey, JSON.stringify([paymentRecord, ...savedHistory]));

    setDemoPurchase(null);
    setDemoPaymentMethod('demo-wallet');
  };

  const startEditing = (stock) => {
    setEditingId(stock.id);
    setEditQuantity(stock.quantity);
    setEditPrice(stock.averagePrice);
  };

  const saveEditing = (stock) => {
    const quantity = Number(editQuantity);
    const averagePrice = Number(editPrice);
    if (quantity > 0 && averagePrice >= 0) {
      updatePortfolioStock(stock.id, { quantity, averagePrice, price: averagePrice });
      setEditingId(null);
    }
  };

  const removeHolding = (stock) => {
    if (window.confirm(`Remove ${stock.symbol} from your portfolio?`)) removeFromPortfolio(stock.id);
  };

  useEffect(() => {
    const calculated = calculatePortfolioMetrics(portfolio, stockPrices);
    const dailyGain = portfolio.reduce((total, stock) => {
      const quote = stockQuotes[stock.symbol];
      const currentPrice = quote?.price ?? stockPrices[stock.symbol] ?? stock.price;
      const previousClose = quote?.previousClose ?? stock.previousClose ?? stock.averagePrice;
      return total + ((currentPrice - previousClose) * stock.quantity);
    }, 0);
    const previousValue = portfolio.reduce((total, stock) => {
      const quote = stockQuotes[stock.symbol];
      const previousClose = quote?.previousClose ?? stock.previousClose ?? stock.averagePrice;
      return total + (previousClose * stock.quantity);
    }, 0);
    setMetrics({
      ...calculated,
      totalGain: dailyGain,
      gainLossPercentage: previousValue > 0 ? (dailyGain / previousValue) * 100 : 0,
    });
  }, [portfolio, stockPrices, stockQuotes]);

  if (!metrics) {
    return <div className="dashboard-loading">Loading portfolio...</div>;
  }

  const gainLossClass = metrics.totalGain >= 0 ? 'positive' : 'negative';
  const gainLossIcon = metrics.totalGain >= 0 ? <FiTrendingUp /> : <FiTrendingDown />;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1> Stock Portfolio Dashboard</h1>
        <button className="add-stock-btn" onClick={openDemoPurchase}>
          + Add Stock
        </button>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Portfolio Value</h3>
          <p className="metric-value">{formatCurrency(metrics.totalValue)}</p>
        </div>

        <div className="metric-card">
          <h3>Total Investment</h3>
          <p className="metric-value">{formatCurrency(metrics.totalInvestment)}</p>
        </div>

        <div className={`metric-card gain-loss ${gainLossClass}`}>
          <h3>Today's Total Gain/Loss</h3>
          <div className={`metric-value-with-icon ${gainLossClass}`}>
            {gainLossIcon}
            <p>{formatCurrency(metrics.totalGain)}</p>
          </div>
          <p className={`metric-percentage ${gainLossClass}`}>{formatPercentage(metrics.gainLossPercentage)}</p>
        </div>

        <div className="metric-card">
          <h3>Holdings</h3>
          <p className="metric-value">{metrics.holdingCount}</p>
        </div>
      </div>

      {demoPurchase && (
        <div className="demo-payment-overlay" role="dialog" aria-modal="true">
          <div className="demo-payment-modal">
            <div className="demo-payment-banner">DEMO PAYMENT — NO REAL MONEY WILL BE CHARGED</div>
            <h2>Confirm stock purchase</h2>

            <div className="purchase-summary">
              <div className="summary-row">
                <span className="label">Stock</span>
                <span className="value">{demoPurchase.symbol} — {demoPurchase.name}</span>
              </div>
              <div className="summary-row">
                <span className="label">Quantity</span>
                <span className="value">{demoPurchase.quantity}</span>
              </div>
              <div className="summary-row">
                <span className="label">Market price</span>
                <span className="value">₹{demoPurchase.price.toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row total-row">
                <span className="label">Total</span>
                <span className="value">₹{demoPurchase.total.toLocaleString('en-IN')}.00</span>
              </div>
            </div>

            <div className="payment-method-block">
              <label>Demo payment method</label>
              <select value={demoPaymentMethod} onChange={(event) => setDemoPaymentMethod(event.target.value)}>
                <option value="demo-wallet">Demo Wallet</option>
                <option value="gpay">GPay</option>
                <option value="card">Debit/Credit Card</option>
                <option value="upi">UPI</option>
                <option value="netbanking">Net Banking</option>
              </select>
            </div>

            <p className="payment-note">No card number, CVV, bank account, or UPI credentials are collected.</p>

            <div className="payment-actions">
              <button className="cancel-btn" onClick={() => setDemoPurchase(null)}>Cancel</button>
              <button className="confirm-btn" onClick={confirmDemoPurchase}>Complete Demo Payment</button>
            </div>
          </div>
        </div>
      )}

      <div className="holdings-section">
        <div className="section-header">
          <h2>Your Holdings</h2>
        </div>

        {portfolio.length === 0 ? (
          <div className="empty-state">
            <p>No stocks in portfolio yet</p>
            <button onClick={() => onNavigate('search')}>Start by adding a stock</button>
          </div>
        ) : (
          <div className="holdings-table">
            <table>
              <thead>
                <tr>
                  <th>Stock</th>
                  <th>Quantity</th>
                  <th>Avg. Price</th>
                  <th>Current Price</th>
                  <th>Current Value</th>
                  <th>Gain/Loss</th>
                  <th>Return %</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((stock) => {
                  const currency = currencyForStock(stock);
                  const quote = stockQuotes[stock.symbol];
                  const currentPrice = quote?.price ?? stockPrices[stock.symbol] ?? stock.price;
                  const currentValue = currentPrice * stock.quantity;
                  const previousClose = quote?.previousClose ?? stock.previousClose ?? stock.averagePrice;
                  const previousValue = previousClose * stock.quantity;
                  const gainLoss = currentValue - previousValue;
                  const returnPercent = previousValue > 0 ? (gainLoss / previousValue) * 100 : 0;
                  const rowClass = gainLoss >= 0 ? 'positive-row' : 'negative-row';

                  return (
                    <tr key={stock.id} className={rowClass}>
                      <td className={`stock-name ${gainLoss >= 0 ? 'company-profit' : 'company-loss'}`}>
                        <strong>{stock.symbol}</strong>
                        <br />
                        <small>{stock.name}</small>
                      </td>
                      <td>{editingId === stock.id ? <input className="holding-edit-input" type="number" min="1" value={editQuantity} onChange={(event) => setEditQuantity(event.target.value)} /> : stock.quantity}</td>
                      <td>{editingId === stock.id ? <input className="holding-edit-input" type="number" min="0" step="0.01" value={editPrice} onChange={(event) => setEditPrice(event.target.value)} /> : formatCurrency(stock.averagePrice, currency)}</td>
                      <td>{formatCurrency(currentPrice, currency)}</td>
                      <td>{formatCurrency(currentValue, currency)}</td>
                      <td className={gainLoss >= 0 ? 'text-success gain-loss-value' : 'text-danger gain-loss-value'}>
                        {gainLoss >= 0 ? '+' : ''}{formatCurrency(gainLoss, currency)}
                      </td>
                      <td className={gainLoss >= 0 ? 'text-success' : 'text-danger'}>
                        {formatPercentage(returnPercent)}
                      </td>
                      <td>
                        <div className="holding-actions">
                          {editingId === stock.id ? (
                            <>
                              <button className="holding-save-btn" onClick={() => saveEditing(stock)} title="Save changes"><FiCheck /> Save</button>
                              <button className="holding-cancel-btn" onClick={() => setEditingId(null)} title="Cancel"><FiX /></button>
                            </>
                          ) : (
                            <>
                              <button className="holding-edit-btn" onClick={() => startEditing(stock)} title="Edit holding"><FiEdit2 /> Edit</button>
                              <button className="holding-remove-btn" onClick={() => removeHolding(stock)} title="Remove holding"><FiTrash2 /> Remove</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioDashboard;
