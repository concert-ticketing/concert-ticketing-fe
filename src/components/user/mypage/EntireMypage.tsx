import React, { useEffect, useState } from 'react';
import styles from './Mypage.module.css';
import MypageNav from '@/components/user/mypage/MypageNav';

interface Reservation {
  id: number;
  date: string;
  number: string;
  title: string;
  showTime: string;
  count: number;
  status: string;
}

interface Inquiry {
  id: number;
  title: string;
  state: string;
  createdAt: string;
  date: string;
}

export default function EntireMypage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const inquiriesPerPage = 5;

  const reservationData: Reservation[] = [
    {
      id: 1,
      date: '2025-05-01',
      number: 'A123456',
      title: '뮤지컬 위키드',
      showTime: '2025-06-01 19:00',
      count: 2,
      status: '예매완료',
    },
    {
      id: 2,
      date: '2025-04-28',
      number: 'B987654',
      title: '콘서트 블랙핑크',
      showTime: '2025-06-10 18:00',
      count: 1,
      status: '예매완료',
    },
  ];

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
        if (!response.ok) throw new Error('Failed to fetch inquiries');

        const data = await response.json();

        const sorted = (data.content || [])
          .sort(
            (a: Inquiry, b: Inquiry) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .map((inquiry: any) => ({
            id: inquiry.id,
            title: inquiry.title,
            state: inquiry.state,
            date: inquiry.createdAt,
          }));

        setInquiries(sorted.slice(0, 1));
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
            <div className={styles.noticeBox}>
              <div className={styles.tabs}>
                <div className={styles.notice}>NOTICE</div>
                <div className={styles.recentNotice}>최신 공지사항 or 이벤트</div>
              </div>
            </div>

            <div className={styles.historyBox}>
              <div className={styles.sectionHeader}>
                <div className={styles.border} />
                <h3>최근 예매내역</h3>
                <button className={styles.moreButton}>더보기</button>
              </div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>예매 날짜</th>
                    <th>예매 번호</th>
                    <th>공연명</th>
                    <th>관람일시</th>
                    <th>예매수</th>
                    <th>예매상태</th>
                  </tr>
                </thead>
                <tbody>
                  {reservationData.length === 0 ? (
                    <tr>
                      <td colSpan={6}>예매 내역이 없습니다.</td>
                    </tr>
                  ) : (
                    reservationData.map((item) => (
                      <tr key={item.id}>
                        <td>{item.date}</td>
                        <td>{item.number}</td>
                        <td>{item.title}</td>
                        <td>{item.showTime}</td>
                        <td>{item.count}</td>
                        <td>{item.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className={styles.inquiryBox}>
              <div className={styles.sectionHeader}>
                <div className={styles.border} />
                <h3>1:1 문의 내역</h3>
                <button className={styles.moreButton}>더보기</button>
              </div>

              {inquiries.length === 0 ? (
                <div className={styles.inquiryTable}>
                  <span>문의 내역이 없습니다.</span>
                </div>
              ) : (
                inquiries.map((inquiry) => (
                  <div key={inquiry.id} className={styles.inquiryTable}>
                    <span className={styles.answerBox}>
                      {inquiry.state === '답변완료' ? '답변완료' : '처리중'}
                    </span>
                    <div className={styles.inquiryInfo}>
                      <span>{inquiry.title}</span>
                      <span>{new Date(inquiry.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
