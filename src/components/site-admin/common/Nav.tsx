import React from 'react';
import Link from 'next/link';
import styles from './Nav.module.css';

const Nav = () => {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <Link href='/site-admin/banner'>배너 관리</Link>
        </li>
        <li>
          <Link href='/site-admin/notice'>공지사항</Link>
        </li>
        <li>
          <Link href='/site-admin/faq'>faq</Link>
        </li>
        <li>
          <Link href='/site-admin/inquiry'>1:1 문의내역</Link>
        </li>
        <li>
          <Link href='/site-admin/management/user'>유저관리</Link>
        </li>
        <li>
          <Link href='/site-admin/management/admin'>콘서트관리자</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
