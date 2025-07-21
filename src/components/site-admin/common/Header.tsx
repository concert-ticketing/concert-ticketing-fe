import React from 'react';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>concert-ticketing</div>
      <div className={styles.rightMenu}>
        <span>홍길동님</span> | <a href='/logout'>로그아웃</a>
      </div>
    </header>
  );
};

export default Header;
