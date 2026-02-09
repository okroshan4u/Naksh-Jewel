'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { formatCurrency, getImageUrl } from '@/lib/utils/helper';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Button from '../common/Button';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  isAdmin?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  isAdmin = false,
}) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    try {
      setIsLoading(true);
      await addToCart(product._id);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={getImageUrl(product.image) || '/images/placeholder.jpg'}
          alt={product.name}
          width={300}
          height={300}
          className={styles.image}
          unoptimized
        />
        {product.stock !== undefined && product.stock < 10 && product.stock > 0 && (
          <span className={styles.lowStock}>Only {product.stock} left!</span>
        )}
        {product.stock === 0 && <span className={styles.outOfStock}>Out of Stock</span>}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{product.name}</h3>
        {product.description && (
          <p className={styles.description}>{product.description}</p>
        )}
        {product.category && (
          <span className={styles.category}>{product.category}</span>
        )}
        <div className={styles.footer}>
          <span className={styles.price}>{formatCurrency(product.price)}</span>

          {isAdmin ? (
            <div className={styles.adminActions}>
              <button
                onClick={() => onEdit?.(product)}
                className={styles.editButton}
                aria-label="Edit product"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete?.(product._id)}
                className={styles.deleteButton}
                aria-label="Delete product"
              >
                🗑️
              </button>
            </div>
          ) : (
            <Button
              onClick={handleAddToCart}
              isLoading={isLoading}
              disabled={product.stock === 0}
              size="small"
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;