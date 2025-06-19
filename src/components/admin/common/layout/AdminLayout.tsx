import React, { useState, useEffect } from 'react';

import { useThemeStore, initializeSystemThemeListener } from '@/core/themeStore';
import { useSidebar } from '@/hooks/useSidebar';

import Sidebar from './Sidebar';
import ThemeToggle from '../ui/theme/ThemeToggle';
import { Icons } from '../ui/Icons';
import styles from './adminLayout.module.css';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string | null;
}

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

  // 라이트모드, 다크모드 감지 클린업 함수
  useEffect(() => {
    // 테마 초기화
    initializeTheme();

    return initializeSystemThemeListener();
  }, [initializeTheme]);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      const wasMobile = isMobile;
      setIsMobile(isMobileView);

      // 데스크톱에서 모바일로 전환될 때만 사이드바 닫기
      if (!wasMobile && isMobileView && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobile, sidebarOpen, setSidebarOpen]);

  // 사이드바 토글 (모바일과 데스크톱 구분 처리)
  const handleSidebarToggle = (e?: React.MouseEvent) => {
    // 이벤트 버블링 방지
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

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
          type='button'
          onClick={handleSidebarToggle}
          className={styles.menuButtonMobile}
          aria-label='메뉴 열기'
        >
          <Icons.MoreVertical className={styles.menuIconMobile} />
        </button>
      );
    }

    return (
      <button
        type='button'
        onClick={handleSidebarToggle}
        className={styles.menuButtonDesktop}
        title={sidebarOpen ? '사이드바 접기' : '사이드바 펼치기'}
        aria-label={sidebarOpen ? '사이드바 접기' : '사이드바 펼치기'}
      >
        {sidebarOpen ? (
          <Icons.ArrowLeft className={styles.menuIcon} />
        ) : (
          <Icons.ArrowRight className={styles.menuIcon} />
        )}
      </button>
    );
  };

  const renderUserMenu = () => (
    <button
      type='button'
      className={styles.userMenu}
      title='사용자 메뉴'
      aria-label='사용자 메뉴'
    >
      <Icons.User size={isMobile ? 14 : 16} />
    </button>
  );

  // localStorage 로딩이 완료되지 않은 경우 깜빡임 방지
  if (!isLoaded) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSidebar} />
        <main className={`${styles.main} ${styles.desktop}`}>
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.loadingButton} />
              <h1 className={styles.title}>{title}</h1>
            </div>
            <div className={styles.headerRight}>
              <div className={styles.loadingToggle} />
              <div className={styles.loadingUser} />
            </div>
          </header>
          <div className={styles.content}>
            <div className={styles.loadingContent}>
              <Icons.Loading className={styles.loadingIcon} />
              <span>로딩 중...</span>
            </div>
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
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSidebarOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              e.stopPropagation();
              setSidebarOpen(false);
            }
          }}
          role='button'
          tabIndex={0}
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
            {renderUserMenu()}
          </div>
        </header>

        {/* 콘텐츠 영역 */}
        <div className={isMobile ? styles.contentMobile : styles.content}>{children}</div>
      </main>
    </div>
  );
}
