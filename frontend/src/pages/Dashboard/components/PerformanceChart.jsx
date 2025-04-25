import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './PerformanceChart.css';

const PerformanceChart = ({ performanceData, timeRange }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  const getFilteredData = () => {
    // Filter data based on time range
    const now = new Date();
    let filterDate = new Date();
    
    switch(timeRange) {
      case '1D':
        filterDate.setDate(now.getDate() - 1);
        break;
      case '1W':
        filterDate.setDate(now.getDate() - 7);
        break;
      case '1M':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case '3M':
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case '1Y':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'ALL':
      default:
        return performanceData;
    }
    
    return performanceData.filter(item => new Date(item.date) >= filterDate);
  };
  
  useEffect(() => {
    const filteredData = getFilteredData();
    
    // Prepare data for chart
    const labels = filteredData.map(item => item.date);
    const values = filteredData.map(item => item.value);
    
    // Calculate if performance is positive
    const isPositive = values[values.length - 1] >= values[0];
    const gradientColor = isPositive ? '#30D158' : '#FF453A';
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = chartRef.current.getContext('2d');
    
    // Create gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, `${gradientColor}33`); // 20% opacity
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Portfolio Value',
          data: values,
          borderColor: gradientColor,
          backgroundColor: gradient,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: gradientColor,
          pointHoverBorderColor: '#FFFFFF',
          pointHoverBorderWidth: 2,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `$${context.raw.toLocaleString()}`;
              },
              title: function(context) {
                return new Date(context[0].label).toLocaleDateString('en-US', {
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                });
              }
            },
            displayColors: false,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#1C1C1E',
            bodyColor: isPositive ? '#30D158' : '#FF453A',
            titleFont: {
              family: '-apple-system, BlinkMacSystemFont, "SF Pro", Roboto, Helvetica, Arial, sans-serif',
              size: 12,
              weight: 'normal'
            },
            bodyFont: {
              family: '-apple-system, BlinkMacSystemFont, "SF Pro", Roboto, Helvetica, Arial, sans-serif',
              size: 16,
              weight: 'bold'
            },
            padding: 12,
            cornerRadius: 8,
            borderColor: 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            ticks: {
              display: true,
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 6,
              font: {
                family: '-apple-system, BlinkMacSystemFont, "SF Pro", Roboto, Helvetica, Arial, sans-serif',
                size: 10
              },
              color: '#8E8E93'
            },
            grid: {
              display: false
            }
          },
          y: {
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString();
              },
              font: {
                family: '-apple-system, BlinkMacSystemFont, "SF Pro", Roboto, Helvetica, Arial, sans-serif',
                size: 10
              },
              color: '#8E8E93'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }
    });
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [performanceData, timeRange]);
  
  return (
    <div className="performance-chart-container">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default PerformanceChart;