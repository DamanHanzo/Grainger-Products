package com.grainger.products.repository;

import com.grainger.products.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Product entity.
 * Spring Data JPA will automatically provide implementations for basic CRUD operations.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * Find a product by its exact name.
     *
     * @param name the product name
     * @return Optional containing the product if found
     */
    Optional<Product> findByName(String name);

    /**
     * Find all products ordered by creation date (newest first).
     *
     * @return List of products ordered by createdAt descending
     */
    List<Product> findAllByOrderByCreatedAtDesc();
}
