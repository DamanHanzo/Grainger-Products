import axios from 'axios';

/**
 * Base configuration for axios.
 * The Vite proxy will forward /api requests to http://localhost:8080
 */
axios.defaults.baseURL = '';
axios.defaults.headers.common['Content-Type'] = 'application/json';

/**
 * Fetch all products from the backend API.
 *
 * @returns {Promise<Array>} Array of product objects
 * @throws {Error} If the API call fails
 */
export const fetchProducts = async () => {
  try {
    const response = await axios.get('/api/products');
    return response.data;
  } catch (error) {
    // Re-throw the error to be handled by the calling component
    throw error;
  }
};

/**
 * Create a new product.
 *
 * @param {Object} product - The product to create (must have a name property)
 * @returns {Promise<Object>} The created product with generated ID
 * @throws {Error} If the API call fails or validation fails
 */
export const createProduct = async (product) => {
  try {
    const response = await axios.post('/api/products', product);
    return response.data;
  } catch (error) {
    // Re-throw the error to be handled by the calling component
    throw error;
  }
};
