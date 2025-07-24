/**
 * ProductGenerator Class
 * 
 * This class is responsible for generating realistic product data for e-commerce
 * and retail applications. It creates products with varied categories, pricing,
 * and attributes to simulate a diverse product catalog.
 * 
 * Features:
 * - Realistic product names and descriptions
 * - Multiple product categories
 * - Dynamic pricing with configurable ranges
 * - Product tags for categorization
 * - Stock status simulation
 * - Category-specific product generation
 */

import { Product } from '../types';
import { DataGenerationUtils } from '../utils/DataGenerationUtils';

export class ProductGenerator {
  /**
   * Product categories for realistic e-commerce data
   * 
   * These categories represent common product types found in online stores.
   * Each category helps organize products and provides context for the
   * generated product data.
   */
  private categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports',
    'Beauty',
    'Toys',
    'Automotive',
  ];

  /**
   * Product tags for additional categorization and marketing
   * 
   * These tags help describe product attributes and can be used for
   * filtering, search, and promotional purposes. Products can have
   * multiple tags to represent various characteristics.
   */
  private tags = [
    'new',
    'popular',
    'trending',
    'limited',
    'sale',
    'premium',
    'eco-friendly',
    'handmade',
  ];

  /**
   * Generates a single product with realistic data
   * 
   * This method creates a complete product object using faker.js to generate
   * realistic product names, descriptions, and pricing. It randomly assigns
   * categories, tags, and stock status to create varied product data.
   * 
   * @returns Product - A complete product object with all required fields
   */
  generateProduct(): Product {
    const productData = DataGenerationUtils.generateProductData();
    return {
      id: DataGenerationUtils.generateId(),
      name: productData.name,
      description: productData.description,
      price: productData.price,
      category: DataGenerationUtils.generateRandomElement(this.categories),
      inStock: DataGenerationUtils.generateRandomBoolean(),
      tags: DataGenerationUtils.generateRandomSubset(this.tags, DataGenerationUtils.generateRandomInt(1, 4)),
      createdAt: DataGenerationUtils.generatePastDate(),
    };
  }

  /**
   * Generates multiple products with varied data
   * 
   * This method creates an array of products, each with unique characteristics.
   * It's useful for generating product catalogs or testing e-commerce functionality.
   * 
   * @param count - Number of products to generate
   * @returns Product[] - Array of generated products
   */
  generateProducts(count: number): Product[] {
    return Array.from({ length: count }, () => this.generateProduct());
  }

  /**
   * Generates products within a specific category
   * 
   * This method creates products that all belong to the same category,
   * which is useful for testing category-specific functionality or
   * generating focused product catalogs.
   * 
   * @param category - The category to assign to all generated products
   * @param count - Number of products to generate
   * @returns Product[] - Array of products in the specified category
   */
  generateProductsByCategory(category: string, count: number): Product[] {
    return Array.from({ length: count }, () => ({
      ...this.generateProduct(),
      category,
    }));
  }

  /**
   * Generates products within a specific price range
   * 
   * This method creates products with prices that fall within the specified
   * range. It's useful for testing price filtering, budget constraints,
   * or generating products for specific market segments.
   * 
   * @param minPrice - Minimum price for generated products
   * @param maxPrice - Maximum price for generated products
   * @param count - Number of products to generate
   * @returns Product[] - Array of products within the specified price range
   */
  generateProductsByPriceRange(minPrice: number, maxPrice: number, count: number): Product[] {
    return Array.from({ length: count }, () => {
      const product = this.generateProduct();
      // Override the default price with one within the specified range
      product.price = DataGenerationUtils.generateRandomFloat(minPrice, maxPrice, 2);
      return product;
    });
  }
} 