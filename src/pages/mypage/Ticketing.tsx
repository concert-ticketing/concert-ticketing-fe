import React, { useState } from "react";
import Pagination from "@/pages/components/Pagination";
import MypageNav from "../components/MypageNav";
import styles from "./Ticketing.module.css";

interface Ticket {
  id: number;
  concertName: string;
  reservationNumber: string;
  concertHall: string;
  viewDate: string;
  seats: string;
  status: string;
  canReview: boolean;
}

const mockTickets: Ticket[] = [
  {
    id: 1,
    concertName: "1 콘서트 이름",
    reservationNumber: "a10123456789",
    concertHall: "abc콘서트장",
    viewDate: "2025.05.13",
    seats: "좌석(3)",
    status: "결제완료",
    canReview: false,
  },
  {
    id: 2,
    concertName: "2 콘서트 이름",
    reservationNumber: "b20456879012",
    concertHall: "xyz콘서트장",
    viewDate: "2025.06.21",
    seats: "좌석(2)",
    status: "결제완료",
    canReview: true,
  },
];

const ITEMS_PER_PAGE = 3;

export default function Ticketing() {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}년 ${
    today.getMonth() + 1
  }월 ${today.getDate()}일`;

  const totalReviews = 13;
  const writtenReviews = 9;
  const unwrittenReviews = totalReviews - writtenReviews;

  const [currentPage, setCurrentPage] = useState(1);
  const paginatedTickets = mockTickets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className={styles.all}>
      <div className={styles.margin}>
        <div>
          <h1 className={styles.title}>마이페이지</h1>
        </div>
        <div className={styles.container}>
          <MypageNav /> {/* nav 분리된 컴포넌트 사용 */}
          <section className={styles.content}>
            <div className={styles.reservation}>
              <div className={styles.reservationTitle}>예매확인</div>
              <div className={styles.reservationContent}>
                <div className={styles.reservationSearch}>
                  <div className={styles.reservationReview}>
                    <div className={styles.reservatonCount}>
                      사용자의 예매 건은 총{" "}
                      <span className={styles.highlight}>{totalReviews}</span>건
                      입니다. ({formattedDate} 기준) / 관람후기 작성{" "}
                      {writtenReviews}건, 미작성 {unwrittenReviews}건
                    </div>
                  </div>
                  <div className={styles.reservationDateSearchBox}>
                    <div className={styles.searchBoxTitle}>기간별</div>
                    <input type="text" placeholder="날짜" /> ~
                    <input type="text" placeholder="날짜" />
                    <button aria-label="검색">조회</button>
                  </div>
                  <div className={styles.reservationSearchBox}>
                    <div className={styles.searchBoxTitle}>콘서트명</div>
                    <input type="text" placeholder="concert-ticketing" />
                    <button aria-label="검색">조회</button>
                  </div>
                </div>
              </div>

              {paginatedTickets.map((ticket) => (
                <div key={ticket.id} className={styles.tickets}>
                  <div className={styles.ticketTitle}>{ticket.concertName}</div>
                  <div className={styles.ticketInfos}>
                    <div className={styles.ticketPosterline}>
                      <div className={styles.ticketPoster}>포스터</div>
                    </div>
                    <div className={styles.ticketInfo}>
                      <div className={styles.infoRow}>
                        <span>예매번호: {ticket.reservationNumber}</span>
                        <span>관람일시: {ticket.viewDate}</span>
                      </div>
                      <div className={styles.infoRow}>
                        <span>예매상태: {ticket.status}</span>
                        <span style={{ color: "red" }}>{ticket.seats}</span>
                      </div>
                      <div className={styles.infoRow}>
                        <span>콘서트장: {ticket.concertHall}</span>
                        <span>
                          후기작성:{" "}
                          {ticket.canReview
                            ? "작성 가능"
                            : "작성기간이 아닙니다"}
                        </span>
                      </div>
                    </div>
                    <div className={styles.ticketbutton}>
                      <button className={styles.ticketButton}>
                        콘서트정보
                      </button>
                      <button className={styles.ticketCancelButton}>
                        취소하기
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(mockTickets.length / ITEMS_PER_PAGE)}
                onPageChange={setCurrentPage}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
