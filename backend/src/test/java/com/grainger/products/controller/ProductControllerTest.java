package com.grainger.products.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.grainger.products.model.Product;
import com.grainger.products.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Controller tests for ProductController using MockMvc.
 * Tests the REST API endpoints with mocked service layer.
 *
 * @WebMvcTest loads only the web layer (controllers, filters, etc.)
 * without loading the full application context, making tests faster.
 */
@WebMvcTest({ProductController.class, GlobalExceptionHandler.class})
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    // Tests for GET /api/products

    @Test
    void shouldGetAllProducts() throws Exception {
        // Given
        Product product1 = createProduct(1L, "Product 1");
        Product product2 = createProduct(2L, "Product 2");
        List<Product> products = Arrays.asList(product1, product2);

        when(productService.getAllProducts()).thenReturn(products);

        // When & Then
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].name", is("Product 1")))
                .andExpect(jsonPath("$[1].id", is(2)))
                .andExpect(jsonPath("$[1].name", is("Product 2")));

        verify(productService, times(1)).getAllProducts();
    }

    @Test
    void shouldReturnEmptyListWhenNoProducts() throws Exception {
        // Given
        when(productService.getAllProducts()).thenReturn(Arrays.asList());

        // When & Then
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));

        verify(productService, times(1)).getAllProducts();
    }

    // Tests for GET /api/products/{id}

    @Test
    void shouldGetProductById() throws Exception {
        // Given
        Product product = createProduct(1L, "Test Product");
        when(productService.getProductById(1L)).thenReturn(Optional.of(product));

        // When & Then
        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Test Product")));

        verify(productService, times(1)).getProductById(1L);
    }

    @Test
    void shouldReturn404WhenProductNotFound() throws Exception {
        // Given
        when(productService.getProductById(999L)).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/api/products/999"))
                .andExpect(status().isNotFound());

        verify(productService, times(1)).getProductById(999L);
    }

    // Tests for POST /api/products

    @Test
    void shouldCreateProduct() throws Exception {
        // Given
        Product newProduct = new Product("New Product");
        Product savedProduct = createProduct(1L, "New Product");

        when(productService.createProduct(any(Product.class))).thenReturn(savedProduct);

        // When & Then
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newProduct)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("New Product")));

        verify(productService, times(1)).createProduct(any(Product.class));
    }

    @Test
    void shouldReturn400WhenCreatingProductWithInvalidData() throws Exception {
        // Given
        Product invalidProduct = new Product("");

        when(productService.createProduct(any(Product.class)))
                .thenThrow(new IllegalArgumentException("Product name cannot be null or empty"));

        // When & Then
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidProduct)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", is("Product name cannot be null or empty")));

        verify(productService, times(1)).createProduct(any(Product.class));
    }

    @Test
    void shouldReturn400WhenCreatingProductWithNullName() throws Exception {
        // Given
        String jsonWithNullName = "{\"name\": null}";

        when(productService.createProduct(any(Product.class)))
                .thenThrow(new IllegalArgumentException("Product name cannot be null or empty"));

        // When & Then
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonWithNullName))
                .andExpect(status().isBadRequest());
    }

    // Helper method to create a product with ID
    private Product createProduct(Long id, String name) {
        Product product = new Product(name);
        product.setId(id);
        return product;
    }
}
