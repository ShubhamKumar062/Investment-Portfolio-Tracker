import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { assetTypes } from '../../data/mockData';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';


export default function AssetForm({ onClose, initialAsset = null }) {
  const { addAsset, updateAsset } = usePortfolio();
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    type: 'stock',
    quantity: '',
    purchasePrice: '',
    currentPrice: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    logoUrl: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  const isEditing = !!initialAsset;

  useEffect(() => {
    if (initialAsset) {
      setFormData({
        ...initialAsset,
        quantity: initialAsset.quantity.toString(),
        purchasePrice: initialAsset.purchasePrice.toString(),
        currentPrice: initialAsset.currentPrice.toString(),
      });
    }
  }, [initialAsset]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.symbol.trim()) newErrors.symbol = 'Symbol is required';

    const quantity = parseFloat(formData.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    }

    const purchasePrice = parseFloat(formData.purchasePrice);
    if (isNaN(purchasePrice) || purchasePrice < 0) {
      newErrors.purchasePrice = 'Purchase price must be a non-negative number';
    }

    const currentPrice = parseFloat(formData.currentPrice);
    if (isNaN(currentPrice) || currentPrice < 0) {
      newErrors.currentPrice = 'Current price must be a non-negative number';
    }

    if (!formData.purchaseDate) newErrors.purchaseDate = 'Purchase date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const assetData = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        purchasePrice: parseFloat(formData.purchasePrice),
        currentPrice: parseFloat(formData.currentPrice),
        logoUrl: formData.logoUrl || `https://ui-avatars.com/api/?name=${formData.symbol}&background=random&color=fff`,
      };

      const token = localStorage.getItem('token');

      if (isEditing) {
        await updateAsset(assetData);
        toast.success('Asset updated successfully.');
        onClose(); // Close the form after success
      } else {
        const response = await axios.post(
          'http://localhost:3777/api/user/addasset',
          {
            assetName: assetData.name,
            symbol: assetData.symbol,
            assetType: assetData.type,
            Quantity: assetData.quantity,
            purchaseDate: assetData.purchaseDate,
            currentPrice: assetData.currentPrice,
            purchasePrice: assetData.purchasePrice,
            logoUrl: assetData.logoUrl,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { status, message } = response.data;

        if (status) {
          toast.success(message || 'Asset added successfully.');
          setTimeout(onClose, 1500); // Auto-close after showing success
        } else {
          toast.error(message || 'Something went wrong.');
        }
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Server error occurred.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="glass-card p-6 rounded-2xl w-full max-w-lg mx-auto"
      >
        <h2 className="text-2xl font-semibold mb-6">
          {isEditing ? 'Edit Asset' : 'Add New Asset'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Asset Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`glass-input w-full ${errors.name ? 'border-error-500' : ''}`}
                  placeholder="e.g. Apple Inc."
                />
                {errors.name && <p className="mt-1 text-xs text-error-500">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Symbol</label>
                <input
                  type="text"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleChange}
                  className={`glass-input w-full ${errors.symbol ? 'border-error-500' : ''}`}
                  placeholder="e.g. AAPL"
                />
                {errors.symbol && <p className="mt-1 text-xs text-error-500">{errors.symbol}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Asset Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="glass-input w-full"
              >
                {assetTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  step="any"
                  className={`glass-input w-full ${errors.quantity ? 'border-error-500' : ''}`}
                  placeholder="e.g. 10"
                />
                {errors.quantity && <p className="mt-1 text-xs text-error-500">{errors.quantity}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Purchase Date</label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className={`glass-input w-full ${errors.purchaseDate ? 'border-error-500' : ''}`}
                />
                {errors.purchaseDate && <p className="mt-1 text-xs text-error-500">{errors.purchaseDate}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Purchase Price</label>
                <input
                  type="number"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  step="any"
                  className={`glass-input w-full ${errors.purchasePrice ? 'border-error-500' : ''}`}
                  placeholder="e.g. 150.75"
                />
                {errors.purchasePrice && <p className="mt-1 text-xs text-error-500">{errors.purchasePrice}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Current Price</label>
                <input
                  type="number"
                  name="currentPrice"
                  value={formData.currentPrice}
                  onChange={handleChange}
                  step="any"
                  className={`glass-input w-full ${errors.currentPrice ? 'border-error-500' : ''}`}
                  placeholder="e.g. 167.53"
                />
                {errors.currentPrice && <p className="mt-1 text-xs text-error-500">{errors.currentPrice}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Logo URL (Optional)</label>
              <input
                type="text"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                className="glass-input w-full"
                placeholder="e.g. https://example.com/logo.png"
              />
              <p className="mt-1 text-xs text-gray-400">
                Leave blank to use a generated logo
              </p>
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost"
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                isEditing ? 'Update Asset' : 'Add Asset'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
}