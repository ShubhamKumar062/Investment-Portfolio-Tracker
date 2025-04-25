import { v4 as uuidv4 } from 'uuid';

// Mock portfolio data
export const mockPortfolioData = {
  totalValue: 125750.42,
  dailyChange: 2345.67,
  percentChange: 1.89,
  profitLoss: 15380.22,
  
  // Mock assets
  assets: [
    {
      id: uuidv4(),
      name: 'Apple Inc.',
      symbol: 'AAPL',
      type: 'Stocks',
      price: 187.68,
      quantity: 150,
      value: 28152.00,
      change24h: 1.56
    },
    {
      id: uuidv4(),
      name: 'Microsoft Corporation',
      symbol: 'MSFT',
      type: 'Stocks',
      price: 402.75,
      quantity: 45,
      value: 18123.75,
      change24h: 0.78
    },
    {
      id: uuidv4(),
      name: 'Bitcoin',
      symbol: 'BTC',
      type: 'Crypto',
      price: 64350.25,
      quantity: 0.75,
      value: 48262.69,
      change24h: 2.34
    },
    {
      id: uuidv4(),
      name: 'Ethereum',
      symbol: 'ETH',
      type: 'Crypto',
      price: 3458.90,
      quantity: 3.5,
      value: 12106.15,
      change24h: 3.45
    },
    {
      id: uuidv4(),
      name: 'US Treasury Bond',
      symbol: 'USTB',
      type: 'Bonds',
      price: 100.5,
      quantity: 50,
      value: 5025.00,
      change24h: 0.15
    },
    {
      id: uuidv4(),
      name: 'REIT Fund',
      symbol: 'VNQ',
      type: 'Real Estate',
      price: 89.45,
      quantity: 75,
      value: 6708.75,
      change24h: -0.45
    },
    {
      id: uuidv4(),
      name: 'Gold',
      symbol: 'GLD',
      type: 'Commodities',
      price: 184.50,
      quantity: 25,
      value: 4612.50,
      change24h: -0.12
    },
    {
      id: uuidv4(),
      name: 'Cash Reserves',
      symbol: 'USD',
      type: 'Cash',
      price: 1.00,
      quantity: 2759.58,
      value: 2759.58,
      change24h: 0.00
    }
  ],
  
  // Mock performance history data (for portfolio chart)
  performanceHistory: generatePerformanceHistory()
};

// Function to generate mock historical performance data
function generatePerformanceHistory() {
  const history = [];
  const days = 365; // One year of data
  
  let value = 100000; // Starting value
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1); // Start from 1 year ago
  
  for (let i = 0; i < days; i++) {
    // Random daily change between -2% and +2%
    const change = (Math.random() * 4 - 2) / 100;
    value = value * (1 + change);
    
    // Add some seasonality
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const seasonalEffect = Math.sin(dayOfYear / 58) * 0.005; // Subtle seasonal effect
    value = value * (1 + seasonalEffect);
    
    // Add upward trend
    value = value * 1.0002;
    
    date.setDate(date.getDate() + 1);
    
    history.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * 100) / 100
    });
  }
  
  return history;
}