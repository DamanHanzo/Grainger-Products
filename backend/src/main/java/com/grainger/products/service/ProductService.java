package com.grainger.products.service;

import com.grainger.products.model.Product;
import com.grainger.products.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service layer for Product business logic.
 * Handles validation and coordinates between controller and repository.
 */
@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;

    /**
     * Constructor injection for ProductRepository.
     * Spring will automatically inject the repository bean.
     *
     * @param productRepository the product repository
     */
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Retrieve all products from the database.
     *
     * @return List of all products
     */
    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    /**
     * Retrieve a product by its ID.
     *
     * @param id the product ID
     * @return Optional containing the product if found, empty otherwise
     */
    @Transactional(readOnly = true)
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    /**
     * Create a new product.
     * Validates that the product and its name are not null/empty.
     *
     * @param product the product to create
     * @return the saved product with generated ID
     * @throws IllegalArgumentException if product is null or name is invalid
     */
    public Product createProduct(Product product) {
        validateProduct(product);
        return productRepository.save(product);
    }

    /**
     * Validate that a product is not null and has a valid name.
     *
     * @param product the product to validate
     * @throws IllegalArgumentException if validation fails
     */
    private void validateProduct(Product product) {
        if (product == null) {
            throw new IllegalArgumentException("Product cannot be null");
        }
        validateProductName(product.getName());
    }

    /**
     * Validate that a product name is not null, empty, or blank.
     *
     * @param name the product name to validate
     * @throws IllegalArgumentException if validation fails
     */
    private void validateProductName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Product name cannot be null or empty");
        }
    }
}
