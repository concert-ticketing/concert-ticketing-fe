import React, { JSX } from 'react';

import styles from './button.module.css';

interface ButtonProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right' | 'center';
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
  // children가 없고 icon만 있는 경우 iconOnly 클래스 추가
  const hasChildren = children && React.Children.count(children) > 0;
  const iconOnly = !hasChildren && icon;

  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    disabled && styles.disabled,
    iconOnly && styles.iconOnly,
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

  // icon만 있는 경우 중앙에 배치
  if (iconOnly) {
    return (
      <button
        type={type}
        className={buttonClasses}
        onClick={handleClick}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
      >
        {renderIcon()}
      </button>
    );
  }

  // children이 있는 경우
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
    >
      {iconPosition === 'left' && renderIcon()}
      {hasChildren && <span className={styles.content}>{children}</span>}
      {iconPosition === 'right' && renderIcon()}
    </button>
  );
}
