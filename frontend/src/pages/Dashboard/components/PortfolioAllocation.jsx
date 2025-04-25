import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './PortfolioAllocation.css';

const PortfolioAllocation = ({ assets }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  useEffect(() => {
    // Prepare data for chart
    const assetTypes = {};
    
    assets.forEach(asset => {
      const type = asset.type;
      if (!assetTypes[type]) {
        assetTypes[type] = 0;
      }
      assetTypes[type] += asset.value;
    });
    
    const labels = Object.keys(assetTypes);
    const data = Object.values(assetTypes);
    
    // Color mapping
    const typeColors = {
      Stocks: '#0A84FF',     // Primary
      Crypto: '#BF5AF2',     // Accent
      Bonds: '#30D158',      // Secondary
      'Real Estate': '#FF9F0A',  // Warning
      Commodities: '#FF453A',    // Error
      Cash: '#8E8E93',       // Neutral
    };
    
    const colors = labels.map(label => typeColors[label] || '#AEAEB2');
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = chartRef.current.getContext('2d');
    
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#FFFFFF',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: {
                family: '-apple-system, BlinkMacSystemFont, "SF Pro", Roboto, Helvetica, Arial, sans-serif',
                size: 12
              },
              color: '#3A3A3C',
              padding: 16
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.raw;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = (value / total * 100).toFixed(1);
                return `${context.label}: ${percentage}% ($${value.toLocaleString()})`;
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true
        }
      }
    });
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [assets]);
  
  return (
    <div className="allocation-chart-container">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default PortfolioAllocation;