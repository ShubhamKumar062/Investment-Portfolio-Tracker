import { useState, useContext } from 'react';
import { AppContent } from '../../context/AppContext';
import AssetsList from './components/AssetsList';
import AssetForm from './components/AssetForm';
import SearchFilter from './components/SearchFilter';
import './AssetsPage.css';

const AssetsPage = () => {
  const { assets, addAsset, removeAsset, updateAsset } = useContext(AppContent);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState('value');
  const [sortOrder, setSortOrder] = useState('desc');
  const [editingAsset, setEditingAsset] = useState(null);
  
  const assetTypes = ['All', 'Stocks', 'Crypto', 'Bonds', 'Real Estate', 'Commodities', 'Cash'];
  
  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
    setEditingAsset(null);
  };
  
  const handleEditAsset = (asset) => {
    setEditingAsset(asset);
    setShowAddForm(true);
  };
  
  const handleCancelEdit = () => {
    setEditingAsset(null);
    setShowAddForm(false);
  };
  
  const handleAssetSubmit = (asset) => {
    if (editingAsset) {
      updateAsset({ ...asset, id: editingAsset.id });
    } else {
      const newAsset = {
        ...asset,
        id: Date.now().toString(),
        initialValue: asset.value
      };
      addAsset(newAsset);
    }
    setShowAddForm(false);
    setEditingAsset(null);
  };
  
  const filterAssets = () => {
    let filtered = [...assets];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(asset => 
        asset.name.toLowerCase().includes(term) || 
        asset.symbol.toLowerCase().includes(term)
      );
    }
    
    // Filter by type
    if (selectedType !== 'All') {
      filtered = filtered.filter(asset => asset.type === selectedType);
    }
    
    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'symbol') {
        comparison = a.symbol.localeCompare(b.symbol);
      } else if (sortBy === 'price') {
        comparison = a.price - b.price;
      } else if (sortBy === 'value') {
        comparison = a.value - b.value;
      } else if (sortBy === 'change24h') {
        comparison = a.change24h - b.change24h;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  };
  
  const filteredAssets = filterAssets();
  
  return (
    <div className="assets-page">
      <div className="assets-header">
        <h2>Asset Management</h2>
        <button onClick={toggleAddForm} className="add-asset-button">
          {showAddForm ? 'Cancel' : '+ Add Asset'}
        </button>
      </div>
      
      {showAddForm ? (
        <div className="asset-form-container">
          <AssetForm 
            onSubmit={handleAssetSubmit} 
            onCancel={handleCancelEdit}
            asset={editingAsset}
          />
        </div>
      ) : (
        <>
          <div className="filter-section">
            <SearchFilter 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              assetTypes={assetTypes}
              sortBy={sortBy}
              onSortChange={setSortBy}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
            />
          </div>
          
          <div className="assets-list-container">
            <AssetsList 
              assets={filteredAssets} 
              onRemove={removeAsset}
              onEdit={handleEditAsset}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AssetsPage;