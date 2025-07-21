import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/manager/common/Header';
import Nav from '@/components/manager/common/Nav';
import styles from './InquiryDetail.module.css';

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

const mockInquiries: InquiryItem[] = [
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

const InquiryAnswerPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [inquiry, setInquiry] = useState<InquiryItem | null>(null);
  const [answerContent, setAnswerContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const inquiryId = parseInt(id as string, 10);
      const foundInquiry = mockInquiries.find(item => item.id === inquiryId);
      
      if (foundInquiry) {
        setInquiry(foundInquiry);
        setAnswerContent(foundInquiry.answer || '');
      } else {
        router.push('/manager/inquiry');
      }
      setIsLoading(false);
    }
  }, [id, router]);

  const handleSubmitAnswer = () => {
    if (!inquiry || !answerContent.trim()) return;

    // 실제로는 API 호출
    const updatedInquiry = {
      ...inquiry,
      answer: answerContent,
      status: '답변완료' as const,
      answeredAt: new Date().toISOString().split('T')[0]
    };

    setInquiry(updatedInquiry);
    
    // 성공 메시지 표시 후 목록으로 이동
    alert('답변이 성공적으로 저장되었습니다.');
    router.push('/manager/inquiry');
  };

  const handleCancel = () => {
    if (answerContent !== (inquiry?.answer || '')) {
      if (confirm('작성 중인 답변이 있습니다. 정말 취소하시겠습니까?')) {
        router.push('/manager/inquiry');
      }
    } else {
      router.push('/manager/inquiry');
    }
  };

  if (isLoading) {
    return (
        <div className={styles.wrapper}>
            <Header />
          <div className={styles.body}>
        <Nav />
            <div className={styles.content}>
              <div className={styles.loading}>로딩 중...</div>
            </div>
          </div>
        </div>
    );
  }

  if (!inquiry) {
    return (
        <div className={styles.wrapper}>
                        <Header />
          <div className={styles.body}>
        <Nav />
            <div className={styles.content}>
              <div className={styles.error}>문의를 찾을 수 없습니다.</div>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className={styles.wrapper}>
                      <Header />

        <div className={styles.body}>
        <Nav />
          <div className={styles.content}>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>
                {inquiry.status === '답변완료' ? '답변 수정' : '답변 작성'}
              </h1>
              <div className={styles.breadcrumb}>
                <span onClick={() => router.push('/contact/inquiry')} className={styles.breadcrumbLink}>
                  문의 목록
                </span>
                <span className={styles.breadcrumbSeparator}>></span>
                <span>답변 {inquiry.status === '답변완료' ? '수정' : '작성'}</span>
              </div>
            </div>

            {/* 원본 문의 정보 */}
            <div className={styles.inquirySection}>
              <h2 className={styles.sectionTitle}>원본 문의</h2>
              <div className={styles.inquiryCard}>
                <div className={styles.inquiryHeader}>
                  <div className={styles.inquiryMeta}>
                    <span className={styles.category}>{inquiry.category}</span>
                    <span className={`${styles.status} ${styles[inquiry.status]}`}>
                      {inquiry.status}
                    </span>
                    <span className={styles.date}>작성일: {inquiry.createdAt}</span>
                  </div>
                </div>
                
                <div className={styles.inquiryContent}>
                  <h3 className={styles.inquiryTitle}>{inquiry.title}</h3>
                  <p className={styles.inquiryText}>{inquiry.content}</p>
                </div>

                {/* 연락처 정보 */}
                <div className={styles.contactInfo}>
                  <h4>연락처 정보</h4>
                  {inquiry.notificationEmail && (
                    <p><strong>알림 이메일:</strong> {inquiry.notificationEmail}</p>
                  )}
                  {inquiry.phoneNumber && (
                    <p><strong>휴대폰 번호:</strong> {inquiry.phoneNumber}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 답변 작성 섹션 */}
            <div className={styles.answerSection}>
              <h2 className={styles.sectionTitle}>답변 작성</h2>
              <div className={styles.answerForm}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>답변 내용</label>
                  <textarea
                    className={styles.answerTextarea}
                    value={answerContent}
                    onChange={(e) => setAnswerContent(e.target.value)}
                    placeholder="고객에게 도움이 되는 정확하고 친절한 답변을 작성해주세요..."
                    rows={12}
                  />
                  <div className={styles.textareaInfo}>
                    <span className={styles.charCount}>
                      {answerContent.length} / 2000자
                    </span>
                  </div>
                </div>

                {/* 답변 작성 가이드 */}
                <div className={styles.answerGuide}>
                  <h4>답변 작성 가이드</h4>
                  <ul>
                    <li>고객의 문의사항에 정확하고 구체적으로 답변해주세요.</li>
                    <li>친절하고 정중한 톤으로 작성해주세요.</li>
                    <li>필요한 경우 추가 연락처나 참고 링크를 제공해주세요.</li>
                    <li>답변 완료 후 고객에게 이메일/SMS로 알림이 발송됩니다.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 기존 답변 (수정 모드일 때) */}
            {inquiry.status === '답변완료' && inquiry.answer && (
              <div className={styles.previousAnswerSection}>
                <h2 className={styles.sectionTitle}>기존 답변</h2>
                <div className={styles.previousAnswerCard}>
                  <p className={styles.previousAnswerText}>{inquiry.answer}</p>
                  <p className={styles.previousAnswerDate}>답변일: {inquiry.answeredAt}</p>
                </div>
              </div>
            )}

            {/* 버튼 그룹 */}
            <div className={styles.buttonGroup}>
              <button 
                className={styles.cancelButton}
                onClick={handleCancel}
              >
                취소
              </button>
              <button 
                className={styles.submitButton}
                onClick={handleSubmitAnswer}
                disabled={!answerContent.trim()}
              >
                {inquiry.status === '답변완료' ? '답변 수정' : '답변 저장'}
              </button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default InquiryAnswerPage;