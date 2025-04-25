import './PortfolioSummary.css';

const PortfolioSummary = ({ portfolio }) => {
  const { totalValue, dailyChange, percentChange, profitLoss } = portfolio;
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };
  
  const formatPercentage = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };
  
  return (
    <div className="portfolio-summary card">
      <div className="summary-item total-value">
        <h3>Total Portfolio Value</h3>
        <div className="value">{formatCurrency(totalValue)}</div>
      </div>
      
      <div className="summary-item daily-change">
        <h3>Today's Change</h3>
        <div className={`value ${dailyChange >= 0 ? 'positive' : 'negative'}`}>
          {formatCurrency(dailyChange)} ({formatPercentage(percentChange)})
        </div>
      </div>
      
      <div className="summary-item profit-loss">
        <h3>Total Profit/Loss</h3>
        <div className={`value ${profitLoss >= 0 ? 'positive' : 'negative'}`}>
          {formatCurrency(profitLoss)}
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;