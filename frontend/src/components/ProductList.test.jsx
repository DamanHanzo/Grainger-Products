import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ProductList from './ProductList';
import * as productService from '../services/productService';

// Mock the productService module
vi.mock('../services/productService');

describe('ProductList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    // Given
    productService.fetchProducts.mockImplementation(() => new Promise(() => {})); // Never resolves

    // When
    render(<ProductList />);

    // Then
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should display products when fetch is successful', async () => {
    // Given
    const mockProducts = [
      { id: 1, name: 'Product 1', createdAt: '2025-11-17T10:00:00', updatedAt: '2025-11-17T10:00:00' },
      { id: 2, name: 'Product 2', createdAt: '2025-11-17T11:00:00', updatedAt: '2025-11-17T11:00:00' }
    ];
    productService.fetchProducts.mockResolvedValue(mockProducts);

    // When
    render(<ProductList />);

    // Then
    await waitFor(() => {
      expect(screen.getByText(/product 1/i)).toBeInTheDocument();
      expect(screen.getByText(/product 2/i)).toBeInTheDocument();
    });
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  it('should display empty message when no products exist', async () => {
    // Given
    productService.fetchProducts.mockResolvedValue([]);

    // When
    render(<ProductList />);

    // Then
    await waitFor(() => {
      expect(screen.getByText(/no products found/i)).toBeInTheDocument();
    });
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  it('should display error message when fetch fails', async () => {
    // Given
    const errorMessage = 'Network Error';
    productService.fetchProducts.mockRejectedValue(new Error(errorMessage));

    // When
    render(<ProductList />);

    // Then
    await waitFor(() => {
      expect(screen.getByText(/error loading products/i)).toBeInTheDocument();
      expect(screen.queryByText(/^loading products\.\.\.$/i)).not.toBeInTheDocument();
    });
  });

  it('should display error message when API returns error response', async () => {
    // Given
    const errorResponse = {
      response: {
        status: 500,
        data: { error: 'Internal Server Error' }
      }
    };
    productService.fetchProducts.mockRejectedValue(errorResponse);

    // When
    render(<ProductList />);

    // Then
    await waitFor(() => {
      expect(screen.getByText(/error loading products/i)).toBeInTheDocument();
    });
  });

  it('should call fetchProducts on mount', async () => {
    // Given
    productService.fetchProducts.mockResolvedValue([]);

    // When
    render(<ProductList />);

    // Then
    await waitFor(() => {
      expect(productService.fetchProducts).toHaveBeenCalledTimes(1);
    });
  });

  it('should display product IDs in the list', async () => {
    // Given
    const mockProducts = [
      { id: 1, name: 'Product 1', createdAt: '2025-11-17T10:00:00', updatedAt: '2025-11-17T10:00:00' },
      { id: 2, name: 'Product 2', createdAt: '2025-11-17T11:00:00', updatedAt: '2025-11-17T11:00:00' }
    ];
    productService.fetchProducts.mockResolvedValue(mockProducts);

    // When
    render(<ProductList />);

    // Then
    await waitFor(() => {
      expect(screen.getByText(/1/)).toBeInTheDocument();
      expect(screen.getByText(/2/)).toBeInTheDocument();
    });
  });

  it('should render a list with correct number of items', async () => {
    // Given
    const mockProducts = [
      { id: 1, name: 'Product 1', createdAt: '2025-11-17T10:00:00', updatedAt: '2025-11-17T10:00:00' },
      { id: 2, name: 'Product 2', createdAt: '2025-11-17T11:00:00', updatedAt: '2025-11-17T11:00:00' },
      { id: 3, name: 'Product 3', createdAt: '2025-11-17T12:00:00', updatedAt: '2025-11-17T12:00:00' }
    ];
    productService.fetchProducts.mockResolvedValue(mockProducts);

    // When
    render(<ProductList />);

    // Then
    await waitFor(() => {
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);
    });
  });
});
