import React, { JSX } from 'react';

import styles from './button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  icon,
  iconPosition = 'left',
}: ButtonProps): JSX.Element {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    if (onClick) {
      onClick(event);
    }
  };

  const renderIcon = (): JSX.Element | null => {
    if (loading) {
      return <span className={styles.loadingSpinner} />;
    }
    if (icon) {
      return <span className={styles.icon}>{icon}</span>;
    }
    return null;
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
    >
      {iconPosition === 'left' && renderIcon()}
      <span className={styles.content}>{children}</span>
      {iconPosition === 'right' && renderIcon()}
    </button>
  );
}
