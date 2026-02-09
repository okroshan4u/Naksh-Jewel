import React from 'react';
import styles from './Loading.module.css';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  fullscreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ size = 'medium', fullscreen = false }) => {
  if (fullscreen) {
    return (
      <div className={styles.fullscreen}>
        <div className={`${styles.spinner} ${styles[size]}`}></div>
      </div>
    );
  }

  return <div className={`${styles.spinner} ${styles[size]}`}></div>;
};

export default Loading;