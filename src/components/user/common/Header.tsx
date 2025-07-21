import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import styles from './Header.module.css';

export default function Header() {
  const router = useRouter();

  const path = router.asPath;
  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={styles.logoSearch}>
          <Link href='/'>concert-ticketing</Link>
          <div className={styles.searchBox}>
            <input type='text' placeholder='concert-ticketing' />
            <Link href='/search/result'>
              <button aria-label='검색'>
                <Image src='/search.png' alt='검색' width={20} height={20} />
              </button>
            </Link>
          </div>
        </div>
        <nav className={styles.navLinks}>
          <Link href='/login'>
            <div className={styles.navItem}>
              <Image src='/ico_header_login.png' alt='로그인' width={24} height={24} />
              <span>로그인</span>
            </div>
          </Link>
          <Link href='/signup'>
            <div className={styles.navItem}>
              <Image src='/ico_header_signup.png' alt='회원가입' width={24} height={24} />
              <span>회원가입</span>
            </div>
          </Link>
          <Link href='/mypage'>
            <div className={styles.navItem}>
              <Image
                src='/ico_header_mypage.png'
                alt='마이페이지'
                width={24}
                height={24}
              />
              <span>마이페이지</span>
            </div>
          </Link>
          <Link href='/contact'>
            <div className={styles.navItem}>
              <Image src='/ico_header_call.png' alt='고객센터' width={24} height={24} />
              <span>고객센터</span>
            </div>
          </Link>
          <Link href='/mypage/alarm'>
            <div className={styles.navItem}>
              <Image src='/alarm (1).png' alt='알림' width={24} height={24} />
              <span>알림</span>
            </div>
          </Link>
        </nav>
      </div>

      <div className={styles.menuBar}>
        <Link href='/' className={router.pathname === '/' ? styles.active : ''}>
          홈
        </Link>
        <Link
          href='/concert'
          className={path.startsWith('/concert') ? styles.active : ''}
        >
          콘서트
        </Link>
        <Link
          href='/region'
          className={router.pathname === '/region' ? styles.active : ''}
        >
          지역별
        </Link>
      </div>
    </header>
  );
}
