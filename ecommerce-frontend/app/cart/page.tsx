'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils/helper';
import CartItem from '@/components/cart/CartItem';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';
import styles from './cart.module.css';

export default function CartPage() {
  const router = useRouter();
  const { cart, isLoading, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const handleClearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return;

    try {
      await clearCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart');
    }
  };

  const handleCheckout = () => {
    alert('Checkout functionality coming soon!');
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return <Loading fullscreen />;
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Shopping Cart</h1>
        {!isEmpty && (
          <button onClick={handleClearCart} className={styles.clearButton}>
            Clear Cart
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className={styles.emptyCart}>
          <span className={styles.emptyIcon}>🛒</span>
          <h2 className={styles.emptyTitle}>Your cart is empty</h2>
          <p className={styles.emptyText}>
            Add some products to your cart to see them here!
          </p>
          <Button onClick={() => router.push('/products')}>
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.itemsList}>
            <div className={styles.itemsHeader}>
              <h2>Items ({cart.items.length})</h2>
            </div>
            {cart.items.map((item) => (
              <CartItem key={item.product._id} item={item} />
            ))}
          </div>

          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatCurrency(cart.totalAmount)}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span className={styles.freeShipping}>FREE</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Tax (estimated)</span>
              <span>{formatCurrency(cart.totalAmount * 0.1)}</span>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.totalRow}>
              <span>Total</span>
              <span className={styles.totalAmount}>
                {formatCurrency(cart.totalAmount * 1.1)}
              </span>
            </div>

            <Button onClick={handleCheckout} fullWidth size="large">
              Proceed to Checkout
            </Button>

            <button
              onClick={() => router.push('/products')}
              className={styles.continueButton}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}