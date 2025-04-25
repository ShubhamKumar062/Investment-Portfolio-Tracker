import './TopAssets.css';

const TopAssets = ({ assets }) => {
  // Sort assets by value in descending order
  const sortedAssets = [...assets]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Take top 5
  
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
    <div className="top-assets-container">
      <table className="assets-table">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Type</th>
            <th>Price</th>
            <th>Holdings</th>
            <th>Value</th>
            <th>24h Change</th>
          </tr>
        </thead>
        <tbody>
          {sortedAssets.map(asset => (
            <tr key={asset.id}>
              <td className="asset-name">
                <div className="asset-icon">{asset.symbol.charAt(0)}</div>
                <div>
                  <div className="asset-symbol">{asset.symbol}</div>
                  <div className="asset-fullname">{asset.name}</div>
                </div>
              </td>
              <td>{asset.type}</td>
              <td>{formatCurrency(asset.price)}</td>
              <td>{asset.quantity}</td>
              <td>{formatCurrency(asset.value)}</td>
              <td className={`change ${asset.change24h >= 0 ? 'positive' : 'negative'}`}>
                {formatPercentage(asset.change24h)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopAssets;