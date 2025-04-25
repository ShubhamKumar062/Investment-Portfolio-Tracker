import './SearchFilter.css';

const SearchFilter = ({ 
  searchTerm, 
  onSearchChange, 
  selectedType, 
  onTypeChange, 
  assetTypes,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange
}) => {
  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'symbol', label: 'Symbol' },
    { value: 'type', label: 'Type' },
    { value: 'price', label: 'Price' },
    { value: 'value', label: 'Value' },
    { value: 'change24h', label: 'Performance' }
  ];
  
  const handleSortOrderToggle = () => {
    onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  
  return (
    <div className="search-filter">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="type-filter">Filter by:</label>
          <select
            id="type-filter"
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="filter-select"
          >
            {assetTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="sort-by">Sort by:</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="filter-select"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          
          <button
            className={`sort-order-button ${sortOrder === 'desc' ? 'desc' : 'asc'}`}
            onClick={handleSortOrderToggle}
            aria-label={`Sort ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;