import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiInfo, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import AssetForm from './AssetForm';

export default function AssetList() {
  const { assets, removeAsset, loading } = usePortfolio();
  const [displayedAssets, setDisplayedAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('value-desc');
  const [editingAsset, setEditingAsset] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);

  useEffect(() => {
    if (loading) return;
    
    // Filter assets
    let filtered = [...assets];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        asset => asset.name.toLowerCase().includes(term) || 
                asset.symbol.toLowerCase().includes(term)
      );
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(asset => asset.type === filterType);
    }
    
    // Sort assets
    switch (sortBy) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'value-asc':
        filtered.sort((a, b) => 
          (a.currentPrice * a.quantity) - (b.currentPrice * b.quantity)
        );
        break;
      case 'value-desc':
        filtered.sort((a, b) => 
          (b.currentPrice * b.quantity) - (a.currentPrice * a.quantity)
        );
        break;
      case 'profit-asc':
        filtered.sort((a, b) => {
          const profitA = ((a.currentPrice - a.purchasePrice) / a.purchasePrice) * 100;
          const profitB = ((b.currentPrice - b.purchasePrice) / b.purchasePrice) * 100;
          return profitA - profitB;
        });
        break;
      case 'profit-desc':
        filtered.sort((a, b) => {
          const profitA = ((a.currentPrice - a.purchasePrice) / a.purchasePrice) * 100;
          const profitB = ((b.currentPrice - b.purchasePrice) / b.purchasePrice) * 100;
          return profitB - profitA;
        });
        break;
      default:
        break;
    }
    
    setDisplayedAssets(filtered);
  }, [assets, searchTerm, filterType, sortBy, loading]);

  const handleEdit = (asset) => {
    setEditingAsset(asset);
  };

  const handleDelete = (assetId) => {
    setShowConfirmDelete(assetId);
  };

  const confirmDelete = (assetId) => {
    removeAsset(assetId);
    setShowConfirmDelete(null);
  };

  return (
    <div className="glass-card p-6 w-full">
      <h2 className="text-2xl font-semibold mb-6">Your Investments</h2>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="glass-input pl-10 w-full"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-300 z-10" />
            </div>
            <select
              className="glass-input bg-gray-700 pl-10 "
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="stock">Stocks</option>
              <option value="crypto">Crypto</option>
              <option value="etf">ETFs</option>
              <option value="bond">Bonds</option>
              <option value="forex">Forex</option>
              <option value="commodity">Commodities</option>
            </select>
          </div>
          
          <select
            className="glass-input bg-gray-700"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="value-desc">Highest Value</option>
            <option value="value-asc">Lowest Value</option>
            <option value="profit-desc">Highest Profit</option>
            <option value="profit-asc">Lowest Profit</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>
        </div>
      </div>
      
      {/* Assets Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
        </div>
      ) : displayedAssets.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b border-white border-opacity-10">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Asset</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Price</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Holdings</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Value</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Profit/Loss</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {displayedAssets.map((asset) => {
                  const value = asset.currentPrice * asset.quantity;
                  const cost = asset.purchasePrice * asset.quantity;
                  const profit = value - cost;
                  const profitPercentage = ((asset.currentPrice - asset.purchasePrice) / asset.purchasePrice) * 100;
                  const isPositive = profit >= 0;
                  
                  return (
                    <motion.tr 
                      key={asset.id}
                      className="border-b border-white border-opacity-5 hover:bg-white hover:bg-opacity-5 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <img 
                            src={asset.logoUrl} 
                            alt={asset.name} 
                            className="w-8 h-8 rounded-full mr-3"
                          />
                          <div>
                            <div className="font-medium">{asset.name}</div>
                            <div className="text-xs text-gray-400">{asset.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="font-medium">{formatCurrency(asset.currentPrice)}</div>
                        <div className={`text-xs ${isPositive ? 'text-accent-500' : 'text-error-500'}`}>
                          {isPositive ? '+' : ''}
                          {formatPercentage(profitPercentage)}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div>{asset.quantity.toLocaleString('en-US')}</div>
                        <div className="text-xs text-gray-400">
                          Avg. {formatCurrency(asset.purchasePrice)}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right font-medium">
                        {formatCurrency(value)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className={`font-medium ${isPositive ? 'text-accent-500' : 'text-error-500'}`}>
                          {formatCurrency(profit)}
                        </div>
                        <div className={`text-xs ${isPositive ? 'text-accent-500' : 'text-error-500'}`}>
                          {isPositive ? '+' : ''}{formatPercentage(profitPercentage)}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link 
                            to={`/asset/${asset.id}`}
                            className="p-2 rounded-full hover:bg-white hover:bg-opacity-10 text-white transition-colors"
                            title="View Details"
                          >
                            <FiInfo size={16} />
                          </Link>
                          <button 
                            onClick={() => handleEdit(asset)}
                            className="p-2 rounded-full hover:bg-white hover:bg-opacity-10 text-white transition-colors"
                            title="Edit Asset"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(asset.id)}
                            className="p-2 rounded-full hover:bg-white hover:bg-opacity-10 text-error-500 transition-colors"
                            title="Delete Asset"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No assets found matching your criteria</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
              setSortBy('value-desc');
            }}
            className="btn-primary"
          >
            Clear Filters
          </button>
        </div>
      )}
      
      {/* Edit Asset Modal */}
      <AnimatePresence>
        {editingAsset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
          >
            <AssetForm 
              initialAsset={editingAsset} 
              onClose={() => setEditingAsset(null)} 
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showConfirmDelete && (
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
                Are you sure you want to delete this asset? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button 
                  className="btn-ghost"
                  onClick={() => setShowConfirmDelete(null)}
                >
                  Cancel
                </button>
                <button 
                  className="btn-primary bg-error-500 hover:bg-error-600"
                  onClick={() => confirmDelete(showConfirmDelete)}
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