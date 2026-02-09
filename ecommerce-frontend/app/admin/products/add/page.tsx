'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { productsApi } from '@/lib/api/products';
import { getErrorMessage } from '@/lib/utils/helper';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import styles from './product-form.module.css';

export default function AddProductPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, image: 'Please select an image file' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: 'Image size should be less than 5MB' }));
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Please enter a valid stock quantity';
    }

    if (!imageFile) {
      newErrors.image = 'Product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    const productFormData = new FormData();
    productFormData.append('name', formData.name);
    productFormData.append('description', formData.description);
    productFormData.append('price', formData.price);
    productFormData.append('category', formData.category);
    productFormData.append('stock', formData.stock);
    if (imageFile) {
      productFormData.append('image', imageFile);
    }

    try {
      setIsLoading(true);
      await productsApi.createProduct(productFormData);
      router.push('/admin');
    } catch (error: unknown) {
      setApiError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Add New Product</h1>
          <p className={styles.subtitle}>Create a new product listing</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {apiError && (
            <div className={styles.alert}>
              <span className={styles.alertIcon}>⚠️</span>
              {apiError}
            </div>
          )}

          <div className={styles.imageUpload}>
            <label className={styles.imageLabel}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <span className={styles.uploadIcon}>📷</span>
                  <span>Click to upload product image</span>
                  <span className={styles.uploadHint}>PNG, JPG up to 5MB</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.imageInput}
              />
            </label>
            {errors.image && <span className={styles.error}>{errors.image}</span>}
          </div>

          <div className={styles.row}>
            <Input
              type="text"
              name="name"
              label="Product Name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              fullWidth
              required
            />
          </div>

          <div className={styles.row}>
            <label className={styles.label}>
              Description
              <textarea
                name="description"
                placeholder="Enter product description"
                value={formData.description}
                onChange={handleChange}
                className={styles.textarea}
                rows={4}
              />
            </label>
          </div>

          <div className={styles.row}>
            <Input
              type="number"
              name="price"
              label="Price"
              placeholder="0.00"
              value={formData.price}
              onChange={handleChange}
              error={errors.price}
              step="0.01"
              min="0"
              fullWidth
              required
            />
            <Input
              type="number"
              name="stock"
              label="Stock Quantity"
              placeholder="0"
              value={formData.stock}
              onChange={handleChange}
              error={errors.stock}
              min="0"
              fullWidth
              required
            />
          </div>

          <div className={styles.row}>
            <Input
              type="text"
              name="category"
              label="Category"
              placeholder="e.g., Electronics, Clothing"
              value={formData.category}
              onChange={handleChange}
              fullWidth
            />
          </div>

          <div className={styles.actions}>
            <Button type="button" variant="outline" onClick={() => router.push('/admin')}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
              Add Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}