import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { FiEdit2, FiTrash2, FiArrowLeft } from 'react-icons/fi';

import Sidebar from '../components/Layout/Sidebar';
import AssetForm from '../components/Assets/AssetForm';
import { usePortfolio } from '../contexts/PortfolioContext';
import { formatCurrency, formatPercentage } from '../utils/formatters';

export default function AssetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { assets, getAssetHistoricalData, removeAsset } = usePortfolio();
  
  const [asset, setAsset] = useState(null);
  const [timeframe, setTimeframe] = useState('1M');
  const [chartData, setChartData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Timeframe options
  const timeframeOptions = [
    { value: '1W', label: '1W' },
    { value: '1M', label: '1M' },
    { value: '3M', label: '3M' },
    { value: '1Y', label: '1Y' },
    { value: 'ALL', label: 'All' },
  ];

  // Find the asset
  useEffect(() => {
    const foundAsset = assets.find(a => a.id === id);
    if (foundAsset) {
      setAsset(foundAsset);
    } else {
      // Asset not found, redirect back to portfolio
      navigate('/portfolio');
    }
  }, [id, assets, navigate]);

  // Load chart data
  useEffect(() => {
    if (!asset) return;
    
    const historicalData = getAssetHistoricalData(asset.id, timeframe);
    if (!historicalData) return;
    
    const dates = historicalData.map(item => item.date);
    const prices = historicalData.map(item => item.price);
    
    setChartData({
      labels: dates,
      datasets: [
        {
          label: asset.symbol,
          data: prices,
          borderColor: '#3366FF',
          backgroundColor: 'rgba(51, 102, 255, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
        }
      ]
    });
  }, [asset, timeframe, getAssetHistoricalData]);

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
        beginAtZero: false,
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    hover: {
      mode: 'nearest',
      intersect: false
    }
  };

  const handleDeleteAsset = () => {
    removeAsset(asset.id);
    navigate('/portfolio');
  };

  if (!asset) return null;

  // Calculate performance metrics
  const currentValue = asset.currentPrice * asset.quantity;
  const costBasis = asset.purchasePrice * asset.quantity;
  const profit = currentValue - costBasis;
  const profitPercentage = ((asset.currentPrice - asset.purchasePrice) / asset.purchasePrice) * 100;
  const isPositive = profit >= 0;
  const purchaseDate = new Date(asset.purchaseDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Sidebar />
      
      <div className="lg:ml-60 p-4 md:p-8">
        {/* Back button */}
        <motion.button
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
          onClick={() => navigate('/portfolio')}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FiArrowLeft className="mr-2" />
          Back to Portfolio
        </motion.button>
        
        {/* Asset Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <img 
              src={asset.logoUrl} 
              alt={asset.name} 
              className="w-12 h-12 rounded-full mr-4"
            />
            
            <div>
              <h1 className="text-3xl font-bold">{asset.name}</h1>
              <div className="flex items-center mt-1">
                <span className="text-lg text-gray-300 mr-3">{asset.symbol}</span>
                <span className={`text-sm px-2 py-0.5 rounded ${
                  asset.type === 'stock' ? 'bg-primary-500 bg-opacity-20 text-primary-300' :
                  asset.type === 'crypto' ? 'bg-secondary-500 bg-opacity-20 text-secondary-300' :
                  asset.type === 'etf' ? 'bg-accent-500 bg-opacity-20 text-accent-300' :
                  'bg-gray-500 bg-opacity-20 text-gray-300'
                }`}>
                  {asset.type.toUpperCase()}
                </span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="flex space-x-3 mt-4 md:mt-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <button 
              onClick={() => setShowEditModal(true)}
              className="btn-secondary flex items-center"
            >
              <FiEdit2 className="mr-2" />
              Edit
            </button>
            
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="btn-ghost flex items-center text-error-500 border-error-500 border-opacity-30 hover:bg-error-500 hover:bg-opacity-10"
            >
              <FiTrash2 className="mr-2" />
              Delete
            </button>
          </motion.div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart - 2 columns */}
          <motion.div 
            className="glass-card p-6 lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold">{asset.symbol} Price</h2>
                <div className="flex items-center mt-1">
                  <span className="text-2xl font-bold">{formatCurrency(asset.currentPrice)}</span>
                  <span className={`ml-2 text-sm ${isPositive ? 'text-accent-500' : 'text-error-500'}`}>
                    {isPositive ? '+' : ''}{formatPercentage(profitPercentage)}
                  </span>
                </div>
              </div>
              
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
            
            <div className="h-[300px] w-full">
              {chartData && <Line data={chartData} options={chartOptions} />}
            </div>
          </motion.div>
          
          {/* Investment Details - 1 column */}
          <motion.div 
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-6">Investment Details</h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">Current Value</p>
                <p className="text-2xl font-bold">{formatCurrency(currentValue)}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Quantity</p>
                  <p className="text-lg font-medium">{asset.quantity.toLocaleString('en-US')}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-1">Cost Basis</p>
                  <p className="text-lg font-medium">{formatCurrency(costBasis)}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white border-opacity-10">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-gray-400">Profit/Loss</p>
                  <p className={`text-sm ${isPositive ? 'text-accent-500' : 'text-error-500'}`}>
                    {isPositive ? '+' : ''}{formatPercentage(profitPercentage)}
                  </p>
                </div>
                <p className={`text-xl font-bold ${isPositive ? 'text-accent-500' : 'text-error-500'}`}>
                  {isPositive ? '+' : ''}{formatCurrency(profit)}
                </p>
              </div>
              
              <div className="pt-4 border-t border-white border-opacity-10">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Purchase Details</p>
                  <div className="flex justify-between">
                    <p className="text-sm">Price</p>
                    <p className="text-sm font-medium">{formatCurrency(asset.purchasePrice)}</p>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-sm">Date</p>
                    <p className="text-sm font-medium">{purchaseDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Edit Asset Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
          >
            <AssetForm 
              initialAsset={asset}
              onClose={() => setShowEditModal(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
          >
            <motion.div 
              className="glass-card p-6 max-w-md mx-auto rounded-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
              <p className="mb-6">
                Are you sure you want to delete <strong>{asset.name} ({asset.symbol})</strong> from your portfolio? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button 
                  className="btn-ghost"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn-primary bg-error-500 hover:bg-error-600"
                  onClick={handleDeleteAsset}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}