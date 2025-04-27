import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { FiX } from 'react-icons/fi';

import Sidebar from '../components/Layout/Sidebar';
import { usePortfolio } from '../contexts/PortfolioContext';
import { assetTypes, marketIndices } from '../data/mockData';
import { formatCurrency } from '../utils/formatters';
import ChatBotToggle from '../components/chatbot';

export default function ComparisonTool() {
  const { assets, getAssetHistoricalData } = usePortfolio();
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [timeframe, setTimeframe] = useState('1M');
  const [chartData, setChartData] = useState(null);
  const [availableAssets, setAvailableAssets] = useState([]);
  
  // Timeframe options
  const timeframeOptions = [
    { value: '1W', label: '1W' },
    { value: '1M', label: '1M' },
    { value: '3M', label: '3M' },
    { value: '1Y', label: '1Y' },
    { value: 'ALL', label: 'All' },
  ];

  // Set up available assets for comparison
  useEffect(() => {
    const userAssets = assets.map(asset => ({
      id: asset.id,
      name: asset.name,
      symbol: asset.symbol,
      type: asset.type,
      logoUrl: asset.logoUrl,
      isUserAsset: true
    }));
    
    const indices = marketIndices.map(index => ({
      id: index.id,
      name: index.name,
      symbol: index.symbol,
      type: 'index',
      logoUrl: `https://ui-avatars.com/api/?name=${index.symbol}&background=random&color=fff`,
      isUserAsset: false
    }));
    
    setAvailableAssets([...userAssets, ...indices]);
  }, [assets]);

  // Update chart when selected assets or timeframe changes
  useEffect(() => {
    if (selectedAssets.length === 0) return;
    
    const datasets = [];
    const colors = ['#3366FF', '#8C52FF', '#36D399', '#FFBD49', '#FF5724', '#6B7280'];
    
    // Get data for each selected asset
    selectedAssets.forEach((assetId, index) => {
      const asset = availableAssets.find(a => a.id === assetId);
      if (!asset) return;
      
      let historicalData;
      
      if (asset.isUserAsset) {
        historicalData = getAssetHistoricalData(asset.id, timeframe);
      } else {
        // For market indices, use default data (in a real app, this would be fetched from an API)
        historicalData = getAssetHistoricalData('default', timeframe);
      }
      
      if (!historicalData) return;
      
      // Add to datasets
      datasets.push({
        label: `${asset.name} (${asset.symbol})`,
        data: historicalData.map(item => item.price),
        borderColor: colors[index % colors.length],
        backgroundColor: `${colors[index % colors.length]}20`,
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
      });
    });
    
    // If we have data, update the chart
    if (datasets.length > 0) {
      const firstAssetData = getAssetHistoricalData(
        availableAssets.find(a => a.id === selectedAssets[0])?.isUserAsset 
          ? selectedAssets[0] 
          : 'default', 
        timeframe
      );
      
      setChartData({
        labels: firstAssetData.map(item => item.date),
        datasets
      });
    }
  }, [selectedAssets, timeframe, availableAssets, getAssetHistoricalData]);

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12
          },
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          maxTicksLimit: 8,
          font: {
            size: 10,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          padding: 10,
          callback: function(value) {
            return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
          },
          font: {
            size: 10,
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  const handleAssetSelect = (e) => {
    const assetId = e.target.value;
    if (assetId && !selectedAssets.includes(assetId)) {
      setSelectedAssets(prev => [...prev, assetId]);
    }
    e.target.value = ''; // Reset select
  };
  
  const removeAsset = (assetId) => {
    setSelectedAssets(prev => prev.filter(id => id !== assetId));
  };

  // Group assets by type for the dropdown
  const groupedAssets = {};
  availableAssets.forEach(asset => {
    // Skip already selected assets
    if (selectedAssets.includes(asset.id)) return;
    
    const type = asset.type;
    if (!groupedAssets[type]) {
      groupedAssets[type] = [];
    }
    groupedAssets[type].push(asset);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Sidebar />
      
      <div className="lg:ml-60 p-4 md:p-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">Asset Comparison Tool</h1>
          <p className="text-gray-400">Compare performance across different assets and market indices</p>
        </motion.div>
        
        {/* Comparison Controls */}
        <motion.div 
          className="glass-card p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Add Assets to Compare
              </label>
              <select 
                className="glass-input w-full bg-gray-700"
                onChange={handleAssetSelect}
                disabled={selectedAssets.length >= 5}
              >
                <option value="">Select an asset...</option>
                
                {Object.keys(groupedAssets).map(type => {
                  const assetType = type === 'index' 
                    ? { name: 'Market Indices' } 
                    : assetTypes.find(t => t.id === type);
                    
                  return (
                    <optgroup key={type} label={assetType?.name || type}>
                      {groupedAssets[type].map(asset => (
                        <option key={asset.id} value={asset.id}>
                          {asset.name} ({asset.symbol})
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
              
              {selectedAssets.length >= 5 && (
                <p className="text-xs text-warning-500 mt-1">
                  Maximum of 5 assets for comparison
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Timeframe
              </label>
              <div className="flex space-x-1 bg-white bg-opacity-5 rounded-lg p-1">
                {timeframeOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`px-3 py-1 text-sm rounded-md transition-all duration-200 ${
                      timeframe === option.value 
                        ? 'bg-primary-500 text-white' 
                        : 'text-gray-300 hover:bg-white hover:bg-opacity-10'
                    }`}
                    onClick={() => setTimeframe(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Selected Assets */}
          {selectedAssets.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedAssets.map(assetId => {
                const asset = availableAssets.find(a => a.id === assetId);
                if (!asset) return null;
                
                return (
                  <div 
                    key={asset.id}
                    className="flex items-center bg-white bg-opacity-10 rounded-full px-3 py-1"
                  >
                    <img 
                      src={asset.logoUrl} 
                      alt={asset.name} 
                      className="w-5 h-5 rounded-full mr-2"
                    />
                    <span className="text-sm">{asset.symbol}</span>
                    <button
                      onClick={() => removeAsset(asset.id)}
                      className="ml-2 p-1 rounded-full hover:bg-white hover:bg-opacity-10"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
        
        <ChatBotToggle />
        {/* Comparison Chart */}
        <motion.div 
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {selectedAssets.length > 0 && chartData ? (
            <div className="h-[500px] w-full">
              <Line data={chartData} options={chartOptions} />
            </div>
          ) : (
            <div className="h-[500px] flex flex-col items-center justify-center text-center">
              <p className="text-gray-400 mb-4">
                Select at least one asset to start comparing
              </p>
              <p className="text-sm text-gray-500">
                You can compare your portfolio assets against each other or against market indices
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}