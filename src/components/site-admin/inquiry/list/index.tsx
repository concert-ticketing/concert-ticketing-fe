import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/site-admin/common/Header';
import Nav from '@/components/site-admin/common/Nav';
import Pagination from '@/components/user/common/Pagination';
import styles from './InquiryList.module.css';

interface InquiryItem {
  id: number;
  category: string;
  title: string;
  content: string;
  status: '답변대기' | '답변완료';
  createdAt: string;
  answer?: string;
  answeredAt?: string;
  files?: string[];
  notificationEmail?: string;
  phoneNumber?: string;
}

const mapTypeToCategory = (type: string): string => {
  switch (type) {
    case 'RESERVATION':
      return '예매';
    case 'DELIVERY':
      return '배송';
    case 'REFUND':
      return '결제/환불';
    default:
      return '기타';
  }
};

const InquiryListPage: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(
          `http://localhost:8080/api/admin/inquiries?page=${currentPage}&size=${pageSize}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          },
        );

        if (!res.ok) throw new Error('❌ 문의 목록 불러오기 실패');

        const responseJson = await res.json();
        console.log('📦 서버 응답:', responseJson);

        const data = responseJson.content;

        if (!Array.isArray(data)) {
          throw new Error('❌ 문의 목록 데이터 형식이 잘못되었습니다.');
        }

        const mappedData: InquiryItem[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          category: mapTypeToCategory(item.type),
          status: item.status === 'COMPLETED' ? '답변완료' : '답변대기',
          createdAt: item.createdAt.split('T')[0],
          answer: item.replyContent || '',
          answeredAt: item.repliedAt?.split('T')[0] || '',
          notificationEmail: item.userEmail || '',
          phoneNumber: '',
        }));

        setInquiries(mappedData);
        setTotalPages(responseJson.totalPages || 1);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInquiries();
  }, [currentPage]);

  // 문의 상세 보기
  const handleViewInquiry = (inquiry: InquiryItem) => {
    setSelectedInquiry(inquiry);
  };

  // 답변 페이지로 이동
  const handleGoToAnswer = (inquiry: InquiryItem) => {
    router.push(`/site-admin/inquiry/${inquiry.id}`);
  };

  // 새 문의 작성 페이지로 이동
  const handleWriteInquiry = () => {
    router.push('/contact/write');
  };

  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.body}>
        <Nav />
        <main className={styles.content}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>1:1 문의 내역</h1>
            {/* <button className={styles.writeButton} onClick={handleWriteInquiry}>
                새 문의 작성
              </button> */}
          </div>

          {/* 문의 목록 */}
          <div className={styles.inquiryList}>
            {inquiries.length === 0 ? (
              <div className={styles.emptyState}>
                <p>등록된 문의가 없습니다.</p>
              </div>
            ) : (
              inquiries.map((inquiry) => (
                <div key={inquiry.id} className={styles.inquiryItem}>
                  <div className={styles.inquiryHeader}>
                    <span className={styles.category}>{inquiry.category}</span>
                    <span className={`${styles.status} ${styles[inquiry.status]}`}>
                      {inquiry.status}
                    </span>
                    <span className={styles.date}>{inquiry.createdAt}</span>
                  </div>
                  <h3
                    className={styles.inquiryTitle}
                    onClick={() => handleViewInquiry(inquiry)}
                  >
                    {inquiry.title}
                  </h3>
                  <p className={styles.inquiryContent}>
                    {inquiry.content.length > 100
                      ? `${inquiry.content.substring(0, 100)}...`
                      : inquiry.content}
                  </p>
                  <div className={styles.inquiryActions}>
                    <button
                      className={styles.viewButton}
                      onClick={() => handleViewInquiry(inquiry)}
                    >
                      상세보기
                    </button>
                    <button
                      className={styles.answerButton}
                      onClick={() => handleGoToAnswer(inquiry)}
                    >
                      {inquiry.status === '답변완료' ? '답변보기' : '답변작성'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
          {/* 문의 상세 모달 */}
          {selectedInquiry && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <h2>문의 상세</h2>
                  <button
                    className={styles.closeButton}
                    onClick={() => setSelectedInquiry(null)}
                  >
                    ×
                  </button>
                </div>
                <div className={styles.modalBody}>
                  <div className={styles.detailItem}>
                    <strong>카테고리:</strong> {selectedInquiry.category}
                  </div>
                  <div className={styles.detailItem}>
                    <strong>제목:</strong> {selectedInquiry.title}
                  </div>
                  <div className={styles.detailItem}>
                    <strong>내용:</strong>
                    <p className={styles.contentText}>{selectedInquiry.content}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <strong>작성일:</strong> {selectedInquiry.createdAt}
                  </div>
                  <div className={styles.detailItem}>
                    <strong>상태:</strong>
                    <span
                      className={`${styles.status} ${styles[selectedInquiry.status]}`}
                    >
                      {selectedInquiry.status}
                    </span>
                  </div>
                  {selectedInquiry.notificationEmail && (
                    <div className={styles.detailItem}>
                      <strong>알림 이메일:</strong> {selectedInquiry.notificationEmail}
                    </div>
                  )}
                  {selectedInquiry.phoneNumber && (
                    <div className={styles.detailItem}>
                      <strong>휴대폰 번호:</strong> {selectedInquiry.phoneNumber}
                    </div>
                  )}
                  {selectedInquiry.answer && (
                    <div className={styles.answerSection}>
                      <h3>답변</h3>
                      <p className={styles.answerText}>{selectedInquiry.answer}</p>
                      <p className={styles.answerDate}>
                        답변일: {selectedInquiry.answeredAt}
                      </p>
                    </div>
                  )}
                </div>
                <div className={styles.modalFooter}>
                  <button
                    className={styles.answerButton}
                    onClick={() => handleGoToAnswer(selectedInquiry)}
                  >
                    {selectedInquiry.status === '답변완료' ? '답변 수정' : '답변 작성'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default InquiryListPage;
