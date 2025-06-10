import React, { useState, useEffect } from 'react';

import { useThemeStore, initializeSystemThemeListener } from '@/core/themeStore';

import Sidebar from './Sidebar';
import ThemeToggle from '../ui/theme/ThemeToggle';
import styles from './adminLayout.module.css';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string | null;
}

interface IconComponentProps {
  children: React.ReactNode;
  isMobile?: boolean;
}

// 컴포넌트를 렌더링 외부로 이동
const IconComponent: React.FC<IconComponentProps> = ({ children, isMobile = false }) => (
  <svg
    className={isMobile ? styles.menuIconMobile : styles.menuIcon}
    viewBox='0 0 24 24'
    fill='currentColor'
  >
    {children}
  </svg>
);

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  useEffect(() => {
    // 테마 초기화
    initializeTheme();

    // 시스템 테마 변경 리스너 설정
    const cleanup = initializeSystemThemeListener();

    return cleanup;
  }, [initializeTheme]);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);

      // 모바일에서는 기본적으로 사이드바 닫기
      if (isMobileView) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getMainClasses = () => {
    if (isMobile) {
      return `${styles.main} ${styles.mobile}`;
    }
    return `${styles.main} ${sidebarOpen ? styles.desktop : styles.desktopClosed}`;
  };

  const renderMenuButton = () => {
    if (isMobile) {
      return (
        <button
          onClick={toggleSidebar}
          className={styles.menuButtonMobile}
          aria-label='메뉴 열기'
        >
          <IconComponent isMobile>
            {/* 햄버거 메뉴 아이콘 */}
            <path
              d='M4 6h16M4 12h16M4 18h16'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              fill='none'
            />
          </IconComponent>
        </button>
      );
    }

    return (
      <button
        onClick={toggleSidebar}
        className={styles.menuButtonDesktop}
        title={sidebarOpen ? '사이드바 접기' : '사이드바 펼치기'}
        aria-label={sidebarOpen ? '사이드바 접기' : '사이드바 펼치기'}
      >
        <IconComponent isMobile={false}>
          {sidebarOpen ? (
            /* 왼쪽 화살표 (닫기) */
            <>
              <path
                d='M11 19l-7-7 7-7'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                fill='none'
              />
              <path
                d='M20 12H4'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                fill='none'
              />
            </>
          ) : (
            /* 오른쪽 화살표 (열기) */
            <>
              <path
                d='M13 5l7 7-7 7'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                fill='none'
              />
              <path
                d='M4 12h16'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                fill='none'
              />
            </>
          )}
        </IconComponent>
      </button>
    );
  };

  return (
    <div className={styles.container}>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} isMobile={isMobile} />

      {/* 모바일에서 사이드바가 열려있을 때 오버레이 */}
      {isMobile && sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={toggleSidebar}
          aria-label='사이드바 닫기'
        />
      )}

      <main className={getMainClasses()}>
        {/* 헤더 */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            {renderMenuButton()}

            <h1 className={styles.title}>{title}</h1>
          </div>

          {/* 헤더 우측 */}
          <div className={styles.headerRight}>
            {/* 테마 토글 */}
            <ThemeToggle size='small' showLabel={!isMobile} />

            {/* 사용자 메뉴 */}
            <button
              className={styles.userMenu}
              title='사용자 메뉴'
              aria-label='사용자 메뉴'
            >
              👤
            </button>
          </div>
        </header>

        {/* 콘텐츠 영역 */}
        <div className={isMobile ? styles.contentMobile : styles.content}>{children}</div>
      </main>
    </div>
  );
}
