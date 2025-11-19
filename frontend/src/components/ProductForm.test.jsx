import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductForm from './ProductForm';
import * as productService from '../services/productService';

// Mock the productService module
vi.mock('../services/productService');

describe('ProductForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form with name input and submit button', () => {
    // When
    render(<ProductForm />);

    // Then
    expect(screen.getByLabelText(/product name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create product/i })).toBeInTheDocument();
  });

  it('should update input value when user types', async () => {
    // Given
    render(<ProductForm />);
    const user = userEvent.setup();
    const input = screen.getByLabelText(/product name/i);

    // When
    await user.type(input, 'New Product');

    // Then
    expect(input.value).toBe('New Product');
  });

  it('should call createProduct and clear form on successful submission', async () => {
    // Given
    const mockOnProductCreated = vi.fn();
    const createdProduct = {
      id: 1,
      name: 'New Product',
      createdAt: '2025-11-17T12:00:00',
      updatedAt: '2025-11-17T12:00:00'
    };
    productService.createProduct.mockResolvedValue(createdProduct);

    render(<ProductForm onProductCreated={mockOnProductCreated} />);
    const user = userEvent.setup();
    const input = screen.getByLabelText(/product name/i);
    const submitButton = screen.getByRole('button', { name: /create product/i });

    // When
    await user.type(input, 'New Product');
    await user.click(submitButton);

    // Then
    await waitFor(() => {
      expect(productService.createProduct).toHaveBeenCalledWith({ name: 'New Product' });
      expect(mockOnProductCreated).toHaveBeenCalledWith(createdProduct);
      expect(input.value).toBe('');
    });
  });

  it('should not submit when name is empty', async () => {
    // Given
    const mockOnProductCreated = vi.fn();
    render(<ProductForm onProductCreated={mockOnProductCreated} />);
    const user = userEvent.setup();
    const submitButton = screen.getByRole('button', { name: /create product/i });

    // When
    await user.click(submitButton);

    // Then
    expect(productService.createProduct).not.toHaveBeenCalled();
    expect(mockOnProductCreated).not.toHaveBeenCalled();
  });

  it('should not submit when name contains only whitespace', async () => {
    // Given
    const mockOnProductCreated = vi.fn();
    render(<ProductForm onProductCreated={mockOnProductCreated} />);
    const user = userEvent.setup();
    const input = screen.getByLabelText(/product name/i);
    const submitButton = screen.getByRole('button', { name: /create product/i });

    // When
    await user.type(input, '   ');
    await user.click(submitButton);

    // Then
    expect(productService.createProduct).not.toHaveBeenCalled();
    expect(mockOnProductCreated).not.toHaveBeenCalled();
  });

  it('should display error message when API call fails', async () => {
    // Given
    const mockOnProductCreated = vi.fn();
    const errorResponse = {
      response: {
        status: 400,
        data: { error: 'Product name cannot be null or empty' }
      }
    };
    productService.createProduct.mockRejectedValue(errorResponse);

    render(<ProductForm onProductCreated={mockOnProductCreated} />);
    const user = userEvent.setup();
    const input = screen.getByLabelText(/product name/i);
    const submitButton = screen.getByRole('button', { name: /create product/i });

    // When
    await user.type(input, 'Test Product');
    await user.click(submitButton);

    // Then
    await waitFor(() => {
      expect(screen.getByText(/failed to create product/i)).toBeInTheDocument();
    });
    expect(mockOnProductCreated).not.toHaveBeenCalled();
  });

  it('should disable submit button while submitting', async () => {
    // Given
    let resolveCreate;
    const createPromise = new Promise(resolve => { resolveCreate = resolve; });
    productService.createProduct.mockReturnValue(createPromise);

    render(<ProductForm />);
    const user = userEvent.setup();
    const input = screen.getByLabelText(/product name/i);
    const submitButton = screen.getByRole('button', { name: /create product/i });

    // When
    await user.type(input, 'Test Product');
    await user.click(submitButton);

    // Then
    expect(submitButton).toBeDisabled();

    // Clean up
    resolveCreate({ id: 1, name: 'Test Product' });
    await waitFor(() => expect(submitButton).not.toBeDisabled());
  });

  it('should clear error message when user starts typing', async () => {
    // Given
    const errorResponse = {
      response: {
        status: 500,
        data: { error: 'Internal Server Error' }
      }
    };
    productService.createProduct.mockRejectedValue(errorResponse);

    render(<ProductForm />);
    const user = userEvent.setup();
    const input = screen.getByLabelText(/product name/i);
    const submitButton = screen.getByRole('button', { name: /create product/i });

    // When - submit to get error
    await user.type(input, 'Test');
    await user.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/failed to create product/i)).toBeInTheDocument();
    });

    // Clear input and type again
    await user.clear(input);
    await user.type(input, 'N');

    // Then - error should be cleared
    expect(screen.queryByText(/failed to create product/i)).not.toBeInTheDocument();
  });

  it('should handle form submission via Enter key', async () => {
    // Given
    const mockOnProductCreated = vi.fn();
    const createdProduct = {
      id: 1,
      name: 'New Product',
      createdAt: '2025-11-17T12:00:00',
      updatedAt: '2025-11-17T12:00:00'
    };
    productService.createProduct.mockResolvedValue(createdProduct);

    render(<ProductForm onProductCreated={mockOnProductCreated} />);
    const user = userEvent.setup();
    const input = screen.getByLabelText(/product name/i);

    // When
    await user.type(input, 'New Product{Enter}');

    // Then
    await waitFor(() => {
      expect(productService.createProduct).toHaveBeenCalledWith({ name: 'New Product' });
      expect(mockOnProductCreated).toHaveBeenCalledWith(createdProduct);
    });
  });
});
