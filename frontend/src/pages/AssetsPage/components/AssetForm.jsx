import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './AssetForm.css';

const AssetForm = ({ onSubmit, onCancel, asset = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    type: 'Stocks',
    price: '',
    quantity: '',
    change24h: '',
  });
  
  const assetTypes = ['Stocks', 'Crypto', 'Bonds', 'Real Estate', 'Commodities', 'Cash'];
  
  // If editing an existing asset, populate the form
  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name,
        symbol: asset.symbol,
        type: asset.type,
        price: asset.price,
        quantity: asset.quantity,
        change24h: asset.change24h,
      });
    }
  }, [asset]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Convert to number for numeric fields
    if (['price', 'quantity', 'change24h'].includes(name)) {
      processedValue = value === '' ? '' : Number(value);
    }
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
  };
  
  const calculateValue = () => {
    if (formData.price && formData.quantity) {
      return formData.price * formData.quantity;
    }
    return 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.symbol || !formData.price || !formData.quantity) {
      alert('Please fill out all required fields');
      return;
    }
    
    const newAsset = {
      ...formData,
      id: asset ? asset.id : uuidv4(),
      value: calculateValue(),
    };
    
    onSubmit(newAsset);
  };
  
  return (
    <form className="asset-form" onSubmit={handleSubmit}>
      <h3>{asset ? 'Edit Asset' : 'Add New Asset'}</h3>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Asset Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Apple Inc."
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="symbol">Symbol</label>
          <input
            type="text"
            id="symbol"
            name="symbol"
            value={formData.symbol}
            onChange={handleChange}
            placeholder="e.g., AAPL"
            required
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="type">Asset Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            {assetTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Current Price ($)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="0"
            min="0"
            step="0.001"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="change24h">24h Change (%)</label>
          <input
            type="number"
            id="change24h"
            name="change24h"
            value={formData.change24h}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group full-width">
          <label>Total Value</label>
          <div className="calculated-value">
            ${calculateValue().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>
      
      <div className="form-actions">
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit">
          {asset ? 'Update Asset' : 'Add Asset'}
        </button>
      </div>
    </form>
  );
};

export default AssetForm;