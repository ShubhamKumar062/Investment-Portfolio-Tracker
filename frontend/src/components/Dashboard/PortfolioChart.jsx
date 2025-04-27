import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

import { usePortfolio } from '../../contexts/PortfolioContext';

export default function PortfolioChart() {
  const { assets, getAssetHistoricalData } = usePortfolio();
  const [timeframe, setTimeframe] = useState('1M');
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  
  const timeframeOptions = [
    { value: '1W', label: '1W' },
    { value: '1M', label: '1M' },
    { value: '3M', label: '3M' },
    { value: '1Y', label: '1Y' },
    { value: 'ALL', label: 'All' },
  ];

  useEffect(() => {
    if (assets.length === 0) return;
    
    // Combine historical data from all assets to create portfolio chart
    const combinedData = {};
    
    assets.forEach(asset => {
      const historicalData = getAssetHistoricalData(asset.id, timeframe);
      if (!historicalData) return;
      
      historicalData.forEach(dataPoint => {
        const { date, price } = dataPoint;
        combinedData[date] = (combinedData[date] || 0) + (price * asset.quantity);
      });
    });
    
    // Convert combined data to chart format
    const sortedDates = Object.keys(combinedData).sort();
    const values = sortedDates.map(date => combinedData[date]);
    
    setChartData({
      labels: sortedDates,
      datasets: [
        {
          label: 'Portfolio Value',
          data: values,
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
  }, [assets, timeframe, getAssetHistoricalData]);

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

  return (
    <motion.div 
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Portfolio Performance</h2>
        
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
        <Line data={chartData} options={chartOptions} />
      </div>
    </motion.div>
  );
}