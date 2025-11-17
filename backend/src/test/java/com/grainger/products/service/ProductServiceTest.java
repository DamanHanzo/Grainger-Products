package com.grainger.products.service;

import com.grainger.products.model.Product;
import com.grainger.products.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for ProductService.
 * Uses Mockito to mock the ProductRepository dependency.
 */
@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product testProduct;

    @BeforeEach
    void setUp() {
        testProduct = new Product("Test Product");
        testProduct.setId(1L);
    }

    // Tests for getAllProducts()

    @Test
    void shouldGetAllProducts() {
        // Given
        Product product1 = new Product("Product 1");
        Product product2 = new Product("Product 2");
        List<Product> products = Arrays.asList(product1, product2);

        when(productRepository.findAll()).thenReturn(products);

        // When
        List<Product> result = productService.getAllProducts();

        // Then
        assertThat(result).hasSize(2);
        assertThat(result).containsExactly(product1, product2);
        verify(productRepository, times(1)).findAll();
    }

    @Test
    void shouldReturnEmptyListWhenNoProducts() {
        // Given
        when(productRepository.findAll()).thenReturn(Arrays.asList());

        // When
        List<Product> result = productService.getAllProducts();

        // Then
        assertThat(result).isEmpty();
        verify(productRepository, times(1)).findAll();
    }

    // Tests for getProductById()

    @Test
    void shouldGetProductById() {
        // Given
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        // When
        Optional<Product> result = productService.getProductById(1L);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Test Product");
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    void shouldReturnEmptyWhenProductNotFound() {
        // Given
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        // When
        Optional<Product> result = productService.getProductById(999L);

        // Then
        assertThat(result).isEmpty();
        verify(productRepository, times(1)).findById(999L);
    }

    // Tests for createProduct()

    @Test
    void shouldCreateProduct() {
        // Given
        Product newProduct = new Product("New Product");
        Product savedProduct = new Product("New Product");
        savedProduct.setId(1L);

        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);

        // When
        Product result = productService.createProduct(newProduct);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("New Product");
        verify(productRepository, times(1)).save(newProduct);
    }

    @Test
    void shouldThrowExceptionWhenCreatingProductWithNullName() {
        // Given
        Product productWithNullName = new Product(null);

        // When & Then
        assertThatThrownBy(() -> productService.createProduct(productWithNullName))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Product name cannot be null or empty");

        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void shouldThrowExceptionWhenCreatingProductWithEmptyName() {
        // Given
        Product productWithEmptyName = new Product("");

        // When & Then
        assertThatThrownBy(() -> productService.createProduct(productWithEmptyName))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Product name cannot be null or empty");

        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void shouldThrowExceptionWhenCreatingProductWithBlankName() {
        // Given
        Product productWithBlankName = new Product("   ");

        // When & Then
        assertThatThrownBy(() -> productService.createProduct(productWithBlankName))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Product name cannot be null or empty");

        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void shouldThrowExceptionWhenCreatingNullProduct() {
        // When & Then
        assertThatThrownBy(() -> productService.createProduct(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Product cannot be null");

        verify(productRepository, never()).save(any(Product.class));
    }

}
