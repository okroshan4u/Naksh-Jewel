'use client';

import React, { useEffect, useState } from 'react';
import { Product } from '@/types';
import { productsApi } from '@/lib/api/products';
import ProductCard from '@/components/products/ProductCard';
import Loading from '@/components/common/Loading';
import styles from './products.module.css';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await productsApi.getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button onClick={fetchProducts} className={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>All Products</h1>
        <p className={styles.subtitle}>
          Explore our complete collection of {products.length} amazing products
        </p>
      </div>

      {products.length === 0 ? (
        <div className={styles.emptyContainer}>
          <span className={styles.emptyIcon}>📦</span>
          <h2 className={styles.emptyTitle}>No Products Available</h2>
          <p className={styles.emptyText}>
            Check back later for new arrivals!
          </p>
        </div>
      ) : (
        <div className={styles.productGrid}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}