import React, { useState, useEffect } from 'react';

import { useThemeStore, initializeSystemThemeListener } from '@/core/themeStore';
import { useSidebar } from '@/hooks/useSidebar';

import Sidebar from './Sidebar';
import ThemeToggle from '../ui/theme/ThemeToggle';
import styles from './adminLayout.module.css';
import { LeftArrowIcon, RightArrowIcon } from '../ui/icons';

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
  // 사이드바 상태 관리 (로컬 스토리지 포함)
  const {
    isOpen: sidebarOpen,
    isLoaded,
    toggleSidebar,
    setSidebarOpen,
  } = useSidebar(true);

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
  }, [setSidebarOpen]);

  // 사이드바 토글 (모바일과 데스크톱 구분 처리)
  const handleSidebarToggle = () => {
    if (isMobile) {
      // 모바일에서는 임시로만 열고 닫기 (로컬 스토리지에 저장하지 않음)
      setSidebarOpen(!sidebarOpen);
    } else {
      // 데스크톱에서는 로컬 스토리지에 저장
      toggleSidebar();
    }
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
          onClick={handleSidebarToggle}
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
        onClick={handleSidebarToggle}
        className={styles.menuButtonDesktop}
        title={sidebarOpen ? '사이드바 접기' : '사이드바 펼치기'}
        aria-label={sidebarOpen ? '사이드바 접기' : '사이드바 펼치기'}
      >
        <IconComponent isMobile={false}>
          {sidebarOpen ? (
            // 왼쪽 화살표 (닫기)
            <LeftArrowIcon />
          ) : (
            // 오른쪽 화살표 (열기)
            <RightArrowIcon />
          )}
        </IconComponent>
      </button>
    );
  };

  // localStorage 로딩이 완료되지 않은 경우 깜빡임 방지
  if (!isLoaded) {
    return (
      <div className={styles.container}>
        <div
          style={{
            width: '280px',
            height: '100vh',
            backgroundColor: 'var(--bg-primary)',
            borderRight: '1px solid var(--border-primary)',
          }}
        />
        <main className={`${styles.main} ${styles.desktop}`}>
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <div style={{ width: '24px', height: '24px' }} />
              <h1 className={styles.title}>{title}</h1>
            </div>
            <div className={styles.headerRight}>
              <ThemeToggle size='small' showLabel={!isMobile} />
              <button className={styles.userMenu} aria-label='사용자 메뉴'>
                👤
              </button>
            </div>
          </header>
          <div className={isMobile ? styles.contentMobile : styles.content}>
            {children}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar isOpen={sidebarOpen} onToggle={handleSidebarToggle} isMobile={isMobile} />

      {/* 모바일에서 사이드바가 열려있을 때 오버레이 */}
      {isMobile && sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={handleSidebarToggle}
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
