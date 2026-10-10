# 📁 Stock Portfolio Pro - File Reference Guide

## Project Overview

This is a comprehensive stock portfolio management and analysis website built with React, featuring live market updates in Indian currency (INR). It includes mock data for 12 major Indian stocks with advanced visualization and tracking capabilities.

## 📂 Directory Structure & File Descriptions

### Configuration Files

#### `package.json`
- **Updated**: Added 4 new dependencies
- **Dependencies Added**:
  - `recharts`: Professional charting library for visualizations
  - `axios`: HTTP client for API calls
  - `react-icons`: Icon library for UI
  - `date-fns`: Date formatting utilities
- **Purpose**: Defines project metadata, scripts, and dependencies

### Source Files (`src/`)

#### **Components** (`src/components/`)

1. **PortfolioDashboard.js**
   - Main dashboard showing all holdings
   - Portfolio metrics (total value, investment, gain/loss)
   - Holdings table with stock details
   - Quick access to add stocks and view analytics
   - Features: Real-time calculation, responsive table

2. **StockSearch.js**
   - Search interface for finding and adding stocks
   - Search by symbol, company name, or sector
   - Stock cards with purchase options
   - Custom quantity and price input
   - Features: Live search filtering, success feedback, portfolio integration

3. **StockDetails.js**
   - Detailed view for individual stocks
   - Stock information and current price
   - Interactive charts:
     - 30-day price trend (area chart)
     - High-low price range (bar chart)
   - Edit/remove holdings
   - Calculate individual returns
   - Features: Recharts integration, editable holdings

4. **PortfolioAnalytics.js**
   - Advanced portfolio analysis page
   - Portfolio metrics summary
   - Sector composition pie chart
   - Sector value distribution bar chart
   - Individual stock performance comparison
   - Detailed holdings table with percentages
   - Features: Multi-chart visualization, comprehensive metrics

5. **Watchlist.js**
   - Watchlist management component
   - Add stocks to monitor
   - Quick buy action from watchlist
   - Add more stocks section
   - Quick stock preview cards
   - Features: Add/remove functionality, quick purchase

6. **LivePriceTracker.js**
   - Real-time price tracking interface
   - Live update controls with on/off toggle
   - Configurable update intervals
   - Live ticker display with price changes
   - Detailed price tracking table
   - Features: Simulated real-time updates, animations

#### **Context** (`src/context/`)

1. **StockContext.js**
   - Global state management using React Context API
   - Manages: portfolio, watchlist, stock prices
   - Key functions:
     - `addToPortfolio()`: Add stocks to portfolio
     - `removeFromPortfolio()`: Remove stocks
     - `updatePortfolioStock()`: Update holdings
     - `updateStockPrice()`: Update current prices
     - `addToWatchlist()`: Add to watchlist
   - localStorage integration for data persistence
   - Purpose: Centralized state management

#### **Services** (`src/services/`)

1. **stockApi.js**
   - Business logic and mock data
   - Mock database of 12 Indian stocks
   - Key functions:
     - `getAllStocks()`: Get all available stocks
     - `getStockBySymbol()`: Fetch specific stock
     - `searchStocks()`: Search functionality
     - `generateHistoricalData()`: Create 30-day price history
     - `simulatePriceUpdate()`: Simulate real-time price changes
     - `calculatePortfolioMetrics()`: Calculate portfolio statistics
     - `formatCurrency()`: Format prices in INR
     - `formatPercentage()`: Format percentages
   - Contains mock data for:
     - TCS, INFY, WIPRO, RELIANCE, HDFC Bank, ICICI Bank, SBI, Bharti Airtel, Maruti, Tata Motors, Power Grid, Jio Financial
   - Purpose: Data source and business logic

#### **Styles** (`src/styles/`)

1. **PortfolioDashboard.css**
   - Styling for portfolio dashboard
   - Metrics grid layout
   - Holdings table styling
   - Responsive breakpoints
   - Color scheme: Blue accents on white background

2. **StockSearch.css**
   - Search interface styles
   - Stock card grid layout
   - Input field styling
   - Responsive grid that adapts to screen size

3. **StockDetails.css**
   - Details page styling
   - Chart container styles
   - Holding information display
   - Edit/delete button styling

4. **PortfolioAnalytics.css**
   - Analytics page layout
   - Metrics summary grid
   - Chart box styling
   - Table styling for detailed holdings

5. **Watchlist.css**
   - Watchlist interface styling
   - Stock card layouts
   - Empty state design
   - Action button styling

6. **LivePriceTracker.css**
   - Live tracker interface
   - Ticker display styling
   - Control panel layout
   - Table styling for price details
   - Animation styles for live updates

### Root Source Files

#### **App.js** ✨ [UPDATED]
- Main application component
- Navigation bar with tabs:
  - Dashboard
  - Search
  - Analytics
  - Watchlist
  - Live Tracker
- Page routing logic
- Wraps entire app with StockProvider
- Features: Tab-based navigation, component routing

#### **App.css** ✨ [UPDATED]
- Global application styles
- CSS variables for theming:
  - Primary color: Blue (#2563eb)
  - Success color: Green (#10b981)
  - Danger color: Red (#ef4444)
  - Backgrounds and text colors
- Navigation bar styling
- Common utilities (buttons, animations)
- Responsive breakpoints

#### **index.js**
- React DOM rendering
- Mounts App component to #root
- No changes needed

#### **index.css** ✨ [UPDATED]
- Global page styles
- Typography setup
- Body and html element sizing
- Scrollbar styling

### Documentation Files

#### **STOCK_PORTFOLIO_README.md** ✨ [NEW]
- Comprehensive documentation (800+ lines)
- Complete feature list
- Installation instructions
- Usage guide for each feature
- Stock list with sectors
- Technology stack details
- File structure
- Key functions reference
- Future enhancements
- Security notes

#### **QUICK_START.md** ✨ [NEW]
- Quick setup guide
- Step-by-step startup instructions
- Features overview
- Usage examples
- Troubleshooting tips
- Project structure summary
- Learning resources

## 🎯 Key Features Implementation

### Feature 1: Portfolio Management
- **Files**: PortfolioDashboard.js, StockContext.js
- **How it works**: Add/remove stocks, track holdings, calculate returns

### Feature 2: Stock Search & Browse
- **Files**: StockSearch.js, stockApi.js
- **How it works**: Search functionality, stock cards, add to portfolio

### Feature 3: Detailed Analysis
- **Files**: StockDetails.js, Recharts
- **How it works**: Charts, holdings data, edit options

### Feature 4: Portfolio Analytics
- **Files**: PortfolioAnalytics.js, recharts
- **How it works**: Multiple chart types, sector distribution, performance metrics

### Feature 5: Live Price Tracking
- **Files**: LivePriceTracker.js, stockApi.js
- **How it works**: Simulated real-time updates, configurable intervals, live ticker

### Feature 6: Watchlist
- **Files**: Watchlist.js, StockContext.js
- **How it works**: Add/remove stocks, monitor prices, quick buy

## 📊 Data Files

### Stock Data (in stockApi.js)
```javascript
- indianStocks[] // Array of 12 stocks with details
  - Each stock has: symbol, name, sector, price, change, high, low, volume
- generateHistoricalData() // 30-day price history
- simulatePriceUpdate() // Real-time price simulation
```

## 🎨 CSS Architecture

### Global Theme (App.css)
- CSS Variables for consistent colors
- Responsive breakpoints
- Animation definitions
- Common button/card styles

### Component Styles
- Each component has dedicated CSS file
- Mobile-first approach
- Media queries for responsiveness
- Consistent spacing using CSS variables

## 🔄 Data Flow

```
User Interaction
    ↓
Component (e.g., PortfolioDashboard)
    ↓
StockContext (State Management)
    ↓
localStorage (Data Persistence)
```

## 📦 Dependencies Used

| Package | Version | Purpose |
|---------|---------|---------|
| react | 19.2.4 | Core framework |
| react-dom | 19.2.4 | DOM rendering |
| react-scripts | 5.0.1 | Build tools |
| recharts | 2.10.0 | Charts/graphs |
| axios | 1.6.0 | API calls |
| react-icons | 4.12.0 | Icon library |
| date-fns | 2.30.0 | Date utilities |

## 🚀 Getting Started

1. **Install**: `npm install` (installs all new dependencies)
2. **Start**: `npm start` (opens at localhost:3000)
3. **Build**: `npm run build` (production build)

## 💡 Key Concepts Used

- **React Context API**: Global state, no prop drilling
- **useEffect Hook**: Component lifecycle, side effects
- **useState Hook**: Local component state
- **localStorage API**: Client-side persistence
- **React Router Concept**: Tab-based navigation
- **Responsive Design**: CSS Grid/Flexbox media queries
- **Component Composition**: Reusable UI components

## 🎓 Learning Outcomes

This project demonstrates:
- Modern React patterns and hooks
- State management with Context API
- Component-based architecture
- CSS responsive design
- Data visualization with Recharts
- localStorage for persistence
- Professional UI/UX design

## ✅ Completeness Checklist

- ✅ 6 main functional pages
- ✅ Portfolio management system
- ✅ Real-time price tracking (simulated)
- ✅ Advanced analytics and charts
- ✅ Data persistence
- ✅ Responsive mobile design
- ✅ 12 Indian stocks database
- ✅ Comprehensive documentation

---

**Total Files Created/Modified**: 20+
**Lines of Code**: 3,000+
**Components**: 6
**Styling Files**: 7
**Documentation**: 2 guides

🎉 **Project Ready for Development!**
