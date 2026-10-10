const market = (country, exchange, currency, symbols) => symbols.map((symbol) => ({
  symbol, name: symbol, country, exchange, currency, sector: 'Common Stock', price: 0,
  change: 0, high: 0, low: 0, volume: 0,
}));

export const GLOBAL_100 = [
  ...market('United States', 'NASDAQ', 'USD', ['AAPL','MSFT','NVDA','AMZN','GOOGL','META','TSLA','AVGO','COST','NFLX','AMD','ADBE','CSCO','PEP','INTC','QCOM','AMGN','TXN','INTU','BKNG']),
  ...market('United Kingdom', 'LSE', 'GBP', ['SHEL','AZN','HSBA','ULVR','BP','GSK','RIO','REL','DGE','LSEG']),
  ...market('Canada', 'TSX', 'CAD', ['RY','TD','SHOP','ENB','CNR','CP','BMO','BNS','TRP','CNQ']),
  ...market('Australia', 'ASX', 'AUD', ['BHP','CBA','CSL','NAB','WBC','ANZ','WES','MQG','TLS','WOW']),
  ...market('Germany', 'XETR', 'EUR', ['SAP','SIE','DTE','ALV','AIR','MBG','BMW','BAS','IFX','ADS']),
  ...market('France', 'PARIS', 'EUR', ['MC','OR','TTE','SAN','AIR','SU','BNP','AI','CS','DG']),
  ...market('Japan', 'TSE', 'JPY', ['7203','6758','9984','8306','6861','6501','8035','6098','9432','4063']),
  ...market('Singapore', 'SGX', 'SGD', ['D05','O39','U11','Z74','C6L','S68','A17U','C38U','BN4','F34']),
  ...market('South Korea', 'KOSPI', 'KRW', ['005930','000660','373220','207940','005380','000270','068270','105560','035420','055550']),
  ...market('Brazil', 'BOVESPA', 'BRL', ['PETR4','VALE3','ITUB4','BBAS3','ABEV3','BBDC4','WEGE3','RENT3','SUZB3','PRIO3']),
];

export const GLOBAL_MARKETS = ['All Markets', ...new Set(GLOBAL_100.map((stock) => stock.country))];
