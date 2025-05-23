import React from "react";
import styles from "./ConcertDetail.module.css";

export default function ConcertDetailSection() {
  return (
    <div className={styles.detailImage}>
      <img src="/detail.jpg" alt="상세보기 이미지" />
    </div>
  );
}
