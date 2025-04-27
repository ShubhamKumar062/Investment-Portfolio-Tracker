import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

import { usePortfolio } from '../../contexts/PortfolioContext';
import { assetTypes } from '../../data/mockData';

export default function AssetAllocation() {
  const { assets } = usePortfolio();
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  
  useEffect(() => {
    if (assets.length === 0) return;
    
    // Calculate values by asset type
    const assetTypeValues = {};
    assets.forEach(asset => {
      const typeValue = asset.currentPrice * asset.quantity;
      assetTypeValues[asset.type] = (assetTypeValues[asset.type] || 0) + typeValue;
    });
    
    // Generate chart data
    const chartLabels = [];
    const chartValues = [];
    const chartColors = [];
    
    Object.keys(assetTypeValues).forEach(type => {
      const assetType = assetTypes.find(t => t.id === type);
      if (assetType) {
        chartLabels.push(assetType.name);
        chartValues.push(assetTypeValues[type]);
        chartColors.push(assetType.color);
      }
    });
    
    setChartData({
      labels: chartLabels,
      datasets: [
        {
          data: chartValues,
          backgroundColor: chartColors,
          borderColor: 'rgba(0, 0, 0, 0)',
          borderWidth: 0,
          hoverOffset: 10,
        }
      ]
    });
  }, [assets]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const value = context.parsed;
            const total = context.chart.getDatasetMeta(0).total;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: $${value.toLocaleString('en-US')} (${percentage}%)`;
          }
        }
      }
    },
    elements: {
      arc: {
        borderWidth: 0
      }
    }
  };

  return (
    <motion.div 
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold mb-4">Asset Allocation</h2>
      
      <div className="flex flex-col items-center">
        <div className="h-[200px] w-[200px] relative">
          <Doughnut data={chartData} options={chartOptions} />
          
          {/* Center text */}
          {assets.length > 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-sm text-gray-400">Total Assets</p>
              <p className="text-xl font-bold text-white">{assets.length}</p>
            </div>
          )}
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2 w-full">
          {chartData.labels.map((label, index) => (
            <div key={label} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
              ></div>
              <div className="text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}