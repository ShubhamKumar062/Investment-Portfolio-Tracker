import { motion } from 'framer-motion';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { formatCurrency } from '../../utils/formatters';
import axios from "axios"

export default function PortfolioSummary() {
  const { 
    portfolioValue, 
    portfolioChangePercent, 
    portfolioChangeAmount 
  } = usePortfolio();

  const isPositive = portfolioChangeAmount >= 0;
  
  return (
    <motion.div 
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4">Portfolio Summary</h2>
      
      <div className="flex flex-col space-y-4">
        <div>
          <p className="text-gray-400 text-sm">Total Value</p>
          <p className="text-3xl font-bold text-white">
            {formatCurrency(portfolioValue)}
          </p>
        </div>
        
        <div className="flex items-center">
          <div className={`text-lg font-semibold ${isPositive ? 'text-accent-500' : 'text-error-500'}`}>
            {isPositive ? '+' : ''}{formatCurrency(portfolioChangeAmount)} ({portfolioChangePercent.toFixed(2)}%)
          </div>
          
          <div className={`ml-2 px-2 py-1 rounded text-xs ${isPositive ? 'bg-accent-500 bg-opacity-20 text-accent-300' : 'bg-error-500 bg-opacity-20 text-error-300'}`}>
            {isPositive ? 'Profit' : 'Loss'}
          </div>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="glass-card p-4 rounded-xl">
          <p className="text-sm text-gray-400">Daily Change</p>
          <p className={`text-lg font-medium ${isPositive ? 'text-accent-500' : 'text-error-500'}`}>
            {isPositive ? '+' : ''}{(portfolioChangePercent / 30).toFixed(2)}%
          </p>
        </div>
        
        <div className="glass-card p-4 rounded-xl">
          <p className="text-sm text-gray-400">Monthly Change</p>
          <p className={`text-lg font-medium ${isPositive ? 'text-accent-500' : 'text-error-500'}`}>
            {isPositive ? '+' : ''}{portfolioChangePercent.toFixed(2)}%
          </p>
        </div>
      </div>
    </motion.div>
  );
}