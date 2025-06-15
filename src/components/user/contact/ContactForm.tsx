import React, { useState } from 'react';
import Link from 'next/link';

import styles from './Contact.module.css';

interface FAQItem {
  id: number;
  title: string;
  date: string;
  isNew?: boolean;
}

interface NoticeItem {
  id: number;
  title: string;
  date: string;
}

const CustomerCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('전체');
  const [expandedNotice, setExpandedNotice] = useState<number | null>(null);

  const faqTabs = ['전체', '상품', '배송', '취소', '결제/환불', '기타'];

  const notices: NoticeItem[] = [
    { id: 1, title: '최신문의', date: '2023.05.09' }
  ];

  const publicNotices = [
    { id: 1, title: '공지사항 1', status: 'active' },
    { id: 2, title: '공지사항 2', status: 'active' },
    { id: 3, title: '공지사항 3', status: 'active' }
  ];

  const toggleNotice = (id: number) => {
    setExpandedNotice(expandedNotice === id ? null : id);
  };

  return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          {/* Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>고객센터</h1>
          </div>

          {/* FAQ Section */}
          <div className={styles.section}>
            <div className={styles.sectionContent}>
              <h2 className={styles.sectionTitle}>FAQ</h2>
              
              {/* FAQ Tabs */}
              <div className={styles.tabContainer}>
                <div className={styles.tabList}>
                  {faqTabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`${styles.tab} ${
                        activeTab === tab ? styles.activeTab : styles.inactiveTab
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* FAQ Content Area */}
              <div className={styles.emptyContent}>
                <p>선택하신 카테고리의 FAQ가 없습니다.</p>
              </div>
            </div>
          </div>

          {/* 1:1 문의 Section */}
          <div className={styles.section}>
            <div className={styles.sectionContent}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>1:1문의</h2>
                <Link href="/contact/write">
                  <button className={styles.moreButton}>
                    1:1문의하기
                  </button>
                </Link>
              </div>

              <div className={styles.noticeList}>
                {notices.map((notice) => (
                  <div key={notice.id} className={styles.noticeItem}>
                    <div className={styles.noticeLeft}>
                      <span className={styles.statusBadge}>
                        답변완료
                      </span>
                      <span className={styles.noticeTitle}>{notice.title}</span>
                    </div>
                    <div className={styles.noticeRight}>
                      <span className={styles.noticeDate}>{notice.date}</span>
                      <button className={styles.arrowButton}>
                        &gt;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 공지사항 Section */}
          <div className={styles.section}>
            <div className={styles.sectionContent}>
              <h2 className={styles.sectionTitle}>공지사항</h2>
              
              <div className={styles.publicNoticeList}>
                {publicNotices.map((notice) => (
                  <div key={notice.id} className={styles.publicNoticeItem}>
                    <button
                      onClick={() => toggleNotice(notice.id)}
                      className={styles.publicNoticeButton}
                    >
                      <span className={styles.publicNoticeTitle}>{notice.title}</span>
                      <span className={`${styles.expandIcon} ${
                        expandedNotice === notice.id ? styles.expanded : ''
                      }`}>
                        ▼
                      </span>
                    </button>
                    
                    {expandedNotice === notice.id && (
                      <div className={styles.publicNoticeContent}>
                        <div className={styles.publicNoticeText}>
                          공지사항 {notice.id}의 상세 내용이 여기에 표시됩니다.
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className={styles.moreButtonContainer}>
                <button className={styles.moreNoticeButton}>
                  공지사항 더보기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CustomerCenter;