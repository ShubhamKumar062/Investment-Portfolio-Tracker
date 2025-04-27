import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

export default function TopAssets() {
  const { assets } = usePortfolio();
  
  const sortedAssets = useMemo(() => {
    // Sort assets by value (price * quantity)
    return [...assets]
      .sort((a, b) => (b.currentPrice * b.quantity) - (a.currentPrice * a.quantity))
      .slice(0, 5); // Get top 5
  }, [assets]);

  return (
    <motion.div 
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Top Assets</h2>
        <Link 
          to="/portfolio" 
          className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
        >
          View All
        </Link>
      </div>
      
      <div className="space-y-4">
        {sortedAssets.length > 0 ? (
          sortedAssets.map((asset, index) => {
            const value = asset.currentPrice * asset.quantity;
            const change = ((asset.currentPrice - asset.purchasePrice) / asset.purchasePrice) * 100;
            const isPositive = change >= 0;
            
            return (
              <motion.div
                key={asset.id}
                className="flex items-center p-3 bg-white bg-opacity-5 rounded-xl hover:bg-opacity-10 transition-all duration-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <img 
                  src={asset.logoUrl} 
                  alt={asset.name} 
                  className="w-8 h-8 rounded-full mr-3"
                />
                
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{asset.name}</p>
                      <p className="text-xs text-gray-400">{asset.symbol}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(value)}</p>
                      <p className={`text-xs ${isPositive ? 'text-accent-500' : 'text-error-500'}`}>
                        {isPositive ? '+' : ''}{formatPercentage(change)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-6 text-gray-400">
            No assets in your portfolio yet
          </div>
        )}
      </div>
    </motion.div>
  );
}