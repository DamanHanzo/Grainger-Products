import { useState, useEffect } from 'react';
import { fetchProducts } from '../services/productService';

/**
 * ProductList component displays a list of all products.
 * Fetches products from the backend API on mount and handles loading/error states.
 */
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError('Error loading products. Please try again later.');
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (products.length === 0) {
    return <div>No products found.</div>;
  }

  return (
    <div>
      <h2>Product List</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            ID: {product.id} - {product.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
