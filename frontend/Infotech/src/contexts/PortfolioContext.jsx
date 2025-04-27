// PortfolioContext.js

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';  // Import the auth context to track user login state

// Create the context
const PortfolioContext = createContext(null);

// Custom hook to use the portfolio context
export function usePortfolio() {
  return useContext(PortfolioContext);
}

// Provider component
export function PortfolioProvider({ children }) {
  const { currentUser } = useAuth(); // Access the currentUser from AuthContext

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [portfolioChangePercent, setPortfolioChangePercent] = useState(0);
  const [portfolioChangeAmount, setPortfolioChangeAmount] = useState(0);

  // Fetch assets from API when user logs in
  const loadData = useCallback(async () => {
    if (!currentUser) {
      console.log("User is not logged in.");
      setAssets([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const token = currentUser.token;
      if (!token) {
        console.error('No token found');
        setAssets([]);
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:3777/api/user/getassets', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status) {
        console.log('Assets fetched from API');
        const fetchedAssets = response.data.data;
        setAssets(fetchedAssets);
        calculatePortfolioStats(fetchedAssets);
      } else {
        console.error('Failed to fetch assets:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Always fetch from API when component mounts or currentUser changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calculate portfolio statistics
  const calculatePortfolioStats = (assetList) => {
    const totalValue = assetList.reduce(
      (sum, asset) => sum + asset.currentPrice * asset.quantity,
      0
    );
    const totalInvested = assetList.reduce(
      (sum, asset) => sum + asset.purchasePrice * asset.quantity,
      0
    );
    const changeAmount = totalValue - totalInvested;
    const changePercent = totalInvested > 0 ? (changeAmount / totalInvested) * 100 : 0;

    setPortfolioValue(totalValue);
    setPortfolioChangeAmount(changeAmount);
    setPortfolioChangePercent(changePercent);
  };

  // Add a new asset
  const addAsset = async (newAsset) => {
    try {
      const token = currentUser.token;
      const response = await axios.post(
        'http://localhost:3777/api/user/addasset',
        newAsset,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status) {
        console.log('Asset added successfully');
        await loadData(); // reload after adding
      } else {
        console.error('Failed to add asset:', response.data.message);
      }
    } catch (error) {
      console.error('Error adding asset:', error);
    }
  };

  // Update an existing asset
  const updateAsset = async (updatedAsset) => {
    try {
      const token = currentUser.token;
      const response = await axios.put(
        `https://investment-backend.vercel.app/api/user/updateasset/${updatedAsset.id}`,
        updatedAsset,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status) {
        console.log('Asset updated successfully');
        await loadData(); // reload after updating
      } else {
        console.error('Failed to update asset:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating asset:', error);
    }
  };

  // Remove an asset
  const removeAsset = async (assetId) => {
    try {
      const token = currentUser.token;
      const response = await axios.delete(
        `https://investment-backend.vercel.app/api/user/deleteasset/${assetId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.data.status) {
        toast.success('Asset deleted successfully!'); // ✅ success toast
        await loadData(); // reload after deleting
      } else {
        toast.error(response.data.message || 'Failed to delete asset'); // ❌ error toast
        console.error('Failed to delete asset:', response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong while deleting'); // ❌ error toast
      console.error('Error deleting asset:', error);
    }
  };

  // Optional: Mock function for historical data (can be implemented later)
  const getAssetHistoricalData = (assetId, timeframe = '1M') => {
    return null; // Placeholder
  };

  // Calculate asset allocation based on asset type
  const getAssetAllocation = () => {
    const allocation = {};

    assets.forEach((asset) => {
      const value = asset.currentPrice * asset.quantity;
      allocation[asset.type] = (allocation[asset.type] || 0) + value;
    });

    return allocation;
  };

  // Clear portfolio (useful when user logs out)
  const clearPortfolio = () => {
    setAssets([]);
    setPortfolioValue(0);
    setPortfolioChangeAmount(0);
    setPortfolioChangePercent(0);
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
    getAssetAllocation,
    loadData,
    clearPortfolio,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}
