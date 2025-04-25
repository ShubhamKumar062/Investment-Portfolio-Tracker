import { useState, useEffect, useRef, useContext } from 'react';
import { AppContent } from '../../context/AppContext';
import Chart from 'chart.js/auto';
import './ComparisonPage.css';

const ComparisonPage = () => {
  const { assets } = useContext(AppContent);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [compareTo, setCompareTo] = useState('none');
  const [timeRange, setTimeRange] = useState('1M');
  
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  const benchmarks = [
    { id: 'sp500', name: 'S&P 500', symbol: 'SPX' },
    { id: 'nasdaq', name: 'NASDAQ', symbol: 'IXIC' },
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  ];
  
  const timeRanges = ['1W', '1M', '3M', '6M', '1Y', 'ALL'];
  
  // Generate mock performance data for an asset
  const generatePerformanceData = (assetId, timeRange) => {
    const dataPoints = timeRangeToDataPoints(timeRange);
    const data = [];
    let value = Math.random() * 100 + 50; // Random starting value
    
    const now = new Date();
    let date = new Date();
    
    // Adjust date based on time range
    switch(timeRange) {
      case '1W': date.setDate(now.getDate() - 7); break;
      case '1M': date.setMonth(now.getMonth() - 1); break;
      case '3M': date.setMonth(now.getMonth() - 3); break;
      case '6M': date.setMonth(now.getMonth() - 6); break;
      case '1Y': date.setFullYear(now.getFullYear() - 1); break;
      case 'ALL': date.setFullYear(now.getFullYear() - 5); break;
      default: date.setMonth(now.getMonth() - 1);
    }
    
    // Generate data points
    for (let i = 0; i < dataPoints; i++) {
      // Random daily change between -3% and +3%
      const change = (Math.random() * 6 - 3) / 100;
      value = value * (1 + change);
      
      // Add some randomness for the asset to make each line different
      const assetRandom = (parseInt(assetId, 16) % 10) / 100;
      value = value * (1 + assetRandom);
      
      date = new Date(date.setDate(date.getDate() + 1));
      
      if (date <= now) {
        data.push({
          date: date.toISOString().split('T')[0],
          value
        });
      }
    }
    
    return data;
  };
  
  // Map time range to number of data points
  const timeRangeToDataPoints = (range) => {
    switch(range) {
      case '1W': return 7;
      case '1M': return 30;
      case '3M': return 90;
      case '6M': return 180;
      case '1Y': return 365;
      case 'ALL': return 365 * 5;
      default: return 30;
    }
  };
  
  const toggleAssetSelection = (asset) => {
    if (selectedAssets.find(a => a.id === asset.id)) {
      setSelectedAssets(selectedAssets.filter(a => a.id !== asset.id));
    } else {
      // Limit to 5 assets max
      if (selectedAssets.length < 5) {
        setSelectedAssets([...selectedAssets, asset]);
      } else {
        alert('You can select a maximum of 5 assets for comparison');
      }
    }
  };
  
  const handleBenchmarkChange = (e) => {
    setCompareTo(e.target.value);
  };
  
  useEffect(() => {
    if (selectedAssets.length === 0) return;
    
    // Prepare data for chart
    const datasets = [];
    const colors = ['#0A84FF', '#30D158', '#BF5AF2', '#FF9F0A', '#FF453A'];
    
    // Add selected assets to datasets
    selectedAssets.forEach((asset, index) => {
      const performanceData = generatePerformanceData(asset.id, timeRange);
      
      datasets.push({
        label: asset.symbol,
        data: performanceData.map(item => ({
          x: item.date,
          y: item.value
        })),
        borderColor: colors[index % colors.length],
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.4
      });
    });
    
    // Add benchmark if selected
    if (compareTo !== 'none') {
      const benchmark = benchmarks.find(b => b.id === compareTo);
      if (benchmark) {
        const benchmarkData = generatePerformanceData(benchmark.id, timeRange);
        
        datasets.push({
          label: benchmark.symbol,
          data: benchmarkData.map(item => ({
            x: item.date,
            y: item.value
          })),
          borderColor: '#8E8E93',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.4
        });
      }
    }
    
    // Create or update chart
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      const ctx = chartRef.current.getContext('2d');
      
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          scales: {
            x: {
              type: 'time',
              time: {
                unit: timeRange === '1W' ? 'day' : 'month',
                displayFormats: {
                  day: 'MMM d',
                  month: 'MMM yyyy'
                }
              },
              ticks: {
                maxRotation: 0,
                autoSkip: true,
                maxTicksLimit: 6
              },
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: false,
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: $${context.parsed.y.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`;
                }
              }
            },
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 12,
                padding: 15
              }
            }
          }
        }
      });
    }
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [selectedAssets, compareTo, timeRange]);
  
  return (
    <div className="comparison-page">
      <div className="comparison-header">
        <h2>Asset Comparison</h2>
      </div>
      
      <div className="comparison-controls card">
        <div className="control-section">
          <h3>Select Assets to Compare</h3>
          <div className="asset-selector">
            {assets.map(asset => (
              <button
                key={asset.id}
                className={`asset-button ${selectedAssets.find(a => a.id === asset.id) ? 'selected' : ''}`}
                onClick={() => toggleAssetSelection(asset)}
              >
                {asset.symbol}
              </button>
            ))}
          </div>
        </div>
        
        <div className="control-section">
          <h3>Compare With</h3>
          <div className="benchmark-selector">
            <select value={compareTo} onChange={handleBenchmarkChange}>
              <option value="none">No Benchmark</option>
              {benchmarks.map(benchmark => (
                <option key={benchmark.id} value={benchmark.id}>
                  {benchmark.name} ({benchmark.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="control-section">
          <h3>Time Range</h3>
          <div className="time-range-selector">
            {timeRanges.map(range => (
              <button
                key={range}
                className={`time-range-button ${timeRange === range ? 'active' : ''}`}
                onClick={() => setTimeRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {selectedAssets.length > 0 ? (
        <div className="comparison-chart card">
          <h3>Performance Comparison</h3>
          <div className="chart-container">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
      ) : (
        <div className="empty-chart card">
          <p>Select at least one asset to see comparison chart</p>
        </div>
      )}
    </div>
  );
};

export default ComparisonPage;