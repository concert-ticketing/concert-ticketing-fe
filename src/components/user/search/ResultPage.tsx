import React from 'react';
import ConcertCard from '@/components/user/concert/ConcertCard';
import styles from './ResultPage.module.css';

const mockSearchResults = [
  {
    id: 1,
    title: '아이유 콘서트',
    location: '서울 KSPO DOME',
    date: '2025-08-01',
    singer: '아이유',
  },
  {
    id: 2,
    title: '임영웅 콘서트',
    location: '부산 사직야구장',
    date: '2025-08-15',
    singer: '임영웅',
  },
];

const ResultPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <h2 className={styles.title}>
          총 검색된 데이터의 갯수는 {mockSearchResults.length}개입니다.
        </h2>
        <div className={styles.cardContainer}>
          {mockSearchResults.map((concert) => (
            <ConcertCard
              className={styles.resultCard}
              key={concert.id}
              concert={concert}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
