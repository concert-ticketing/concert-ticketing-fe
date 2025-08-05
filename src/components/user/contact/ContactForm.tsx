import React, { useState, useEffect } from 'react';
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
  status: string;
}

interface InquiryItem {
  id: number;
  title: string;
  date: string;
  status: string;
}

const CustomerCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('전체');
  const [expandedNotice, setExpandedNotice] = useState<number | null>(null);
  const [notices, setNotices] = useState<NoticeItem[]>([]);

  const faqTabs = ['전체', '상품', '배송', '취소', '결제/환불', '기타'];

  const publicNotices = [
    { id: 1, title: '공지사항 1', status: 'active' },
    { id: 2, title: '공지사항 2', status: 'active' },
    { id: 3, title: '공지사항 3', status: 'active' },
  ];

  const toggleNotice = (id: number) => {
    setExpandedNotice(expandedNotice === id ? null : id);
  };

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No access token found');

        const response = await fetch(
          `http://localhost:8080/api/inquiries?page=0&size=5`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: '*/*',
            },
          },
        );

        if (!response.ok) throw new Error('Failed to fetch inquiries');

        const data = await response.json();

        const sorted = (data.content || [])
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .map((inquiry: any) => ({
            id: inquiry.id,
            title: inquiry.title,
            date: new Date(inquiry.createdAt).toISOString().slice(0, 10),
            status: inquiry.status,
          }));

        setNotices(sorted.slice(0, 1)); // 최근 문의 1개만
      } catch (error) {
        console.error('❌ 1:1 문의 조회 실패:', error);
      }
    };

    fetchInquiries();
  }, []);

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
              <Link href='/contact/write'>
                <button className={styles.moreButton}>1:1문의하기</button>
              </Link>
            </div>

            <div className={styles.noticeList}>
              {notices.length === 0 ? (
                <div className={styles.noticeItem}>
                  <span className={styles.noticeTitle}>최근 문의 내역이 없습니다.</span>
                </div>
              ) : (
                notices.map((inquiry) => (
                  <Link href={`/mypage/inquiry/${inquiry.id}`} key={inquiry.id}>
                    {' '}
                    <div key={inquiry.id} className={styles.noticeItem}>
                      <div className={styles.noticeLeft}>
                        <span className={styles.statusBadge}>
                          {inquiry.status === 'COMPLETED' ? '답변완료' : '처리중'}
                        </span>
                        <span className={styles.noticeTitle}>{inquiry.title}</span>
                      </div>
                      <div className={styles.noticeRight}>
                        <span className={styles.noticeDate}>{inquiry.date}</span>
                        <button className={styles.arrowButton}>&gt;</button>
                      </div>
                    </div>
                  </Link>
                ))
              )}
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
                    <span
                      className={`${styles.expandIcon} ${
                        expandedNotice === notice.id ? styles.expanded : ''
                      }`}
                    >
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
              <Link href='/contact/notice'>
                <button className={styles.moreNoticeButton}>공지사항 더보기</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCenter;
