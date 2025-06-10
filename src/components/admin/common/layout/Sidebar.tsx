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
  icon: React.ReactNode;
  badge?: number;
  subItems?: MenuItem[];
}

// 아이콘 컴포넌트들
const DashboardIcon = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <rect x='3' y='3' width='7' height='7' />
    <rect x='14' y='3' width='7' height='7' />
    <rect x='14' y='14' width='7' height='7' />
    <rect x='3' y='14' width='7' height='7' />
  </svg>
);

const VenueIcon = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <path d='M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z' />
    <line x1='3' y1='6' x2='21' y2='6' />
    <path d='M16 10a4 4 0 0 1-8 0' />
  </svg>
);

const ListIcon = () => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <line x1='8' y1='6' x2='21' y2='6' />
    <line x1='8' y1='12' x2='21' y2='12' />
    <line x1='8' y1='18' x2='21' y2='18' />
    <line x1='3' y1='6' x2='3.01' y2='6' />
    <line x1='3' y1='12' x2='3.01' y2='12' />
    <line x1='3' y1='18' x2='3.01' y2='18' />
  </svg>
);

const PlusIcon = () => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <circle cx='12' cy='12' r='10' />
    <line x1='12' y1='8' x2='12' y2='16' />
    <line x1='8' y1='12' x2='16' y2='12' />
  </svg>
);

const EditorIcon = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
    <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' />
  </svg>
);

const ExpandIcon = () => (
  <svg
    width='12'
    height='12'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <polyline points='9,18 15,12 9,6' />
  </svg>
);

const LogoIcon = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <path d='M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z' />
    <line x1='3' y1='6' x2='21' y2='6' />
    <path d='M16 10a4 4 0 0 1-8 0' />
    <circle cx='12' cy='13' r='2' fill='currentColor' />
  </svg>
);

export default function Sidebar({ isOpen, onToggle, isMobile = false }: SidebarProps) {
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>(['venues']);

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: '대시보드',
      href: '/admin',
      icon: <DashboardIcon />,
    },
    {
      id: 'editor',
      label: '에디터',
      href: '/admin/editor',
      icon: <EditorIcon />,
    },
    {
      id: 'venues',
      label: '콘서트장 관리',
      href: '/admin/venues',
      icon: <VenueIcon />,
      badge: 2,
      subItems: [
        {
          id: 'venues-create',
          label: '새 콘서트장 생성',
          href: '/admin/create',
          icon: <PlusIcon />,
        },
        {
          id: 'venues-list',
          label: '콘서트장 목록',
          href: '/admin/venues',
          icon: <ListIcon />,
        },
      ],
    },
  ];

  const toggleExpand = (itemId: string): void => {
    setExpandedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId],
    );
  };

  const isActive = (
    href: string,
    subItems?: MenuItem[],
    hasSubItems: boolean = false,
  ): boolean => {
    const currentPath = router.pathname;

    if (href === '/admin') {
      return currentPath === href;
    }

    // 서브메뉴가 있는 경우 (부모 메뉴)
    if (hasSubItems && subItems) {
      // 현재 경로가 부모 메뉴의 정확한 경로와 일치하거나
      // 서브메뉴 중 하나의 경로와 일치하는 경우 활성화
      const isParentActive = currentPath === href;
      const isSubItemActive = subItems.some((subItem) => currentPath === subItem.href);
      return isParentActive || isSubItemActive;
    }

    // 서브메뉴가 없는 경우 또는 서브메뉴 아이템인 경우
    return currentPath === href;
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
    const active = isActive(item.href, item.subItems, hasSubItems);
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
                  >
                    <ExpandIcon />
                  </div>
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
        <div className={logoClasses}>
          <LogoIcon />
        </div>

        {isOpen && (
          <div className={logoTextClasses}>
            <div className={styles.logoTitle}>Concert Manager</div>
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
            <div className={styles.lastUpdate}>마지막 업데이트: 2025.06.10</div>
          </div>
        ) : (
          <div className={styles.footerPlaceholder} />
        )}
      </div>
    </aside>
  );
}
