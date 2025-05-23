import React, { useState } from "react";
import styles from "./Review.module.css";
import MypageNav from "../components/MypageNav";
import Pagination from "@/pages/components/Pagination";

export default function Review() {
  const totalReviews = 13;
  const writtenReviews = 9;
  const unwrittenReviews = totalReviews - writtenReviews;

  const today = new Date();
  const formattedDate = `${today.getFullYear()}년 ${
    today.getMonth() + 1
  }월 ${today.getDate()}일`;

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  const reviewData = Array.from({ length: totalReviews }, (_, i) => ({
    concert: `콘서트 ${i + 1}`,
    content: `후기내용 ${i + 1}`,
    date: `2025-05-${(i % 31) + 1}`,
  }));

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviewData.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  const totalPages = Math.ceil(reviewData.length / reviewsPerPage);

  return (
    <div className={styles.all}>
      <div className={styles.margin}>
        <div>
          <h1 className={styles.title}>마이페이지</h1>
        </div>
        <div className={styles.container}>
          <MypageNav /> {/* nav 분리된 컴포넌트 사용 */}
          <section className={styles.content}>
            <div className={styles.review}>
              <div className={styles.reviewTitle}>후기관리</div>
              <div className={styles.reviewContent}>
                <div className={styles.reviewSearch}>
                  <div className={styles.reviewCount}>
                    사용자의 예매 건은 총{" "}
                    <span className={styles.highlight}>{totalReviews}</span>건
                    입니다. ({formattedDate} 기준) / 관람후기 작성{" "}
                    {writtenReviews}건, 미작성 {unwrittenReviews}건
                  </div>
                  <div className={styles.restReview}>
                    <span>
                      고객님께서 남겨주신 후기를 확인하실 수 있습니다.
                    </span>
                    <span>
                      운영정책에 위반되거나, 후기의 맞지 않는 글은 고객님께 사전
                      통보없이 삭제될 수 있습니다.
                    </span>
                  </div>
                  <div className={styles.reviewSearchBox}>
                    <div className={styles.searchBoxTitle}>콘서트명</div>
                    <input type="text" placeholder="concert-ticketing" />
                    <button aria-label="검색">조회</button>
                  </div>
                </div>
              </div>

              <div className={styles.reviewTableBox}>
                <table className={styles.reviewTable}>
                  <thead>
                    <tr>
                      <th>콘서트명</th>
                      <th>후기내용</th>
                      <th>작성일시</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentReviews.map((review, index) => (
                      <tr key={index}>
                        <td>{review.concert}</td>
                        <td>{review.content}</td>
                        <td>{review.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
