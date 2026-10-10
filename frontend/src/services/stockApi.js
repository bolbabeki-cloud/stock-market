import axios from 'axios';

const getMarketApiBaseUrl = () => {
  const configured = process.env.REACT_APP_MARKET_API_BASE_URL
    || process.env.REACT_APP_API_BASE_URL
    || '';
  if (configured) return configured.replace(/\/$/, '');

  const hostname = typeof window === 'undefined' ? '' : window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001';
  }

  // Firebase Hosting is static on the Spark plan, so send API requests directly
  // to the Render web service instead of a Firebase function rewrite.
  return 'https://stock-portfolio-pro.onrender.com';
};

const MARKET_API = getMarketApiBaseUrl();

const normalizeQuotesResponse = (response) => {
  const payload = response?.data ?? response;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.quotes)) return payload.quotes;
  if (Array.isArray(payload?.result)) return payload.result;
  return [];
};

export const getQuotes = async (stocks) => {
  const unique = [...new Map(
    stocks.filter(Boolean).map((stock) => [`${stock.symbol}:${stock.exchange || ''}`, stock])
  ).values()];
  const batches = Array.from({ length: Math.ceil(unique.length / 12) }, (_, index) => unique.slice(index * 12, (index + 1) * 12));
  let responses;
  try {
    responses = await Promise.all(batches.map((batch) => axios.post(
      `${MARKET_API}/api/market/quotes`,
      { stocks: batch },
      { timeout: 20000 }
    )));
  } catch (error) {
    if (!error.response) {
      throw new Error('Cannot access the stock API. Check your connection and try again.');
    }
    throw error;
  }

  return responses.flatMap((response) => normalizeQuotesResponse(response));
};

export const calculatePortfolioMetrics = (portfolio, prices) => {
  const totals = portfolio.reduce((result, holding) => {
    const currentPrice = prices[holding.symbol] || holding.price || holding.averagePrice;
    result.totalValue += currentPrice * holding.quantity;
    result.totalInvestment += holding.averagePrice * holding.quantity;
    return result;
  }, { totalValue: 0, totalInvestment: 0 });

  const totalGain = totals.totalValue - totals.totalInvestment;
  const gainLossPercentage = totals.totalInvestment > 0
    ? (totalGain / totals.totalInvestment) * 100
    : 0;

  return {
    ...totals,
    totalGain,
    totalReturn: gainLossPercentage,
    gainLossPercentage,
    holdingCount: portfolio.length,
  };
};

export const formatCurrency = (value, currency = 'INR') => new Intl.NumberFormat(
  currency === 'INR' ? 'en-IN' : 'en-US',
  { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }
).format(value || 0);

export const formatPercentage = (value) => `${Number(value || 0).toFixed(2)}%`;
