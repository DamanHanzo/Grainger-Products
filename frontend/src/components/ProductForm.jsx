import { useState } from 'react';
import { createProduct } from '../services/productService';

/**
 * ProductForm component for creating new products.
 * Handles form submission, validation, and error states.
 *
 * @param {Function} onProductCreated - Callback function called when a product is successfully created
 */
const ProductForm = ({ onProductCreated }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate name
    if (!name || name.trim().length === 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const createdProduct = await createProduct({ name: name.trim() });
      setName(''); // Clear form on success
      if (onProductCreated) {
        onProductCreated(createdProduct);
      }
    } catch (err) {
      setError('Failed to create product. Please try again.');
      console.error('Failed to create product:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  return (
    <div>
      <h2>Create New Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="productName">
            Product Name:
          </label>
          <input
            id="productName"
            type="text"
            value={name}
            onChange={handleNameChange}
            disabled={isSubmitting}
            placeholder="Enter product name"
          />
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
