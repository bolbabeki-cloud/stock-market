const getApiBaseUrl = () => {
  const configured = process.env.REACT_APP_API_BASE_URL || '';
  if (configured) return configured.replace(/\/$/, '');

  const hostname = typeof window === 'undefined' ? '' : window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') return 'http://localhost:3001';
  // Firebase Hosting is static on the Spark plan, so use the Render backend
  // directly for auth requests too.
  return 'https://stock-portfolio-pro.onrender.com';
};

const request = async (path, options) => {
  const baseUrl = getApiBaseUrl();
  let response;
  try {
    response = await fetch(`${baseUrl}/api/auth${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('Cannot access the stock API. Check your connection and try again.');
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Authentication request failed');
  return payload;
};

export const loginUser = (email, password) => request('/login', {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});

export const signupUser = (email, password, name, country) => request('/signup', {
  method: 'POST',
  body: JSON.stringify({ email, password, name, country }),
});

export const updateUser = (id, updates) => request(`/${id}`, {
  method: 'PATCH',
  body: JSON.stringify(updates),
});
