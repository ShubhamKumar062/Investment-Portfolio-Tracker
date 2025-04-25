/**
 * Format a number as currency
 * @param {number} value - The value to format
 * @param {string} currency - The currency code
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Format a number as percentage
 * @param {number} value - The value to format
 * @returns {string} - Formatted percentage string
 */
export const formatPercentage = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
};

/**
 * Format a date
 * @param {string|Date} date - The date to format
 * @param {string} format - The format to use
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, format = 'long') => {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  switch (format) {
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'short':
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    case 'relative':
      const now = new Date();
      const diffTime = Math.abs(now - dateObj);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 1) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
    default:
      return dateObj.toLocaleDateString();
  }
};