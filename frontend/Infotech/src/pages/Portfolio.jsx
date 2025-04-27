import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';

import Sidebar from '../components/Layout/Sidebar';
import AssetList from '../components/Assets/AssetList';
import AssetForm from '../components/Assets/AssetForm';
import ChatBotToggle from '../components/chatbot';

export default function Portfolio() {
  const [showAddAsset, setShowAddAsset] = useState(false);
  
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
            <h1 className="text-3xl font-bold mb-2">Your Portfolio</h1>
            <p className="text-gray-400">Manage and track all your investments</p>
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
        <ChatBotToggle />
        {/* Asset List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AssetList />
        </motion.div>
      </div>
      
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