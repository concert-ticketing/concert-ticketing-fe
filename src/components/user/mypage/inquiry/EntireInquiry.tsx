import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import Pagination from '@/components/user/common/Pagination';
import MypageNav from '@/components/user/mypage/MypageNav';
import styles from './Inquiry.module.css';

interface Inquiry {
  id: number;
  title: string;
  state: string;
  content: string;
  date: string;
}

export default function EntireInquiry() {
  const router = useRouter();
  const inquiriesPerPage = 5;

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No access token found');

        const response = await fetch(
          `http://localhost:8080/api/inquiries?page=${currentPage}&size=${inquiriesPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: '*/*',
            },
          },
        );
        console.log('✅ raw response:', response);
        if (!response.ok) throw new Error('Failed to fetch inquiries');

        const data = await response.json();

        // API 응답 형식에 맞게 수정 필요
        setInquiries(data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error('❌ 문의 조회 실패:', error);
      }
    };

    fetchInquiries();
  }, [currentPage]);

  return (
    <div className={styles.all}>
      <div className={styles.margin}>
        <h1 className={styles.title}>마이페이지</h1>
        <div className={styles.container}>
          <MypageNav />
          <section className={styles.content}>
            <div className={styles.inquiryContent}>
              <div className={styles.inquiryTitle}>1:1 문의내역</div>
              <div className={styles.inquirys}>
                {inquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className={styles.inquiry}
                    style={{ cursor: 'pointer' }}
                    onClick={() => router.push(`/mypage/inquiry/${inquiry.id}`)}
                  >
                    <p>{inquiry.title}</p>
                    <div className={styles.inquiryState}>
                      <p>{inquiry.state}</p>
                      <div className={styles.line} />
                      <p>{inquiry.date}</p>
                      <Image
                        src='/Group 687rightarrow.png'
                        alt='이동'
                        width={12}
                        height={12}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
