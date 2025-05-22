import React, { useState } from "react";
import styles from "@/styles/mypage/Mypage.module.css";
import Review from "@/pages/mypage/Review";
import Ticketing from "@/pages/mypage/Ticketing";

interface Reservation {
  date: string;
  number: string;
  title: string;
  showTime: string;
  count: number;
  status: string;
}

export default function Mypage() {
const [activeTab, setActiveTab] = useState<"review" | "ticketing" | "default">("default");

  const reservationData: Reservation[] = [
    {
      date: "2025-05-01",
      number: "A123456",
      title: "뮤지컬 위키드",
      showTime: "2025-06-01 19:00",
      count: 2,
      status: "예매완료",
    },
    {
      date: "2025-04-28",
      number: "B987654",
      title: "콘서트 블랙핑크",
      showTime: "2025-06-10 18:00",
      count: 1,
      status: "예매완료",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "review":
        return <Review />;
      case "ticketing":
        return <Ticketing />;
      default:
        return (
          <>
            <div className={styles.noticeBox}>
              <div className={styles.tabs}>
                <div className={styles.notice}>NOTICE</div>
                <div className={styles.recentNotice}>최신 공지사항 or 이벤트</div>
              </div>
            </div>

            <div className={styles.historyBox}>
              <div className={styles.sectionHeader}>
                <div className={styles.border}></div>
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
                    reservationData.map((item, index) => (
                      <tr key={index}>
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
                <div className={styles.border}></div>
                <h3>1:1 문의 내역</h3>
                <button className={styles.moreButton}>더보기</button>
              </div>
              <div className={styles.inquiryTable}>
                <span className={styles.answerBox}>답변완료</span>
                <div className={styles.inquiryInfo}>
                  <span>title</span>
                  <span>date</span>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className={styles.all}>
      <div>
        <h1 className={styles.title}>마이페이지</h1>
      </div>
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <div className={styles.mypage}>
            <p className={styles.welcome}>안녕하세요 최*우님</p>
          </div>
          <div className={styles.menu}>
            <div>
              <h3>예매관리</h3>
              <p
                className={activeTab === "ticketing" ? styles.active : ""}
                onClick={() => setActiveTab("ticketing")}
              >
                예매확인 / 취소
              </p>
            </div>
            <div>
              <h3>활동관리</h3>
              <p
                className={activeTab === "review" ? styles.active : ""}
                onClick={() => setActiveTab("review")}
              >
                후기관리
              </p>
              <p>알림</p>
            </div>
            <div>
              <h3>회원정보관리</h3>
              <p>내정보</p>
              <p>1:1 문의 내역</p>
              <p>회원탈퇴</p>
            </div>
          </div>
        </aside>

        <section className={styles.content}>{renderContent()}</section>
      </div>
    </div>
  );
}