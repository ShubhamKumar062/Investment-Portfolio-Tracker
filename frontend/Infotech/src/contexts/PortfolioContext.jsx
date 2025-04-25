import { createContext, useContext, useState, useEffect } from 'react';
import { mockAssets, mockHistoricalData } from '../data/mockData';

const PortfolioContext = createContext(null);

export function usePortfolio() {
  return useContext(PortfolioContext);
}

export function PortfolioProvider({ children }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [portfolioChangePercent, setPortfolioChangePercent] = useState(0);
  const [portfolioChangeAmount, setPortfolioChangeAmount] = useState(0);
  
  // Load initial data
  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For this demo, we'll use mock data
    const loadData = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get data from localStorage or use mock data
        const savedAssets = localStorage.getItem('portfolio-assets');
        const initialAssets = savedAssets ? JSON.parse(savedAssets) : mockAssets;
        
        setAssets(initialAssets);
        calculatePortfolioStats(initialAssets);
      } catch (error) {
        console.error('Error loading portfolio data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Calculate portfolio statistics
  const calculatePortfolioStats = (assetList) => {
    const totalValue = assetList.reduce((sum, asset) => sum + (asset.currentPrice * asset.quantity), 0);
    const totalInvested = assetList.reduce((sum, asset) => sum + (asset.purchasePrice * asset.quantity), 0);
    const changeAmount = totalValue - totalInvested;
    const changePercent = totalInvested > 0 ? (changeAmount / totalInvested) * 100 : 0;
    
    setPortfolioValue(totalValue);
    setPortfolioChangeAmount(changeAmount);
    setPortfolioChangePercent(changePercent);
  };

  // Add a new asset
  const addAsset = (newAsset) => {
    const updatedAssets = [...assets, { ...newAsset, id: Date.now().toString() }];
    setAssets(updatedAssets);
    localStorage.setItem('portfolio-assets', JSON.stringify(updatedAssets));
    calculatePortfolioStats(updatedAssets);
    return updatedAssets;
  };

  // Update an existing asset
  const updateAsset = (updatedAsset) => {
    const updatedAssets = assets.map(asset => 
      asset.id === updatedAsset.id ? updatedAsset : asset
    );
    setAssets(updatedAssets);
    localStorage.setItem('portfolio-assets', JSON.stringify(updatedAssets));
    calculatePortfolioStats(updatedAssets);
    return updatedAssets;
  };

  // Remove an asset
  const removeAsset = (assetId) => {
    const updatedAssets = assets.filter(asset => asset.id !== assetId);
    setAssets(updatedAssets);
    localStorage.setItem('portfolio-assets', JSON.stringify(updatedAssets));
    calculatePortfolioStats(updatedAssets);
    return updatedAssets;
  };

  // Get historical data for an asset
  const getAssetHistoricalData = (assetId, timeframe = '1M') => {
    // In a real app, this would fetch data from an API
    // For this demo, we'll use mock data
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return null;
    
    // Return mock historical data for the specified asset and timeframe
    return mockHistoricalData[asset.symbol] ? 
      mockHistoricalData[asset.symbol][timeframe] : 
      mockHistoricalData.default[timeframe];
  };

  // Get asset allocation by type
  const getAssetAllocation = () => {
    const allocation = {};
    
    assets.forEach(asset => {
      const value = asset.currentPrice * asset.quantity;
      allocation[asset.type] = (allocation[asset.type] || 0) + value;
    });
    
    return allocation;
  };

  const value = {
    assets,
    loading,
    portfolioValue,
    portfolioChangePercent,
    portfolioChangeAmount,
    addAsset,
    updateAsset,
    removeAsset,
    getAssetHistoricalData,
    getAssetAllocation
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}