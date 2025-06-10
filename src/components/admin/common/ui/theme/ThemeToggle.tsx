import React from 'react';

import { useThemeStore } from '@/core/themeStore';

import styles from './theme.module.css';

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export default function ThemeToggle({
  size = 'medium',
  showLabel = true,
}: ThemeToggleProps) {
  const { toggleTheme, isDark } = useThemeStore();

  const sizeClasses = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  };

  return (
    <div className={`${styles.container} ${sizeClasses[size]}`}>
      {showLabel && (
        <span className={styles.label}>
          {isDark ? '🌙' : '☀️'} {isDark ? '다크모드' : '라이트모드'}
        </span>
      )}

      <button
        onClick={toggleTheme}
        className={`${styles.toggle} ${isDark ? styles.dark : styles.light}`}
        aria-label={`${isDark ? '라이트모드' : '다크모드'}로 변경`}
        title={`${isDark ? '라이트모드' : '다크모드'}로 변경`}
      >
        <div
          className={`${styles.slider} ${isDark ? styles.sliderDark : styles.sliderLight}`}
        >
          <div className={styles.icon}>{isDark ? '🌙' : '☀️'}</div>
        </div>

        <div className={styles.track}>
          <div className={styles.trackIcon}>
            <span className={styles.lightIcon}>☀️</span>
            <span className={styles.darkIcon}>🌙</span>
          </div>
        </div>
      </button>
    </div>
  );
}
