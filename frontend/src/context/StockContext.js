import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getQuotes } from '../services/stockApi';
import { AuthContext } from './AuthContext';

const StockContext = createContext();

const getCurrentUserId = () => {
  try {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved)?.id || 'guest' : 'guest';
  } catch {
    return 'guest';
  }
};

const getStorageKey = (key) => {
  const userId = getCurrentUserId();
  return userId ? `${key}_${userId}` : key;
};

const loadUserData = (key, fallback = []) => {
  const storageKey = getStorageKey(key);
  const saved = localStorage.getItem(storageKey);
  if (!saved) return fallback;

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    localStorage.removeItem(storageKey);
    return fallback;
  }
};

export const StockProvider = ({ children }) => {
  const authContext = useContext(AuthContext);
  const currentUser = authContext?.currentUser ?? (() => {
    try {
      return JSON.parse(localStorage.getItem('currentUser') || 'null');
    } catch {
      return null;
    }
  })();

  const [portfolio, setPortfolio] = useState(() => loadUserData('portfolio', []));
  const [watchlist, setWatchlist] = useState(() => loadUserData('watchlist', []));

  const [stockPrices, setStockPrices] = useState({});
  const [stockQuotes, setStockQuotes] = useState({});

  useEffect(() => {
    setPortfolio(loadUserData('portfolio', []));
    setWatchlist(loadUserData('watchlist', []));
  }, [currentUser?.id]);

  const refreshStockPrices = useCallback(async (stocks = [...portfolio, ...watchlist]) => {
    if (!stocks.length) return [];

    const quotes = await getQuotes(stocks);
    const quoteMap = Object.fromEntries(quotes.map((quote) => [quote.symbol, quote]));
    setStockQuotes((previous) => ({ ...previous, ...quoteMap }));
    setStockPrices((previous) => ({
      ...previous,
      ...Object.fromEntries(quotes.map((quote) => [quote.symbol, quote.price])),
    }));
    return quotes;
  }, [portfolio, watchlist]);

  useEffect(() => {
    const tracked = [...portfolio, ...watchlist];
    if (!tracked.length) return undefined;
    let active = true;
    const refresh = async () => {
      try {
        if (active) await refreshStockPrices(tracked);
      } catch (error) {
        // Individual screens surface API configuration/network errors.
      }
    };
    refresh();
    const timer = setInterval(refresh, 60000);
    return () => { active = false; clearInterval(timer); };
  }, [portfolio, watchlist, refreshStockPrices]);

  const savePortfolio = useCallback((newPortfolio) => {
    setPortfolio(newPortfolio);
    localStorage.setItem(getStorageKey('portfolio'), JSON.stringify(newPortfolio));
  }, []);

  const saveWatchlist = useCallback((newWatchlist) => {
    setWatchlist(newWatchlist);
    localStorage.setItem(getStorageKey('watchlist'), JSON.stringify(newWatchlist));
  }, []);

  const addToPortfolio = useCallback((stock) => {
    setPortfolio((prev) => {
      const existing = prev.find((s) => s.symbol === stock.symbol);
      let updated;
      if (existing) {
        updated = prev.map((s) =>
          s.symbol === stock.symbol
            ? {
                ...s,
                quantity: s.quantity + stock.quantity,
                averagePrice: (s.averagePrice * s.quantity + stock.price * stock.quantity) / (s.quantity + stock.quantity),
              }
            : s
        );
      } else {
        updated = [...prev, { ...stock, id: Date.now(), averagePrice: stock.price }];
      }
      savePortfolio(updated);
      return updated;
    });
  }, [savePortfolio]);

  const removeFromPortfolio = useCallback((id) => {
    setPortfolio((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      savePortfolio(updated);
      return updated;
    });
  }, [savePortfolio]);

  const updatePortfolioStock = useCallback((id, updates) => {
    setPortfolio((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, ...updates } : s));
      savePortfolio(updated);
      return updated;
    });
  }, [savePortfolio]);

  const addToWatchlist = useCallback((stock) => {
    setWatchlist((prev) => {
      if (!prev.find((s) => s.symbol === stock.symbol)) {
        const updated = [...prev, { ...stock, id: Date.now() }];
        localStorage.setItem(getStorageKey('watchlist'), JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  }, []);

  const removeFromWatchlist = useCallback((id) => {
    setWatchlist((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      saveWatchlist(updated);
      return updated;
    });
  }, [saveWatchlist]);

  return (
    <StockContext.Provider
      value={{
        portfolio,
        watchlist,
        stockPrices,
        stockQuotes,
        refreshStockPrices,
        addToPortfolio,
        removeFromPortfolio,
        updatePortfolioStock,
        addToWatchlist,
        removeFromWatchlist,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStock must be used within StockProvider');
  }
  return context;
};
