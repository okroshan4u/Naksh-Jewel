'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CartItem as CartItemType } from '@/types';
import { formatCurrency, getImageUrl } from '@/lib/utils/helper';
import { useCart } from '@/context/CartContext';
import styles from './CartItem.module.css';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      setIsUpdating(true);
      await updateQuantity(item.product._id, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm('Remove this item from cart?')) return;

    try {
      await removeFromCart(item.product._id);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  return (
    <div className={styles.cartItem}>
      <div className={styles.imageContainer}>
        <Image
          src={getImageUrl(item.product.image)}
          alt={item.product.name}
          width={100}
          height={100}
          className={styles.image}
          unoptimized
        />
      </div>

      <div className={styles.details}>
        <h3 className={styles.name}>{item.product.name}</h3>
        {item.product.description && (
          <p className={styles.description}>{item.product.description}</p>
        )}
        <div className={styles.price}>
          {formatCurrency(item.product.price)}
          <span className={styles.priceLabel}>each</span>
        </div>
      </div>

      <div className={styles.actions}>
        <div className={styles.quantityControl}>
          <button
            className={styles.quantityButton}
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={isUpdating || item.quantity <= 1}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className={styles.quantity}>{item.quantity}</span>
          <button
            className={styles.quantityButton}
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={isUpdating}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <div className={styles.subtotal}>
          {formatCurrency(item.product.price * item.quantity)}
        </div>

        <button
          className={styles.removeButton}
          onClick={handleRemove}
          aria-label="Remove item"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default CartItem;