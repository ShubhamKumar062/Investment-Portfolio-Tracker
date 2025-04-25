import './AssetsList.css';

const AssetsList = ({ assets, onRemove, onEdit }) => {
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
  
  if (assets.length === 0) {
    return (
      <div className="empty-assets">
        <p>No assets found. Add an asset to get started.</p>
      </div>
    );
  }
  
  return (
    <div className="assets-table-container">
      <table className="assets-table">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Type</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Value</th>
            <th>24h Change</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map(asset => (
            <tr key={asset.id} className="asset-row">
              <td className="asset-name">
                <div className="asset-icon" style={{ backgroundColor: getAssetColor(asset.type) }}>
                  {asset.symbol.charAt(0)}
                </div>
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
              <td className="actions">
                <button 
                  className="edit-button" 
                  onClick={() => onEdit(asset)}
                  aria-label="Edit asset"
                >
                  ✏️
                </button>
                <button 
                  className="delete-button" 
                  onClick={() => onRemove(asset.id)}
                  aria-label="Delete asset"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Helper function to get asset color based on type
const getAssetColor = (type) => {
  const colors = {
    'Stocks': '#0A84FF',
    'Crypto': '#BF5AF2',
    'Bonds': '#30D158',
    'Real Estate': '#FF9F0A',
    'Commodities': '#FF453A',
    'Cash': '#8E8E93'
  };
  
  return colors[type] || '#8E8E93';
};

export default AssetsList;