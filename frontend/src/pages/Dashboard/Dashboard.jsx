import { useState, useContext } from 'react';
import { AppContent } from '../../context/AppContext';
import PortfolioSummary from './components/PortfolioSummary';
import PortfolioAllocation from './components/PortfolioAllocation';
import PerformanceChart from './components/PerformanceChart';
import TopAssets from './components/TopAssets';
import './Dashboard.css';

const Dashboard = () => {
  const { portfolioData } = useContext(AppContent);
  const [timeRange, setTimeRange] = useState('1M'); // 1D, 1W, 1M, 3M, 1Y, All
  
  const timeRanges = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];
  
  return (
    <div className="dashboard">
      <div className="dashboard-header">
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
      
      <div className="portfolio-overview">
        {portfolioData ? (
          <PortfolioSummary portfolio={portfolioData} />
        ) : (
          <div className="loading-state">Loading portfolio data...</div>
        )}
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-col">
          <div className="dashboard-card allocation-card">
            <h3>Portfolio Allocation</h3>
            <PortfolioAllocation assets={portfolioData?.assets || []} />
          </div>
        </div>
        
        <div className="dashboard-col">
          <div className="dashboard-card performance-card">
            <h3>Performance</h3>
            <PerformanceChart 
              performanceData={portfolioData?.performanceHistory || []} 
              timeRange={timeRange}
            />
          </div>
        </div>
      </div>
      
      <div className="dashboard-card assets-card">
        <h3>Top Assets</h3>
        <TopAssets assets={portfolioData?.assets || []} />
      </div>
    </div>
  );
};

export default Dashboard;