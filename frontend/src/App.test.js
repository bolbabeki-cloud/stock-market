import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { StockProvider, useStock } from './context/StockContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  jest.restoreAllMocks();
  localStorage.clear();
});
import UserProfile from './components/UserProfile';
import StockSearch from './components/StockSearch';
import App from './App';

function TestComponent() {
  const { portfolio, addToPortfolio, removeFromPortfolio } = useStock();

  return (
    <div>
      <button
        onClick={() =>
          addToPortfolio({
            symbol: 'TCS',
            name: 'Tata Consultancy Services',
            sector: 'IT',
            quantity: 2,
            price: 3500,
          })
        }
      >
        Add stock
      </button>
      <button onClick={() => removeFromPortfolio(portfolio[0]?.id)}>Remove stock</button>
      <div data-testid="count">{portfolio.length}</div>
      {portfolio[0] && <div data-testid="symbol">{portfolio[0].symbol}</div>}
    </div>
  );
}

test('removes a stock from portfolio', () => {
  render(
    <StockProvider>
      <TestComponent />
    </StockProvider>
  );

  fireEvent.click(screen.getByText('Add stock'));
  expect(screen.getByTestId('count').textContent).toBe('1');

  fireEvent.click(screen.getByText('Remove stock'));
  expect(screen.getByTestId('count').textContent).toBe('0');
});

test('renders the profile settings layout for the user', () => {
  localStorage.setItem(
    'currentUser',
    JSON.stringify({
      id: 1,
      email: 'demo@stockportfolio.com',
      name: 'Demo User',
      country: 'India',
    })
  );

  render(
    <AuthProvider>
      <UserProfile onNavigate={() => {}} />
    </AuthProvider>
  );

  expect(screen.getByText('Profile Settings')).toBeInTheDocument();
  expect(screen.getByText('Personal information')).toBeInTheDocument();
  expect(screen.getByText('Security')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Save Profile' })).toBeInTheDocument();
});

test('opens a demo payment modal when buying a stock', () => {
  render(
    <StockProvider>
      <StockSearch onNavigate={() => {}} />
    </StockProvider>
  );

  fireEvent.click(screen.getAllByRole('button', { name: /\+ Add to Portfolio/i })[0]);

  expect(screen.getByText('Confirm stock purchase')).toBeInTheDocument();
  expect(screen.getByText('Complete Demo Payment')).toBeInTheDocument();
});

test('shows a demo payment history page from the main nav', () => {
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem(
    'currentUser',
    JSON.stringify({
      id: 1,
      email: 'demo@stockportfolio.com',
      name: 'Demo User',
      country: 'India',
    })
  );

  render(
    <AuthProvider>
      <StockProvider>
        <App />
      </StockProvider>
    </AuthProvider>
  );

  fireEvent.click(screen.getByRole('button', { name: /Payments/i }));

  expect(screen.getByText('Demo Payment History')).toBeInTheDocument();
  expect(screen.getByText('No completed demo payments yet')).toBeInTheDocument();
});

test('stores and shows a completed demo payment in history', () => {
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem(
    'currentUser',
    JSON.stringify({
      id: 1,
      email: 'demo@stockportfolio.com',
      name: 'Demo User',
      country: 'India',
    })
  );
  localStorage.setItem('demoPaymentHistory_1', JSON.stringify([
    {
      id: 1,
      stock: 'RELIANCE',
      amount: 2850,
      method: 'Demo Wallet',
      createdAt: new Date().toISOString(),
    },
  ]));

  render(
    <AuthProvider>
      <StockProvider>
        <App />
      </StockProvider>
    </AuthProvider>
  );

  fireEvent.click(screen.getByRole('button', { name: /Payments/i }));

  expect(screen.getByText('RELIANCE')).toBeInTheDocument();
  expect(screen.getByText('Demo Wallet')).toBeInTheDocument();
});

test('keeps each user portfolio and watchlist isolated and starts empty for a new user', () => {
  localStorage.clear();

  const firstUser = { id: 'user-1', email: 'first@example.com', name: 'First User', country: 'India' };
  const secondUser = { id: 'user-2', email: 'second@example.com', name: 'Second User', country: 'India' };

  function UserStateProbe() {
    const { portfolio, watchlist, addToPortfolio, addToWatchlist } = useStock();
    return (
      <div>
        <button onClick={() => addToPortfolio({ symbol: 'TCS', name: 'TCS', quantity: 2, price: 3500, currency: 'INR' })}>
          Add portfolio stock
        </button>
        <button onClick={() => addToWatchlist({ symbol: 'INFY', name: 'Infosys', quantity: 0, price: 1500, currency: 'INR' })}>
          Add watchlist stock
        </button>
        <div data-testid="portfolio-count">{portfolio.length}</div>
        <div data-testid="watchlist-count">{watchlist.length}</div>
      </div>
    );
  }

  localStorage.setItem('currentUser', JSON.stringify(firstUser));
  const firstRender = render(
    <AuthProvider>
      <StockProvider>
        <UserStateProbe />
      </StockProvider>
    </AuthProvider>
  );

  fireEvent.click(firstRender.getByText('Add portfolio stock'));
  fireEvent.click(firstRender.getByText('Add watchlist stock'));

  expect(firstRender.getByTestId('portfolio-count').textContent).toBe('1');
  expect(firstRender.getByTestId('watchlist-count').textContent).toBe('1');

  firstRender.unmount();

  localStorage.setItem('currentUser', JSON.stringify(secondUser));
  localStorage.setItem('isLoggedIn', 'true');

  const secondRender = render(
    <AuthProvider>
      <StockProvider>
        <UserStateProbe />
      </StockProvider>
    </AuthProvider>
  );

  expect(secondRender.getByTestId('portfolio-count').textContent).toBe('0');
  expect(secondRender.getByTestId('watchlist-count').textContent).toBe('0');
});

test('shows the login error returned by the async auth call', async () => {
  const loginMock = jest.fn().mockResolvedValue({
    success: false,
    error: 'Invalid email or password',
  });

  jest.spyOn(require('./context/AuthContext'), 'useAuth').mockReturnValue({
    login: loginMock,
    signup: jest.fn(),
  });

  render(<Login />);
  fireEvent.click(screen.getByRole('button', { name: /^Login$/i }));

  await waitFor(() => {
    expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
  });
});

test('logs in the demo account even when the backend is unavailable', async () => {
  jest.spyOn(require('./services/authApi'), 'loginUser').mockRejectedValue(new Error('Network error'));

  function DemoLoginProbe() {
    const { login } = useAuth();
    const [status, setStatus] = React.useState('idle');

    React.useEffect(() => {
      login('demo@stockportfolio.com', 'demo123').then((result) => {
        setStatus(JSON.stringify(result));
      });
    }, [login]);

    return <div data-testid="login-status">{status}</div>;
  }

  render(
    <AuthProvider>
      <DemoLoginProbe />
    </AuthProvider>
  );

  await waitFor(() => {
    expect(screen.getByTestId('login-status').textContent).toContain('"success":true');
  });

  expect(JSON.parse(localStorage.getItem('currentUser'))).toMatchObject({
    email: 'demo@stockportfolio.com',
    name: 'Demo User',
  });
});
