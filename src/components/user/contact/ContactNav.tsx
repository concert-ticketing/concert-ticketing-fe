// components/CustomerSidebar.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './ContactWrite.module.css';

interface CustomerSidebarProps {
  activeMenu?: string;
}

const CustomerSidebar: React.FC<CustomerSidebarProps> = ({ activeMenu = '1:1 문의하기' }) => {
  const router = useRouter();
const faqItems = ['배송', '상품', '취소', '결제/환불', '기타'];

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.sidebarTitle}>고객센터</h2>
      
      <div className={styles.sidebarSection}>
        <h3 className={styles.sidebarSectionTitle}>FAQ</h3>
        <ul className={styles.sidebarList}>
          {faqItems.map((item) => (
            <li key={item} className={activeMenu === item ? styles.active : ''}>
              <Link href={`/customer-center?tab=${item}`}>
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.sidebarSection}>
        <h3 className={styles.sidebarSectionTitle}>1:1 문의</h3>
        <ul className={styles.sidebarList}>
          <li className={activeMenu === '1:1 문의하기' ? styles.active : ''}>
            <Link href="/mypage/contact">
              1:1 문의하기
            </Link>
          </li>
        </ul>
      </div>

      <div className={styles.sidebarSection}>
        <Link href="/notices" className={styles.sidebarLink}>
          공지사항 <span>&gt;</span>
        </Link>
      </div>
    </div>
  );
};

export default CustomerSidebar;