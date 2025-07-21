import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/manager/common/Header';
import Nav from '@/components/manager/common/Nav';
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

const initialInquiries: InquiryItem[] = [
  {
    id: 1,
    category: '예매',
    title: '예매 취소 문의',
    content: '예매한 공연을 취소하고 싶습니다. 어떻게 진행하면 되나요?',
    status: '답변완료',
    createdAt: '2025-07-15',
    answer: '안녕하세요. 예매 취소는 마이페이지 > 예매내역에서 직접 취소하실 수 있습니다. 공연 3일 전까지 취소 가능하며, 취소 수수료는 예매 금액의 10%입니다.',
    answeredAt: '2025-07-16',
    notificationEmail: 'user@example.com'
  },
  {
    id: 2,
    category: '배송',
    title: '상품 배송 지연 문의',
    content: '주문한 상품이 배송예정일이 지났는데 아직 도착하지 않았습니다.',
    status: '답변대기',
    createdAt: '2025-07-17',
    phoneNumber: '010-1234-5678'
  },
  {
    id: 3,
    category: '결제/환불',
    title: '환불 처리 문의',
    content: '공연 취소로 인한 환불이 언제 처리되나요?',
    status: '답변대기',
    createdAt: '2025-07-18',
    notificationEmail: 'customer@example.com'
  }
];

const InquiryListPage: React.FC = () => {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<InquiryItem[]>(initialInquiries);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
//   const [answerContent, setAnswerContent] = useState('');

  // 문의 상세 보기
  const handleViewInquiry = (inquiry: InquiryItem) => {
    setSelectedInquiry(inquiry);
  };

  // 답변 페이지로 이동
  const handleGoToAnswer = (inquiry: InquiryItem) => {
    router.push(`/manager/inquiry/${inquiry.id}`);
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
                  <button className={styles.emptyWriteButton} onClick={handleWriteInquiry}>
                    첫 번째 문의 작성하기
                  </button>
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
                    <h3 className={styles.inquiryTitle} onClick={() => handleViewInquiry(inquiry)}>
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
                      <span className={`${styles.status} ${styles[selectedInquiry.status]}`}>
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
                        <p className={styles.answerDate}>답변일: {selectedInquiry.answeredAt}</p>
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