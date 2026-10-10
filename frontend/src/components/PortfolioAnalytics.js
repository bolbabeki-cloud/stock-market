import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useStock } from '../context/StockContext';
import { calculatePortfolioMetrics, formatCurrency } from '../services/stockApi';
import '../styles/PortfolioAnalytics.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

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

const PortfolioAnalytics = ({ onNavigate }) => {
  const { portfolio, stockPrices, stockQuotes } = useStock();
  const [metrics, setMetrics] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    // Calculate portfolio metrics
    const calculatedMetrics = calculatePortfolioMetrics(portfolio, stockPrices);

    // Prepare data for sector pie chart
    const sectorData = {};
    portfolio.forEach((stock) => {
      const sector = stock.sector || 'Unknown';
      const currentPrice = stockPrices[stock.symbol] || stock.price;
      const value = currentPrice * stock.quantity;
      sectorData[sector] = (sectorData[sector] || 0) + value;
    });

    const pieData = Object.entries(sectorData).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
    }));
    setChartData(pieData);

    // Prepare performance data
    const performanceChartData = portfolio.map((stock) => {
      const quote = stockQuotes[stock.symbol];
      const currentPrice = quote?.price ?? stockPrices[stock.symbol] ?? stock.price;
      const previousClose = quote?.previousClose ?? stock.previousClose ?? stock.averagePrice ?? stock.price;
      const investmentValue = previousClose * stock.quantity;
      const currentValue = currentPrice * stock.quantity;
      const gainLoss = currentValue - investmentValue;
      const returnPercent = investmentValue > 0 ? (gainLoss / investmentValue) * 100 : 0;

      return {
        symbol: stock.symbol,
        currency: currencyForStock(stock),
        investment: parseFloat(investmentValue.toFixed(2)),
        current: parseFloat(currentValue.toFixed(2)),
        gainLoss: parseFloat(gainLoss.toFixed(2)),
        returnPercent: parseFloat(returnPercent.toFixed(2)),
      };
    });
    setPerformanceData(performanceChartData);
    const currentValue = performanceChartData.reduce((total, stock) => total + stock.current, 0);
    const dailyBaseValue = performanceChartData.reduce((total, stock) => total + stock.investment, 0);
    const dailyGain = currentValue - dailyBaseValue;
    const totalInvestment = calculatedMetrics.totalInvestment;
    setMetrics({
      ...calculatedMetrics,
      totalValue: currentValue,
      totalInvestment,
      totalGain: dailyGain,
      gainLossPercentage: dailyBaseValue > 0 ? (dailyGain / dailyBaseValue) * 100 : 0,
    });
  }, [portfolio, stockPrices, stockQuotes]);

  if (!metrics) {
    return <div className="loading">Loading analytics...</div>;
  }

  if (portfolio.length === 0) {
    return (
      <div className="analytics-container">
        <button className="back-btn" onClick={() => onNavigate('dashboard')}>
          ← Back to Dashboard
        </button>
        <div className="empty-state">
          <p>No portfolio data to analyze</p>
          <button onClick={() => onNavigate('search')}>Add stocks to get started</button>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <button className="back-btn" onClick={() => onNavigate('dashboard')}>
        ← Back to Dashboard
      </button>

      <h1> Portfolio Analytics</h1>

      <div className="metrics-summary">
        <div className="metric">
          <span className="label">Portfolio Value</span>
          <span className="value">{formatCurrency(metrics.totalValue)}</span>
        </div>
        <div className="metric">
          <span className="label">Total Invested</span>
          <span className="value">{formatCurrency(metrics.totalInvestment)}</span>
        </div>
        <div className={`metric ${metrics.totalGain >= 0 ? 'positive' : 'negative'}`}>
          <span className="label">Total Gain/Loss</span>
          <span className="value">{formatCurrency(metrics.totalGain)}</span>
          <span className="percentage">{metrics.gainLossPercentage.toFixed(2)}%</span>
        </div>
        <div className="metric">
          <span className="label">Holdings</span>
          <span className="value">{metrics.holdingCount}</span>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-box">
          <h3>Portfolio Composition (by Sector)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={(entry) => `${entry.name}: ₹${(entry.value / 100000).toFixed(1)}L`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Sector-wise Value Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="value" fill="#8884d8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="performance-section">
        <h3>Individual Stock Performance</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={performanceData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="symbol" type="category" width={80} />
            <Tooltip
              formatter={(value, _name, item) => (typeof value === 'number' ? formatCurrency(value, item?.payload?.currency || 'INR') : value)}
            />
            <Legend />
            <Bar dataKey="investment" stackId="a" fill="#8884d8" name="Investment" />
            <Bar dataKey="gainLoss" stackId="a" fill="#82ca9d" name="Gain/Loss" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="holdings-table">
        <h3>Detailed Holdings</h3>
        <table>
          <thead>
            <tr>
              <th>Stock</th>
              <th>Sector</th>
              <th>Previous Close Value</th>
              <th>Current Value</th>
              <th>Gain/Loss</th>
              <th>Return %</th>
              <th>% of Portfolio</th>
            </tr>
          </thead>
          <tbody>
            {performanceData.map((data, index) => {
              const stock = portfolio[index];
              const currency = data.currency || currencyForStock(stock);
              const percentOfPortfolio = (data.current / metrics.totalValue) * 100;
              const gainLossClass = data.gainLoss >= 0 ? 'positive' : 'negative';

              return (
                <tr key={stock.symbol}>
                  <td className="stock-symbol">
                    <strong>{stock.symbol}</strong>
                  </td>
                  <td>{stock.sector}</td>
                  <td>{formatCurrency(data.investment, currency)}</td>
                  <td>{formatCurrency(data.current, currency)}</td>
                  <td className={gainLossClass}>{formatCurrency(data.gainLoss, currency)}</td>
                  <td className={gainLossClass}>{data.returnPercent.toFixed(2)}%</td>
                  <td>{percentOfPortfolio.toFixed(2)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioAnalytics;
