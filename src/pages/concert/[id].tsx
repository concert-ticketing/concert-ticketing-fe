import React from "react";
import { useRouter } from "next/router";
import styles from "./ConcertDetail.module.css";
import ConcertDetailTabs from "@/pages/concert/ConcertDetailTabs";

export default function ConcertDetail() {
  const router = useRouter();
  const { id } = router.query;

  const mockData = {
    image: "/placeholder.png",
    title: "콘서트 타이틀",
    location: "서울 올림픽홀",
    duration: "120",
    date: "2025.06.01 ~ 2025.06.10",
    age: "12세 이상",
    price: "99,000원",
  };

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <div className={styles.imageBox}>
          <img src={mockData.image} alt="concert" className={styles.image} />
        </div>
        <div className={styles.detailBox}>
          <h1 className={styles.title}>{mockData.title}</h1>
          <div className={styles.detailRow}>
            <span>위치 {mockData.location}</span>
            <span>소요시간 {mockData.duration} minutes</span>
          </div>
          <div className={styles.detailRow}>
            <span>날짜 {mockData.date}</span>
            <span>나이제한 {mockData.age}</span>
          </div>
          <div className={styles.detailRow}>
            <span>가격 {mockData.price}</span>
          </div>
        </div>
      </div>

      <button className={styles.noticeButton} disabled>
        예매 준비 중입니다
        <div>예매 준비중</div>
      </button>

      <button className={styles.reserveButton}>
        예매하기
        <div>(예매 열림)</div>
      </button>
      <ConcertDetailTabs />
    </div>
  );
}
