import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from './App';
import * as productService from './services/productService';

// Mock the productService module
vi.mock('./services/productService');

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render ProductList and ProductForm components', async () => {
    // Given
    productService.fetchProducts.mockResolvedValue([]);

    // When
    render(<App />);

    // Then
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /product management/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /create new product/i })).toBeInTheDocument();
      expect(screen.getByText(/no products found/i)).toBeInTheDocument();
    });
  });

  it('should display existing products on mount', async () => {
    // Given
    const mockProducts = [
      { id: 1, name: 'Existing Product 1', createdAt: '2025-11-17T10:00:00', updatedAt: '2025-11-17T10:00:00' },
      { id: 2, name: 'Existing Product 2', createdAt: '2025-11-17T11:00:00', updatedAt: '2025-11-17T11:00:00' }
    ];
    productService.fetchProducts.mockResolvedValue(mockProducts);

    // When
    render(<App />);

    // Then
    await waitFor(() => {
      expect(screen.getByText(/existing product 1/i)).toBeInTheDocument();
      expect(screen.getByText(/existing product 2/i)).toBeInTheDocument();
    });
  });

  it('should refresh product list after creating a new product', async () => {
    // Given
    const initialProducts = [
      { id: 1, name: 'Product 1', createdAt: '2025-11-17T10:00:00', updatedAt: '2025-11-17T10:00:00' }
    ];
    const newProduct = {
      id: 2,
      name: 'New Product',
      createdAt: '2025-11-17T12:00:00',
      updatedAt: '2025-11-17T12:00:00'
    };
    const updatedProducts = [...initialProducts, newProduct];

    // First call returns initial products, second call returns updated products
    productService.fetchProducts
      .mockResolvedValueOnce(initialProducts)
      .mockResolvedValueOnce(updatedProducts);
    productService.createProduct.mockResolvedValue(newProduct);

    render(<App />);

    // Wait for initial products to load
    await waitFor(() => {
      expect(screen.getByText(/product 1/i)).toBeInTheDocument();
    });

    // When - create a new product
    const input = screen.getByLabelText(/product name/i);
    const submitButton = screen.getByRole('button', { name: /create product/i });
    fireEvent.change(input, { target: { value: 'New Product' } });
    fireEvent.click(submitButton);

    // Then - new product should appear in the list
    await waitFor(() => {
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(2);
      expect(listItems[1]).toHaveTextContent('New Product');
      expect(productService.fetchProducts).toHaveBeenCalledTimes(2);
    });
  });

  it('should handle empty product list', async () => {
    // Given
    productService.fetchProducts.mockResolvedValue([]);

    // When
    render(<App />);

    // Then
    await waitFor(() => {
      expect(screen.getByText(/no products found/i)).toBeInTheDocument();
    });
  });

  it('should display error when fetching products fails', async () => {
    // Given
    productService.fetchProducts.mockRejectedValue(new Error('Network Error'));

    // When
    render(<App />);

    // Then
    await waitFor(() => {
      expect(screen.getByText(/error loading products/i)).toBeInTheDocument();
    });
  });
});
