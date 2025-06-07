import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: number;
  subItems?: MenuItem[];
}

export default function Sidebar({ isOpen, onToggle, isMobile = false }: SidebarProps) {
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>(['venues']);

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: '대시보드',
      href: '/admin',
      icon: '📊',
    },
    {
      id: 'venues',
      label: '콘서트장 관리',
      href: '/admin/venues',
      icon: '🎪',
      badge: 5,
      subItems: [
        {
          id: 'venues-list',
          label: '내 콘서트장',
          href: '/admin/venues',
          icon: '📋',
        },
        {
          id: 'venues-create',
          label: '새 콘서트장',
          href: '/admin/venues/create',
          icon: '➕',
        },
        {
          id: 'venues-templates',
          label: '템플릿',
          href: '/admin/venues/templates',
          icon: '📝',
        },
      ],
    },
    {
      id: 'editor',
      label: '에디터',
      href: '/admin/editor',
      icon: '🎨',
    },
    {
      id: 'events',
      label: '이벤트 관리',
      href: '/admin/events',
      icon: '🎵',
      subItems: [
        {
          id: 'events-list',
          label: '이벤트 목록',
          href: '/admin/events',
          icon: '📅',
        },
        {
          id: 'events-calendar',
          label: '캘린더',
          href: '/admin/events/calendar',
          icon: '🗓️',
        },
      ],
    },
    {
      id: 'analytics',
      label: '분석',
      href: '/admin/analytics',
      icon: '📈',
      subItems: [
        {
          id: 'analytics-overview',
          label: '개요',
          href: '/admin/analytics',
          icon: '📊',
        },
        {
          id: 'analytics-reports',
          label: '리포트',
          href: '/admin/analytics/reports',
          icon: '📋',
        },
      ],
    },
    {
      id: 'settings',
      label: '설정',
      href: '/admin/settings',
      icon: '⚙️',
      subItems: [
        {
          id: 'settings-general',
          label: '일반 설정',
          href: '/admin/settings',
          icon: '🔧',
        },
        {
          id: 'settings-users',
          label: '사용자 관리',
          href: '/admin/settings/users',
          icon: '👥',
        },
        {
          id: 'settings-permissions',
          label: '권한 관리',
          href: '/admin/settings/permissions',
          icon: '🔒',
        },
      ],
    },
  ];

  const toggleExpand = (itemId: string): void => {
    setExpandedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId],
    );
  };

  const isActive = (href: string): boolean => {
    if (href === '/admin') {
      return router.pathname === href;
    }
    return router.pathname.startsWith(href);
  };

  const handleMenuClick = () => {
    // 모바일에서 메뉴 클릭 시 사이드바 닫기
    if (isMobile && isOpen) {
      onToggle();
    }
  };

  const renderMenuItem = (item: MenuItem, level: number = 0): React.ReactNode => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.href);
    const isSubItem = level > 0;

    const buttonClasses = [
      hasSubItems ? styles.menuButton : styles.menuLink,
      isOpen ? styles.open : styles.closed,
      isSubItem ? styles.subItem : '',
      active ? styles.active : '',
    ]
      .filter(Boolean)
      .join(' ');

    const iconClasses = [styles.menuIcon, isOpen ? styles.open : styles.closed].join(' ');

    const labelClasses = [styles.menuLabel, !isOpen ? styles.hidden : ''].join(' ');

    const rightClasses = [styles.menuRight, !isOpen ? styles.hidden : ''].join(' ');

    return (
      <div key={item.id} className={isSubItem ? styles.subItem : styles.menuItem}>
        {/* 메인 메뉴 아이템 */}
        {hasSubItems ? (
          <button
            onClick={() => toggleExpand(item.id)}
            className={buttonClasses}
            aria-expanded={isExpanded}
            aria-label={`${item.label} ${isExpanded ? '접기' : '펼치기'}`}
          >
            <span className={iconClasses}>{item.icon}</span>

            {isOpen && (
              <>
                <span className={labelClasses}>{item.label}</span>

                <div className={rightClasses}>
                  {item.badge && (
                    <span
                      className={`${styles.badge} ${active ? styles.active : styles.inactive}`}
                    >
                      {item.badge}
                    </span>
                  )}

                  <div
                    className={`${styles.expandIcon} ${active ? styles.active : styles.inactive} ${
                      isExpanded ? styles.expanded : styles.collapsed
                    }`}
                  />
                </div>
              </>
            )}
          </button>
        ) : (
          <Link
            href={item.href}
            className={buttonClasses}
            onClick={handleMenuClick}
            aria-label={item.label}
          >
            <span className={iconClasses}>{item.icon}</span>

            {isOpen && (
              <>
                <span className={labelClasses}>{item.label}</span>

                {item.badge && (
                  <div className={rightClasses}>
                    <span
                      className={`${styles.badge} ${active ? styles.active : styles.inactive}`}
                    >
                      {item.badge}
                    </span>
                  </div>
                )}
              </>
            )}
          </Link>
        )}

        {/* 서브 메뉴 아이템들 */}
        {hasSubItems && isExpanded && isOpen && (
          <div className={styles.subMenu}>
            {item.subItems?.map((subItem) => renderMenuItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const sidebarClasses = [
    styles.sidebar,
    isOpen ? styles.open : styles.closed,
    isMobile && isOpen ? styles.mobileOpen : '',
  ]
    .filter(Boolean)
    .join(' ');

  const headerClasses = [styles.header, isOpen ? styles.open : styles.closed].join(' ');

  const logoClasses = [styles.logo, isOpen ? styles.open : ''].join(' ');

  const logoTextClasses = [styles.logoText, !isOpen ? styles.hidden : ''].join(' ');

  const footerClasses = [styles.footer, isOpen ? styles.open : styles.closed].join(' ');

  const footerContentClasses = [styles.footerContent, !isOpen ? styles.hidden : ''].join(
    ' ',
  );

  return (
    <aside className={sidebarClasses} role='navigation' aria-label='메인 네비게이션'>
      {/* 로고 영역 */}
      <div className={headerClasses}>
        <div className={logoClasses}>🎪</div>

        {isOpen && (
          <div className={logoTextClasses}>
            <div className={styles.logoTitle}>Venue Manager</div>
            <div className={styles.logoSubtitle}>콘서트장 관리 시스템</div>
          </div>
        )}
      </div>

      {/* 메뉴 영역 */}
      <nav className={styles.nav}>{menuItems.map((item) => renderMenuItem(item))}</nav>

      {/* 하단 정보 */}
      <div className={footerClasses}>
        {isOpen ? (
          <div className={footerContentClasses}>
            <div className={styles.version}>버전 1.0.0</div>
            <div className={styles.lastUpdate}>마지막 업데이트: 2025.06.06</div>
          </div>
        ) : (
          <div className={styles.footerPlaceholder} />
        )}
      </div>
    </aside>
  );
}
