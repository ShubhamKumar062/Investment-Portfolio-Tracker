import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';

import Sidebar from '../components/Layout/Sidebar';
import PortfolioSummary from '../components/Dashboard/PortfolioSummary';
import PortfolioChart from '../components/Dashboard/PortfolioChart';
import AssetAllocation from '../components/Dashboard/AssetAllocation';
import TopAssets from '../components/Dashboard/TopAssets';
import AssetForm from '../components/Assets/AssetForm';
import { useAuth } from '../contexts/AuthContext';
import ChatBotToggle from '../components/chatbot';

export default function Dashboard() {
  const [showAddAsset, setShowAddAsset] = useState(false);
  const { currentUser } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Sidebar />
      
      <div className="lg:ml-60 p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-2">Welcome, {currentUser?.name || 'Investor'}</h1>
            <p className="text-gray-400">Here's what's happening with your investments today</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 md:mt-0"
          >
            <button 
              onClick={() => setShowAddAsset(true)}
              className="btn-primary flex items-center"
            >
              <FiPlus className="mr-2" />
              Add Investment
            </button>
          </motion.div>
        </div>
        
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <PortfolioChart />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TopAssets />
              <PortfolioSummary />
            </div>
          </div>
          
          {/* Side content - 1 column */}
          <div className="space-y-6">
            <AssetAllocation />
            
            {/* Market News */}
            <motion.div 
              className="glass-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-xl font-semibold mb-4">Market News</h2>
              
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <motion.div 
                    key={index}
                    className="p-3 bg-white bg-opacity-5 rounded-xl cursor-pointer hover:bg-opacity-10 transition-all duration-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index + 0.5 }}
                  >
                    <h3 className="font-medium mb-1">
                      {index === 0 && "Tech Stocks Rally on Strong Earnings"}
                      {index === 1 && "Bitcoin Hits New All-Time High"}
                      {index === 2 && "Fed Signals Potential Rate Cut"}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {index === 0 && "Major tech companies reported better-than-expected earnings..."}
                      {index === 1 && "Bitcoin surged past $80,000 for the first time in history..."}
                      {index === 2 && "Federal Reserve officials hinted at a possible interest rate cut..."}
                    </p>
                    <div className="text-xs text-gray-500 mt-2">
                      {index === 0 && "3 hours ago • Financial Times"}
                      {index === 1 && "5 hours ago • CoinDesk"}
                      {index === 2 && "Yesterday • Wall Street Journal"}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <button className="w-full mt-4 text-sm text-primary-400 hover:text-primary-300 transition-colors">
                View More News
              </button>
            </motion.div>
          </div>
        </div>
      </div>
      
      <ChatBotToggle />
      {/* Add Asset Modal */}
      <AnimatePresence>
        {showAddAsset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
          >
            <AssetForm onClose={() => setShowAddAsset(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}