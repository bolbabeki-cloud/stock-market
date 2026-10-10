import axios from 'axios';
import { getQuotes } from './stockApi';

jest.mock('axios');

describe('getQuotes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('accepts a direct array payload from the live market API', async () => {
    axios.post.mockResolvedValueOnce({ data: [{ symbol: 'TCS', price: 3500 }, { symbol: 'INFY', price: 1500 }] });

    const quotes = await getQuotes([{ symbol: 'TCS' }, { symbol: 'INFY' }]);

    expect(quotes).toEqual([
      { symbol: 'TCS', price: 3500 },
      { symbol: 'INFY', price: 1500 },
    ]);
  });

  it('accepts a wrapped { data: [...] } payload from the live market API', async () => {
    axios.post.mockResolvedValueOnce({ data: { data: [{ symbol: 'RELIANCE', price: 2800 }] } });

    const quotes = await getQuotes([{ symbol: 'RELIANCE' }]);

    expect(quotes).toEqual([
      { symbol: 'RELIANCE', price: 2800 },
    ]);
  });
});
