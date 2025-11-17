package com.grainger.products.repository;

import com.grainger.products.model.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests for ProductRepository.
 * Uses @DataJpaTest which provides an in-memory H2 database for testing.
 */
@DataJpaTest
@ActiveProfiles("test")
class ProductRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ProductRepository productRepository;

    @BeforeEach
    void setUp() {
        // Clean database before each test
        productRepository.deleteAll();
    }

    @Test
    void shouldSaveProduct() {
        // Given
        Product product = new Product("Test Product");

        // When
        Product savedProduct = productRepository.save(product);

        // Then
        assertThat(savedProduct.getId()).isNotNull();
        assertThat(savedProduct.getName()).isEqualTo("Test Product");
        assertThat(savedProduct.getCreatedAt()).isNotNull();
        assertThat(savedProduct.getUpdatedAt()).isNotNull();
    }

    @Test
    void shouldFindProductById() {
        // Given
        Product product = new Product("Test Product");
        Product savedProduct = entityManager.persistAndFlush(product);

        // When
        Optional<Product> foundProduct = productRepository.findById(savedProduct.getId());

        // Then
        assertThat(foundProduct).isPresent();
        assertThat(foundProduct.get().getName()).isEqualTo("Test Product");
    }

    @Test
    void shouldReturnEmptyWhenProductNotFoundById() {
        // When
        Optional<Product> foundProduct = productRepository.findById(999L);

        // Then
        assertThat(foundProduct).isEmpty();
    }

    @Test
    void shouldFindAllProducts() {
        // Given
        entityManager.persist(new Product("Product 1"));
        entityManager.persist(new Product("Product 2"));
        entityManager.persist(new Product("Product 3"));
        entityManager.flush();

        // When
        List<Product> products = productRepository.findAll();

        // Then
        assertThat(products).hasSize(3);
    }

    @Test
    void shouldReturnEmptyListWhenNoProducts() {
        // When
        List<Product> products = productRepository.findAll();

        // Then
        assertThat(products).isEmpty();
    }

    @Test
    void shouldFindProductByName() {
        // Given
        entityManager.persist(new Product("Unique Product"));
        entityManager.flush();

        // When
        Optional<Product> foundProduct = productRepository.findByName("Unique Product");

        // Then
        assertThat(foundProduct).isPresent();
        assertThat(foundProduct.get().getName()).isEqualTo("Unique Product");
    }

    @Test
    void shouldReturnEmptyWhenProductNotFoundByName() {
        // When
        Optional<Product> foundProduct = productRepository.findByName("Non-existent Product");

        // Then
        assertThat(foundProduct).isEmpty();
    }

    @Test
    void shouldFindAllProductsOrderedByCreatedAtDesc() throws InterruptedException {
        // Given
        Product product1 = new Product("First Product");
        entityManager.persist(product1);
        entityManager.flush();

        // Small delay to ensure different timestamps
        Thread.sleep(10);

        Product product2 = new Product("Second Product");
        entityManager.persist(product2);
        entityManager.flush();

        Thread.sleep(10);

        Product product3 = new Product("Third Product");
        entityManager.persist(product3);
        entityManager.flush();

        // When
        List<Product> products = productRepository.findAllByOrderByCreatedAtDesc();

        // Then
        assertThat(products).hasSize(3);
        assertThat(products.get(0).getName()).isEqualTo("Third Product");  // Newest first
        assertThat(products.get(1).getName()).isEqualTo("Second Product");
        assertThat(products.get(2).getName()).isEqualTo("First Product");  // Oldest last
    }

    @Test
    void shouldDeleteProduct() {
        // Given
        Product product = new Product("Product to Delete");
        Product savedProduct = entityManager.persistAndFlush(product);
        Long productId = savedProduct.getId();

        // When
        productRepository.deleteById(productId);

        // Then
        Optional<Product> deletedProduct = productRepository.findById(productId);
        assertThat(deletedProduct).isEmpty();
    }

    @Test
    void shouldUpdateProduct() {
        // Given
        Product product = new Product("Original Name");
        Product savedProduct = entityManager.persistAndFlush(product);
        entityManager.clear(); // Clear the persistence context

        // When
        savedProduct.setName("Updated Name");
        Product updatedProduct = productRepository.save(savedProduct);

        // Then
        assertThat(updatedProduct.getName()).isEqualTo("Updated Name");
        assertThat(updatedProduct.getUpdatedAt()).isAfter(updatedProduct.getCreatedAt());
    }

    @Test
    void shouldCountProducts() {
        // Given
        entityManager.persist(new Product("Product 1"));
        entityManager.persist(new Product("Product 2"));
        entityManager.flush();

        // When
        long count = productRepository.count();

        // Then
        assertThat(count).isEqualTo(2);
    }

    @Test
    void shouldCheckIfProductExists() {
        // Given
        Product product = new Product("Existing Product");
        Product savedProduct = entityManager.persistAndFlush(product);

        // When
        boolean exists = productRepository.existsById(savedProduct.getId());
        boolean notExists = productRepository.existsById(999L);

        // Then
        assertThat(exists).isTrue();
        assertThat(notExists).isFalse();
    }
}
