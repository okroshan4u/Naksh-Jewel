'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/types';
import { productsApi } from '@/lib/api/products';
import ProductCard from '@/components/products/ProductCard';
import Loading from '@/components/common/Loading';
import Button from '@/components/common/Button';
import styles from '../products/admin.module.css';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchProducts();
  }, [isAuthenticated, user, router]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productsApi.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    router.push(`/admin/products/edit/${product._id}`);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productsApi.deleteProduct(productId);
      setProducts(products.filter((p) => p._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  if (isLoading) {
    return <Loading fullscreen />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <p className={styles.subtitle}>Manage your products and inventory</p>
        </div>
        <Link href="/admin/products/add">
          <Button size="large">+ Add New Product</Button>
        </Link>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>📦</span>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{products.length}</h3>
            <p className={styles.statLabel}>Total Products</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>✅</span>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>
              {products.filter((p) => (p.stock || 0) > 0).length}
            </h3>
            <p className={styles.statLabel}>In Stock</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>⚠️</span>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>
              {products.filter((p) => (p.stock || 0) < 10 && (p.stock || 0) > 0).length}
            </h3>
            <p className={styles.statLabel}>Low Stock</p>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>All Products</h2>
        {products.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📦</span>
            <p className={styles.emptyText}>No products yet. Add your first product!</p>
            <Link href="/admin/products/add">
              <Button>Add Product</Button>
            </Link>
          </div>
        ) : (
          <div className={styles.productGrid}>
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isAdmin
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}