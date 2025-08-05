// components/user/mypage/inquiry/InquiryDetail.tsx
import React, { useEffect, useState } from 'react';
import styles from './inquiryDetail.module.css';
import MypageNav from '@/components/user/mypage/MypageNav';

interface InquiryDetailProps {
  id: string;
}

interface InquiryData {
  content: string;
  createdAt: string;
  reply: string;
  repliedAt: string;
}

export default function InquiryDetail({ id }: InquiryDetailProps) {
  const [inquiry, setInquiry] = useState<InquiryData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        console.log(token);
        const res = await fetch(`http://localhost:8080/api/inquiries/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: '*/*',
          },
        });

        if (!res.ok) throw new Error('❌ 문의 상세 조회 실패');
        const data = await res.json();
        setInquiry(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  if (!inquiry) return <div>로딩 중...</div>;

  return (
    <div className={styles.all}>
      <div className={styles.margin}>
        <h1 className={styles.title}>마이페이지</h1>
        <div className={styles.container}>
          <MypageNav />
          <section className={styles.content}>
            <div className={styles.inquiryContent}>
              <div className={styles.inquiryTitle}>1:1 문의내역</div>
              <div className={styles.chating}>
                <div className={styles.chatBox}>
                  <div className={styles.messageWrapper}>
                    <div className={styles.messageRow}>
                      <span className={styles.date}>
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </span>
                      <div className={styles.answer}>
                        <p>{inquiry.content}</p>
                      </div>
                    </div>
                  </div>

                  {inquiry.reply && (
                    <div className={styles.messageWrapper}>
                      <div className={styles.messageRow}>
                        <div className={styles.question}>
                          <p>{inquiry.reply}</p>
                        </div>
                        <span className={styles.date}>
                          {new Date(inquiry.repliedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
