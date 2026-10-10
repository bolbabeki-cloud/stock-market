# Stock Portfolio Pro - Frontend

React-based frontend application for comprehensive stock portfolio management with real-time tracking and analytics.

## Live stock-market data

The app reads current and historical market data from Twelve Data. Create a
`.env.local` file in this directory, add the value below, and restart the app:

```text
REACT_APP_TWELVE_DATA_API_KEY=your_twelve_data_api_key
```

Get a key from https://twelvedata.com. Search uses `/symbol_search`, current
prices use `/quote`, and 30-day history uses `/time_series`. Your plan determines
exchange coverage, price delay, and request limits. In production, proxy these
requests through a backend so the key is not exposed in browser JavaScript.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Backend API running (see backend README)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The application will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 📱 Features

### User Authentication
- Login/Signup with email and password
- JWT token-based authentication
- User profile management
- Demo account available

### Portfolio Management
- Add stocks to portfolio with custom quantity and price
- Remove stocks from portfolio
- Real-time portfolio valuation
- Gain/loss tracking

### Stock Markets
- **Indian Stocks**: 12 NSE/BSE stocks (₹ INR)
- **International Stocks**: 50+ stocks from 15+ countries ($ USD)
- Real-time price updates
- Country-based filtering

### Analytics & Charts
- Portfolio performance visualization
- Sector distribution charts
- Price trend analysis
- Interactive Recharts integration

### Watchlist
- Save stocks for monitoring
- Quick add to portfolio
- Price change notifications

### Live Tracking
- Real-time price updates
- Configurable refresh intervals
- Multiple stock monitoring

## 🏗️ Project Structure

```
src/
├── components/              # React components
│   ├── Dashboard.js         # Portfolio overview
│   ├── StockSearch.js       # Indian stock search
│   ├── InternationalStocks.js # Global stock browser
│   ├── Login.js             # Authentication UI
│   ├── PortfolioAnalytics.js # Charts & analytics
│   ├── Watchlist.js         # Saved stocks
│   └── LivePriceTracker.js  # Real-time tracking
├── context/                 # React Context
│   ├── StockContext.js      # Portfolio state
│   └── AuthContext.js       # Authentication state
├── services/                # API services
│   └── api.js               # Backend API client
├── styles/                  # Component styles
│   ├── App.css              # Global styles
│   ├── Login.css            # Auth styling
│   └── *.css                # Component styles
├── App.js                   # Main app component
├── index.js                 # React entry point
└── index.css                # Global CSS
```

## 🔧 Configuration

### Environment Variables

Create `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
# For production: https://your-backend-url.com/api
```

### Backend Connection

The frontend connects to the backend API at `http://localhost:5000/api` by default. Update the `REACT_APP_API_URL` environment variable to change this.

## 🎨 UI/UX Design

- **Modern Design**: Clean, professional interface
- **Responsive**: Works on desktop, tablet, and mobile
- **Color Scheme**: Blue/purple/green theme
- **Animations**: Smooth transitions and effects
- **Icons**: React Icons integration
- **Charts**: Recharts for data visualization

## 🧪 Testing

### Demo Account
- **Email**: `demo@stockportfolio.com`
- **Password**: `demo123`

### Manual Testing Checklist
- [ ] Login with demo credentials
- [ ] Create new account
- [ ] Add Indian stocks to portfolio
- [ ] Add international stocks to portfolio
- [ ] View portfolio analytics
- [ ] Add stocks to watchlist
- [ ] Test live price tracking
- [ ] Responsive design on mobile

## 🚀 Deployment

### Render

The repository root `render.yaml` configures the frontend build and backend
service. Set `MONGODB_URI` in the Render service environment to enable
registration, login, and profile updates.

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Manual Build
```bash
npm run build
# Deploy the 'build' folder to your web server
```

## 🔗 API Integration

The frontend communicates with the backend through RESTful API calls:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Portfolio
- `GET /api/portfolio` - Get portfolio & watchlist
- `POST /api/portfolio/add` - Add stock to portfolio
- `DELETE /api/portfolio/:symbol` - Remove from portfolio

### Watchlist
- `POST /api/watchlist/add` - Add to watchlist
- `DELETE /api/watchlist/:symbol` - Remove from watchlist

### Stocks
- `GET /api/stocks/quote/:symbol` - Get stock quote
- `GET /api/stocks/search?q=query` - Search stocks
- `GET /api/stocks/history/:symbol` - Get price history

## 🛠️ Development

### Available Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

### Code Style
- ESLint configuration included
- Prettier recommended for code formatting
- Component-based architecture
- Context API for state management

### Adding New Features

1. **Create Component**: Add new `.js` and `.css` files
2. **Update Routes**: Modify `App.js` for new pages
3. **Add API Calls**: Update `api.js` for new endpoints
4. **Update Context**: Modify context providers if needed

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

## 🐛 Troubleshooting

### Common Issues

**"Failed to fetch" errors:**
- Ensure backend is running on port 5000
- Check CORS configuration
- Verify API URL in environment variables

**Login not working:**
- Check backend server logs
- Verify JWT secret in backend
- Clear browser localStorage

**Charts not displaying:**
- Check Recharts installation
- Verify data format from API
- Check console for errors

## 📚 Related Documentation

- **[Main README](../README.md)** - Project overview
- **[Backend README](../stock-portfolio-backend/README.md)** - Backend API docs
- **[API Reference](../API_REFERENCE.md)** - Complete API documentation
- **[Features Guide](../FEATURES_V2.md)** - Feature overview

## 🤝 Contributing

1. Follow the existing code structure
2. Test changes on both desktop and mobile
3. Update documentation as needed
4. Ensure backend compatibility

---

**Stock Portfolio Pro Frontend v2.0** 🚀📈
