'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🛍️</span>
          <span className={styles.logoText}>ShopHub</span>
        </Link>

        <div className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
          <Link
            href="/"
            className={`${styles.navLink} ${isActive('/') ? styles.activeLink : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/products"
            className={`${styles.navLink} ${isActive('/products') ? styles.activeLink : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Products
          </Link>

          {isAuthenticated && user?.role === 'admin' && (
            <Link
              href="/admin"
              className={`${styles.navLink} ${pathname.startsWith('/admin') ? styles.activeLink : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
          )}
        </div>

        <div className={styles.navActions}>
          {isAuthenticated ? (
            <>
              <Link href="/cart" className={styles.cartButton}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {itemCount > 0 && <span className={styles.cartBadge}>{itemCount}</span>}
              </Link>

              <div className={styles.userMenu}>
                <button className={styles.userButton}>
                  <span className={styles.userIcon}>
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                  <span className={styles.userName}>{user?.name}</span>
                </button>
                <div className={styles.dropdown}>
                  <button onClick={handleLogout} className={styles.dropdownItem}>
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.authButtons}>
              <Link href="/auth/login" className={styles.loginButton}>
                Login
              </Link>
              <Link href="/auth/signup" className={styles.signupButton}>
                Sign Up
              </Link>
            </div>
          )}

          <button
            className={styles.menuToggle}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={styles.menuBar}></span>
            <span className={styles.menuBar}></span>
            <span className={styles.menuBar}></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;