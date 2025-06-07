import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import { sidebarIcon } from '@public/icons';

import Sidebar from './Sidebar';
import styles from './adminLayout.module.css';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title = '관리자' }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // 클라이언트 사이드에서만 window 객체 접근
  useEffect(() => {
    const checkMobile = (): void => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // 모바일에서는 기본적으로 사이드바를 닫힌 상태로
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    // 초기 체크
    checkMobile();

    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const toggleSidebar = (): void => {
    setSidebarOpen(!sidebarOpen);
  };

  // ESC 키로 모바일에서 사이드바 닫기
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isMobile, sidebarOpen]);

  // 모바일에서 사이드바가 열려있을 때 body 스크롤 방지
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, sidebarOpen]);

  return (
    <div className={styles.container}>
      {/* 사이드바 */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />

      {/* 메인 콘텐츠 영역 */}
      <div
        className={`${styles.mainContent} ${
          sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        {/* 상단 헤더 */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <button
                onClick={toggleSidebar}
                className={styles.toggleButton}
                title={sidebarOpen ? '사이드바 숨기기' : '사이드바 표시'}
                aria-label={sidebarOpen ? '사이드바 숨기기' : '사이드바 표시'}
              >
                <Image
                  src={sidebarIcon}
                  alt="사이드바 토글"
                  width={20}
                  height={20}
                  style={{
                    filter: 'invert(0.4)',
                  }}
                />
              </button>

              <h1 className={styles.title}>
                {title}
              </h1>
            </div>

            {/* 사용자 정보 영역 */}
            <div className={styles.headerRight}>
              {/* 알림 */}
              <button
                className={styles.notificationButton}
                title="알림"
                aria-label="알림"
              >
                <div className={styles.notificationIcon} />
                {/* 알림 뱃지 */}
                <div className={styles.notificationBadge} />
              </button>

              {/* 사용자 프로필 */}
              <div className={styles.userProfile}>
                <div className={styles.userAvatar}>
                  관
                </div>
                <div className={styles.userInfo}>
                  <div className={styles.userName}>
                    관리자
                  </div>
                  <div className={styles.userEmail}>
                    admin@venue.com
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 메인 콘텐츠 */}
        <main className={styles.main}>
          {children}
        </main>

        {/* 푸터 */}
        <footer className={styles.footer}>
          <p className={styles.footerText}>
            © 2025 Venue Management System. All rights reserved.
          </p>
        </footer>
      </div>

      {/* 사이드바 오버레이 (모바일) */}
      {sidebarOpen && isMobile && (
        <div
          className={styles.overlay}
          onClick={toggleSidebar}
          aria-label="사이드바 닫기"
        />
      )}
    </div>
  );
}