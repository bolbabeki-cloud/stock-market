import React, { useEffect, useState } from 'react';
import './App.css';
import { StockProvider } from './context/StockContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import PortfolioDashboard from './components/PortfolioDashboard';
import PortfolioAnalytics from './components/PortfolioAnalytics';
import LivePriceTracker from './components/LivePriceTracker';
import Watchlist from './components/Watchlist';
import StockSearch from './components/StockSearch';
import InternationalStocks from './components/InternationalStocks';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import { formatCurrency } from './services/stockApi';
import { FiBarChart2, FiSearch, FiGlobe, FiActivity, FiStar, FiUser, FiCreditCard } from 'react-icons/fi';

const getCurrentUserStorageKey = (prefix) => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    return currentUser?.id ? `${prefix}_${currentUser.id}` : `${prefix}_guest`;
  } catch {
    return `${prefix}_guest`;
  }
};

function DemoPaymentHistory({ onNavigate }) {
  const currentUserId = (() => {
    try {
      return JSON.parse(localStorage.getItem('currentUser') || 'null')?.id || 'guest';
    } catch {
      return 'guest';
    }
  })();

  const [payments, setPayments] = useState(() => {
    try {
      const storageKey = getCurrentUserStorageKey('demoPaymentHistory');
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      const storageKey = getCurrentUserStorageKey('demoPaymentHistory');
      const saved = localStorage.getItem(storageKey);
      setPayments(saved ? JSON.parse(saved) : []);
    } catch {
      setPayments([]);
    }
  }, [currentUserId]);

  return (
    <div className="payments-page">
      <button className="back-btn" onClick={() => onNavigate('dashboard')}>
        ← Back to Dashboard
      </button>

      <div className="payments-page-content">
        <h1>Demo Payment History</h1>

        {payments.length === 0 ? (
          <div className="payments-banner" role="status">
            <p>Simulation only. These records do not represent real trades or payments.</p>
            <span className="payments-warning">No completed demo payments yet</span>
          </div>
        ) : (
          <div className="payments-list">
            {payments.map((payment) => (
              <div className="payment-row" key={payment.id}>
                <div className="payment-main">
                  <span className="payment-stock">{payment.stock || payment.symbol || 'Demo Stock'}</span>
                  <span className="payment-meta">
                    <span>{payment.method || 'Demo Wallet'}</span>
                    <span>Completed {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : 'recently'}</span>
                  </span>
                </div>
                <div className="payment-amount">
                  <span>Completed</span>
                  {formatCurrency(payment.amount, payment.currency || 'INR')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { isLoggedIn, currentUser } = useAuth();

  if (!isLoggedIn || !currentUser) {
    return <Login />;
  }

  const handleNavigate = async (page) => {
    setCurrentPage(page);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'search':
        return <StockSearch onNavigate={handleNavigate} />;
      case 'international':
        return <InternationalStocks onNavigate={handleNavigate} />;
      case 'analytics':
        return <PortfolioAnalytics onNavigate={handleNavigate} />;
      case 'live':
        return <LivePriceTracker onNavigate={handleNavigate} />;
      case 'watchlist':
        return <Watchlist onNavigate={handleNavigate} />;
      case 'profile':
        return <UserProfile onNavigate={handleNavigate} />;
      case 'payments':
        return <DemoPaymentHistory onNavigate={handleNavigate} />;
      case 'dashboard':
      default:
        return <PortfolioDashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-brand">
          <h2>Stock Portfolio Pro</h2>
          {currentUser && <span className="user-info">👤 {currentUser.name}</span>}
        </div>
        <div className="nav-links">
          <button
            className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigate('dashboard')}
            title="Dashboard"
          >
            <FiBarChart2 />
            <span>Dashboard</span>
          </button>
          <button
            className={`nav-btn ${currentPage === 'search' ? 'active' : ''}`}
            onClick={() => handleNavigate('search')}
            title="Indian Stocks"
          >
            <FiSearch />
            <span>Indian</span>
          </button>
          <button
            className={`nav-btn ${currentPage === 'international' ? 'active' : ''}`}
            onClick={() => handleNavigate('international')}
            title="International Stocks"
          >
            <FiGlobe />
            <span>International</span>
          </button>
          <button
            className={`nav-btn ${currentPage === 'analytics' ? 'active' : ''}`}
            onClick={() => handleNavigate('analytics')}
            title="Portfolio Analytics"
          >
            <FiActivity />
            <span>Analytics</span>
          </button>
          <button
            className={`nav-btn ${currentPage === 'watchlist' ? 'active' : ''}`}
            onClick={() => handleNavigate('watchlist')}
            title="Watchlist"
          >
            <FiStar />
            <span>Watchlist</span>
          </button>
          <button
            className={`nav-btn ${currentPage === 'live' ? 'active' : ''}`}
            onClick={() => handleNavigate('live')}
            title="Live Price Tracker"
          >
            <FiActivity />
            <span>Live</span>
          </button>
          <button
            className={`nav-btn ${currentPage === 'payments' ? 'active' : ''}`}
            onClick={() => handleNavigate('payments')}
            title="Payments"
          >
            <FiCreditCard />
            <span>Payments</span>
          </button>
          <button
            className={`nav-btn ${currentPage === 'profile' ? 'active' : ''}`}
            onClick={() => handleNavigate('profile')}
            title="Profile Settings"
          >
            <FiUser />
            <span>Profile</span>
          </button>
        </div>
      </nav>

      <main className="main-content">
        {renderContent()}
      </main>

      <footer className="app-footer">
        <p>© 2026 Stock Portfolio Pro | Global Markets | Real-time Analysis | {currentUser && `User: ${currentUser.email}`}</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <StockProvider>
        <AppContent />
      </StockProvider>
    </AuthProvider>
  );
}

export default App;
