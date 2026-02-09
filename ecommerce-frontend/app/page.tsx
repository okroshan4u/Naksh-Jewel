'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { productsApi } from '@/lib/api/products';
import ProductCard from '@/components/products/ProductCard';
import Loading from '@/components/common/Loading';
import Button from '@/components/common/Button';
import styles from './page.module.css';

export default function HomePage() {
  const router = useRouter();
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
      const data = await productsApi.getAllProducts(1, 8);
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Discover Amazing Products
            <span className={styles.gradient}> At Great Prices</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Shop the latest trends and must-have items. Quality products, unbeatable prices.
          </p>
          <div className={styles.heroActions}>
            <Button size="large" onClick={() => router.push('/products')}>
              Shop Now
            </Button>
            <Button variant="outline" size="large" onClick={() => router.push('/products')}>
              Browse Products
            </Button>
          </div>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.floatingCard}>
            <span className={styles.emoji}>🛍️</span>
          </div>
          <div className={styles.floatingCard} style={{ animationDelay: '0.2s' }}>
            <span className={styles.emoji}>💳</span>
          </div>
          <div className={styles.floatingCard} style={{ animationDelay: '0.4s' }}>
            <span className={styles.emoji}>🎁</span>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Featured Products</h2>
          <p className={styles.sectionSubtitle}>Check out our trending items</p>
        </div>

        {isLoading ? (
          <div className={styles.loadingContainer}>
            <Loading size="large" />
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>{error}</p>
            <Button onClick={fetchProducts}>Try Again</Button>
          </div>
        ) : products.length === 0 ? (
          <div className={styles.emptyContainer}>
            <span className={styles.emptyIcon}>📦</span>
            <p className={styles.emptyMessage}>No products available yet</p>
          </div>
        ) : (
          <>
            <div className={styles.productGrid}>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div className={styles.viewAllContainer}>
              <Button variant="outline" onClick={() => router.push('/products')}>
                View All Products →
              </Button>
            </div>
          </>
        )}
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>🚚</span>
          <h3 className={styles.featureTitle}>Fast Delivery</h3>
          <p className={styles.featureText}>Get your orders delivered quickly</p>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>🔒</span>
          <h3 className={styles.featureTitle}>Secure Payment</h3>
          <p className={styles.featureText}>Your transactions are safe with us</p>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>💯</span>
          <h3 className={styles.featureTitle}>Quality Products</h3>
          <p className={styles.featureText}>We ensure the best quality items</p>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>🎧</span>
          <h3 className={styles.featureTitle}>24/7 Support</h3>
          <p className={styles.featureText}>We're here to help anytime</p>
        </div>
      </section>
    </div>
  );
}