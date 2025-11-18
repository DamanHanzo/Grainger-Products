import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { fetchProducts, createProduct } from './productService';

// Mock axios
vi.mock('axios');

describe('productService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe('fetchProducts', () => {
    it('should fetch all products successfully', async () => {
      // Given
      const mockProducts = [
        { id: 1, name: 'Product 1', createdAt: '2025-11-17T10:00:00', updatedAt: '2025-11-17T10:00:00' },
        { id: 2, name: 'Product 2', createdAt: '2025-11-17T11:00:00', updatedAt: '2025-11-17T11:00:00' }
      ];
      axios.get.mockResolvedValue({ data: mockProducts });

      // When
      const result = await fetchProducts();

      // Then
      expect(result).toEqual(mockProducts);
      expect(axios.get).toHaveBeenCalledWith('/api/products');
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no products exist', async () => {
      // Given
      axios.get.mockResolvedValue({ data: [] });

      // When
      const result = await fetchProducts();

      // Then
      expect(result).toEqual([]);
      expect(axios.get).toHaveBeenCalledWith('/api/products');
    });

    it('should throw error when API call fails', async () => {
      // Given
      const errorMessage = 'Network Error';
      axios.get.mockRejectedValue(new Error(errorMessage));

      // When & Then
      await expect(fetchProducts()).rejects.toThrow(errorMessage);
      expect(axios.get).toHaveBeenCalledWith('/api/products');
    });

    it('should throw error when API returns 500', async () => {
      // Given
      const errorResponse = {
        response: {
          status: 500,
          data: { error: 'Internal Server Error' }
        }
      };
      axios.get.mockRejectedValue(errorResponse);

      // When & Then
      await expect(fetchProducts()).rejects.toEqual(errorResponse);
    });
  });

  describe('createProduct', () => {
    it('should create a product successfully', async () => {
      // Given
      const newProduct = { name: 'New Product' };
      const createdProduct = {
        id: 1,
        name: 'New Product',
        createdAt: '2025-11-17T12:00:00',
        updatedAt: '2025-11-17T12:00:00'
      };
      axios.post.mockResolvedValue({ data: createdProduct });

      // When
      const result = await createProduct(newProduct);

      // Then
      expect(result).toEqual(createdProduct);
      expect(axios.post).toHaveBeenCalledWith('/api/products', newProduct);
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    it('should throw error when creating product with empty name', async () => {
      // Given
      const invalidProduct = { name: '' };
      const errorResponse = {
        response: {
          status: 400,
          data: { error: 'Product name cannot be null or empty' }
        }
      };
      axios.post.mockRejectedValue(errorResponse);

      // When & Then
      await expect(createProduct(invalidProduct)).rejects.toEqual(errorResponse);
      expect(axios.post).toHaveBeenCalledWith('/api/products', invalidProduct);
    });

    it('should throw error when creating product with null name', async () => {
      // Given
      const invalidProduct = { name: null };
      const errorResponse = {
        response: {
          status: 400,
          data: { error: 'Product name cannot be null or empty' }
        }
      };
      axios.post.mockRejectedValue(errorResponse);

      // When & Then
      await expect(createProduct(invalidProduct)).rejects.toEqual(errorResponse);
      expect(axios.post).toHaveBeenCalledWith('/api/products', invalidProduct);
    });

    it('should throw error when API call fails', async () => {
      // Given
      const newProduct = { name: 'Test Product' };
      const errorMessage = 'Network Error';
      axios.post.mockRejectedValue(new Error(errorMessage));

      // When & Then
      await expect(createProduct(newProduct)).rejects.toThrow(errorMessage);
      expect(axios.post).toHaveBeenCalledWith('/api/products', newProduct);
    });

    it('should throw error when API returns 500', async () => {
      // Given
      const newProduct = { name: 'Test Product' };
      const errorResponse = {
        response: {
          status: 500,
          data: { error: 'Internal Server Error' }
        }
      };
      axios.post.mockRejectedValue(errorResponse);

      // When & Then
      await expect(createProduct(newProduct)).rejects.toEqual(errorResponse);
      expect(axios.post).toHaveBeenCalledWith('/api/products', newProduct);
    });
  });
});
