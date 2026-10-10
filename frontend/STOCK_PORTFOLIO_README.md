#  Stock Portfolio Pro - Indian Stock Market Analysis Website

A comprehensive React-based stock portfolio management and analysis website with live market updates in Indian currency (INR). This application provides real-time tracking of Indian stocks (NSE/BSE) with advanced portfolio analytics and visualization tools.

##  Features

### 1. **Portfolio Dashboard**
- View all your stock holdings in one place
- Real-time portfolio value calculation
- Track total gain/loss and returns percentage
- Quick overview of portfolio performance metrics
- Interactive table with detailed stock information

### 2. **Stock Search & Management**
- Search Indian stocks by symbol or company name
- Filter stocks by sector
- Add stocks to portfolio with custom quantity and purchase price
- View detailed stock information including:
  - Current price in INR
  - Day's price change percentage
  - 52-week high and low
  - Trading volume
  - Sector classification

### 3. **Stock Details & Charts**
- Detailed stock information page
- Interactive Recharts visualizations:
  - 30-day price trend with area chart
  - High-Low price range bar chart
- Edit holdings (quantity and average purchase price)
- Remove stocks from portfolio
- Calculate individual stock gains/losses

### 4. **Portfolio Analytics**
- Comprehensive portfolio metrics:
  - Total portfolio value
  - Total investment amount
  - Total gain/loss in INR and percentage
  - Number of holdings
- **Visual Analytics:**
  - Sector-wise distribution pie chart
  - Sector value distribution bar chart
  - Individual stock performance comparison
  - Detailed holdings table with return percentages
- Analyze portfolio composition and allocation

### 5. **Live Price Tracker**
- Real-time stock price updates
- Start/stop live updates
- Configurable update intervals (2s, 5s, 10s, 30s, 1m)
- Live price ticker display
- Comprehensive price tracking table
- Track both portfolio and watchlist stocks
- View price changes and percentages in real-time

### 6. **Watchlist Management**
- Create a personal watchlist of stocks to monitor
- Add stocks from portfolio or available stocks
- Quick buy action directly from watchlist
- View stock details from watchlist
- Remove stocks from watchlist

### 7. **Data Persistence**
- All portfolio data saved in browser's localStorage
- Watchlist persists across sessions
- Automatic data recovery on app reload

##  Supported Indian Stocks

The application includes data for 12 major Indian stocks across different sectors:

### Technology (IT Services)
- **TCS** - Tata Consultancy Services
- **INFY** - Infosys Limited
- **WIPRO** - Wipro Limited

### Banking
- **HDFCBANK** - HDFC Bank Limited
- **ICICIBANK** - ICICI Bank Limited
- **SBIN** - State Bank of India

### Energy
- **RELIANCE** - Reliance Industries Limited
- **POWERGRID** - Power Grid Corporation of India

### Telecom
- **BHARTIARTL** - Bharti Airtel Limited

### Automotive
- **MARUTI** - Maruti Suzuki India
- **TATAMOTORS** - Tata Motors Limited

### Financial Services
- **JIOFINANCIAL** - Jio Financial Services

##  Technology Stack

### Frontend
- **React 19.2.4** - UI framework
- **Recharts 2.10.0** - Advanced charting library for data visualization
- **React Icons 4.12.0** - Icon library for UI elements
- **Axios 1.6.0** - API client (for future integration with real APIs)
- **date-fns 2.30.0** - Date formatting and manipulation

### Styling
- **CSS3** - Custom styling with CSS Grid and Flexbox
- **Responsive Design** - Mobile-first approach with media queries

### State Management
- **React Context API** - Global state management
- **localStorage** - Client-side data persistence

##  Installation & Setup
### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation Steps

```bash
# Navigate to project directory
cd myapp

# Install dependencies
npm install

# Start the development server
npm start

# Build for production
npm build
```

The application will open in your browser at `http://localhost:3000`

##  Usage Guide

### 1. **Getting Started**
   - Open the application - you'll see the Portfolio Dashboard
   - Initially, your portfolio is empty
   - Navigate to "Search" tab to add stocks

### 2. **Adding Stocks to Portfolio**
   - Click on "Search" in the navigation
   - Search for a stock by symbol (e.g., "TCS", "RELIANCE") or company name
   - Select quantity and purchase price
   - Click "Add to Portfolio"

### 3. **Viewing Portfolio**
   - Return to "Dashboard" to see all holdings
   - Hover over a holding to see more details
   - Click "View" button to see detailed stock analysis

### 4. **Analyzing Your Portfolio**
   - Click "Analytics" to see sector composition
   - View pie chart of portfolio allocation
   - Analyze individual stock performance
   - Compare gains/losses across holdings

### 5. **Tracking Live Prices**
   - Click "Live Tracker" to start tracking prices
   - Click "Start Live Updates" to enable real-time updates
   - Adjust update frequency (every 2s to 1m)
   - Monitor price changes in real-time

### 6. **Managing Watchlist**
   - Click "Watchlist" to manage stocks you're interested in
   - Add stocks to watchlist for monitoring
   - Quick "Buy" button to add watchlist items to portfolio
   - Remove stocks from watchlist anytime

##  Features in Detail

### Portfolio Metrics
- **Total Portfolio Value**: Current market value of all holdings
- **Total Investment**: Sum of all money invested
- **Total Gain/Loss**: Profit/loss in INR
- **Return Percentage**: Overall portfolio return%

### Stock Information
Each stock displays:
- Symbol and Company Name
- Sector Classification
- Current Price (₹ INR)
- Daily Change (%)
- 52-week High/Low
- Trading Volume
- Your Holdings (quantity, average price, current value)

### Charts & Visualizations
- **Area Charts**: 30-day price trend
- **Bar Charts**: High-low price range, sector distribution
- **Pie Charts**: Portfolio allocation by sector
- **Real-time Ticker**: Live price updates

##  Live Updates Simulation

The application simulates real-time price updates to demonstrate live tracking functionality. In production, you can integrate with:
- **Alpha Vantage API** - Real-time stock data
- **Finnhub API** - Market data API
- **NSE/BSE Official APIs** - Indian market data
- **Polygon.io** - Stock data provider

##  Data Storage

All data is stored locally in your browser:
- Portfolio holdings
- Watchlist items
- Historical price data
- User preferences

Data persists across browser sessions until you clear browser data.

##  UI/UX Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern Interface**: Clean, professional design with smooth animations
- **Intuitive Navigation**: Easy-to-use navigation bar
- **Real-time Updates**: Live price ticker with animations
- **Color Coding**: Green for gains, Red for losses
- **Accessibility**: Clear fonts, good contrast, readable layout

##  Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px to 1023px
- **Mobile**: Below 768px

##  Future Enhancements

1. **Real API Integration**
   - Integrate with live stock data APIs
   - Real-time price feeds from NSE/BSE
   - Historical data from reliable sources

2. **Advanced Features**
   - Technical analysis indicators (RSI, MACD, Bollinger Bands)
   - Portfolio recommendations based on risk tolerance
   - Tax-loss harvesting suggestions
   - Dividend tracking
   - Portfolio alerts and notifications

3. **User Authentication**
   - User accounts and cloud sync
   - Multiple portfolios
   - Portfolio sharing and collaboration

4. **Mobile App**
   - React Native mobile application
   - Push notifications for price alerts
   - Offline access

##  File Structure

```
src/
├── components/
│   ├── PortfolioDashboard.js
│   ├── StockSearch.js
│   ├── StockDetails.js
│   ├── PortfolioAnalytics.js
│   ├── Watchlist.js
│   └── LivePriceTracker.js
├── context/
│   └── StockContext.js
├── services/
│   └── stockApi.js
├── styles/
│   ├── PortfolioDashboard.css
│   ├── StockSearch.css
│   ├── StockDetails.css
│   ├── PortfolioAnalytics.css
│   ├── Watchlist.css
│   └── LivePriceTracker.css
├── App.js
├── App.css
├── index.js
└── index.css
```

##  Key Functions

### Context (StockContext.js)
- `addToPortfolio()` - Add stock to portfolio
- `removeFromPortfolio()` - Remove stock from portfolio
- `updatePortfolioStock()` - Update stock holdings
- `addToWatchlist()` - Add stock to watchlist
- `updateStockPrice()` - Update current stock price

### Services (stockApi.js)
- `searchStocks()` - Search stocks
- `getStockBySymbol()` - Get stock details
- `generateHistoricalData()` - Create 30-day price history
- `simulatePriceUpdate()` - Simulate price changes
- `calculatePortfolioMetrics()` - Calculate portfolio statistics

##  Security Notes

- All data stored locally in browser (no server communication by default)
- No sensitive data transmission before API connection
- localStorage cleared when browser cache is cleared

##  Support

For issues or suggestions, please create an issue in the repository or contact the development team.

##  License

This project is created for educational and demonstration purposes.

---

**Happy Trading! **

*Note: This is a demonstration application with mock data. For real portfolio management, integrate with live market data APIs and consider consulting a financial advisor.*
