// Mock assets for initial portfolio
export const mockAssets = [
  {
    id: '1',
    name: 'Apple Inc.',
    symbol: 'AAPL',
    type: 'stock',
    quantity: 10,
    purchasePrice: 150.75,
    currentPrice: 167.53,
    purchaseDate: '2023-01-15',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg'
  },
  {
    id: '2',
    name: 'Tesla, Inc.',
    symbol: 'TSLA',
    type: 'stock',
    quantity: 5,
    purchasePrice: 290.38,
    currentPrice: 225.71,
    purchaseDate: '2022-11-20',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png'
  },
  {
    id: '3',
    name: 'Bitcoin',
    symbol: 'BTC',
    type: 'crypto',
    quantity: 0.5,
    purchasePrice: 35600,
    currentPrice: 61892,
    purchaseDate: '2023-03-10',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg'
  },
  {
    id: '4',
    name: 'Ethereum',
    symbol: 'ETH',
    type: 'crypto',
    quantity: 3.2,
    purchasePrice: 1856.23,
    currentPrice: 2453.78,
    purchaseDate: '2023-02-05',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg'
  },
  {
    id: '5',
    name: 'Vanguard S&P 500 ETF',
    symbol: 'VOO',
    type: 'etf',
    quantity: 12,
    purchasePrice: 380.12,
    currentPrice: 405.37,
    purchaseDate: '2022-08-18',
    logoUrl: 'https://s3.amazonaws.com/logos.etflogic.io/9794.png'
  }
];

// Mock historical data for assets
export const mockHistoricalData = {
  'AAPL': {
    '1W': generateHistoricalData(7, 165, 170),
    '1M': generateHistoricalData(30, 150, 170),
    '3M': generateHistoricalData(90, 145, 175),
    '1Y': generateHistoricalData(365, 130, 180),
    'ALL': generateHistoricalData(1095, 100, 180)
  },
  'TSLA': {
    '1W': generateHistoricalData(7, 220, 230),
    '1M': generateHistoricalData(30, 210, 240),
    '3M': generateHistoricalData(90, 200, 250),
    '1Y': generateHistoricalData(365, 180, 300),
    'ALL': generateHistoricalData(1095, 150, 350)
  },
  'BTC': {
    '1W': generateHistoricalData(7, 60000, 63000),
    '1M': generateHistoricalData(30, 55000, 63000),
    '3M': generateHistoricalData(90, 45000, 65000),
    '1Y': generateHistoricalData(365, 35000, 65000),
    'ALL': generateHistoricalData(1095, 20000, 65000)
  },
  'ETH': {
    '1W': generateHistoricalData(7, 2400, 2500),
    '1M': generateHistoricalData(30, 2200, 2500),
    '3M': generateHistoricalData(90, 2000, 2600),
    '1Y': generateHistoricalData(365, 1800, 2600),
    'ALL': generateHistoricalData(1095, 1000, 2600)
  },
  'VOO': {
    '1W': generateHistoricalData(7, 400, 410),
    '1M': generateHistoricalData(30, 390, 410),
    '3M': generateHistoricalData(90, 380, 410),
    '1Y': generateHistoricalData(365, 360, 410),
    'ALL': generateHistoricalData(1095, 300, 410)
  },
  'default': {
    '1W': generateHistoricalData(7, 90, 110),
    '1M': generateHistoricalData(30, 80, 120),
    '3M': generateHistoricalData(90, 70, 130),
    '1Y': generateHistoricalData(365, 60, 140),
    'ALL': generateHistoricalData(1095, 50, 150)
  }
};

// Function to generate mock historical price data
function generateHistoricalData(days, minPrice, maxPrice) {
  const today = new Date();
  const data = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - (days - i));
    
    // Create some random price movement with a slight upward trend
    const randomFactor = 0.8 + Math.random() * 0.4; // Between 0.8 and 1.2
    const trendFactor = 1 + ((i / days) * 0.2); // Slight upward trend
    
    // Calculate price with some randomness while staying within min-max range
    const range = maxPrice - minPrice;
    const midPoint = minPrice + (range / 2);
    const volatility = range / 4;
    
    const price = (
      midPoint + (volatility * (Math.random() * 2 - 1) * randomFactor * trendFactor)
    ).toFixed(2);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price)
    });
  }
  
  return data;
}

// Mock news data
export const mockNewsData = [
  {
    id: '1',
    title: 'Tech Stocks Rally as Inflation Fears Ease',
    source: 'Financial Times',
    date: '2023-06-28',
    url: '#',
    snippet: 'Technology stocks led a broad market rally on Wednesday as investors welcomed signs that inflation pressures might be easing.'
  },
  {
    id: '2',
    title: 'Bitcoin Surges Past $60,000 on ETF Approval Speculation',
    source: 'CoinDesk',
    date: '2023-06-27',
    url: '#',
    snippet: 'Bitcoin prices jumped above $60,000 for the first time in over a year amid growing speculation that regulators might approve a spot Bitcoin ETF.'
  },
  {
    id: '3',
    title: 'Fed Signals Potential Rate Cut in September',
    source: 'Wall Street Journal',
    date: '2023-06-26',
    url: '#',
    snippet: 'Federal Reserve officials signaled they could begin cutting interest rates as soon as September if inflation continues to cool.'
  },
  {
    id: '4',
    title: 'Quarterly Earnings Beat Expectations for Major Tech Companies',
    source: 'Bloomberg',
    date: '2023-06-25',
    url: '#',
    snippet: 'Major technology companies reported better-than-expected earnings for the second quarter, boosting investor confidence in the sector.'
  }
];

// Asset types
export const assetTypes = [
  { id: 'stock', name: 'Stocks', color: '#3366FF' },
  { id: 'crypto', name: 'Cryptocurrencies', color: '#8C52FF' },
  { id: 'etf', name: 'ETFs', color: '#36D399' },
  { id: 'bond', name: 'Bonds', color: '#FFBD49' },
  { id: 'forex', name: 'Forex', color: '#FF5724' },
  { id: 'commodity', name: 'Commodities', color: '#6B7280' }
];

// Market indices for comparison
export const marketIndices = [
  { id: 'SP500', name: 'S&P 500', symbol: 'SPX' },
  { id: 'NASDAQ', name: 'NASDAQ Composite', symbol: 'IXIC' },
  { id: 'DOW', name: 'Dow Jones Industrial Average', symbol: 'DJI' },
  { id: 'BTCUSD', name: 'Bitcoin USD', symbol: 'BTCUSD' }
];