import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import ConcertCard from '@/components/user/concert/ConcertCard';
import Pagination from '@/components/user/common/Pagination';
import styles from './Concert.module.css';

type Concert = {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  rating: number;
  thumbNailImageUrl: string;
};

export default function ConcertPage() {
  const router = useRouter();

  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [useMockData, setUseMockData] = useState(false);

  const perPage = 9;

  const fetchConcerts = async (page: number) => {
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_LOCAL_BASE_URL || 'http://localhost:8080';
      const size = perPage;
      const token = localStorage.getItem('accessToken') || '';
      const url = `${apiUrl}/api/concert/main-list?size=${size}`;

      const response = await fetch(url, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Concert[] = await response.json();

      if (data) {
        setConcerts(data);
        setTotalPages(Math.ceil(data.length / perPage));
      } else {
        throw new Error('데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setUseMockData(true);
      setConcerts([]);
    }
  };

  useEffect(() => {
    fetchConcerts(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>콘서트</h1>

      {/* 콘서트 리스트 */}
      <div className={styles.list}>
        {concerts.map((concert) => (
          <ConcertCard key={concert.id} concert={concert} />
        ))}
      </div>

      {/* 페이징 */}
      {concerts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
