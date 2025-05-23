import React, { useState } from "react";
import styles from "./ConcertDetail.module.css";
import ConcertDetailSection from "@/pages/concert/ConcertDetailSection";
import ReviewSection from "@/pages/concert/ReviewSection";
import LocationInfoSection from "@/pages/concert/LocationInfoSection";
import NoticeSection from "@/pages/concert/NoticeSection";

const TABS = ["상세보기", "관람후기", "장소정보", "예매 / 취소 안내"];

export default function ConcertDetailTabs() {
  const [activeTab, setActiveTab] = useState("상세보기");

  const renderTabContent = () => {
    switch (activeTab) {
      case "상세보기":
        return <ConcertDetailSection />;
      case "관람후기":
        return <ReviewSection />;
      case "장소정보":
        return <LocationInfoSection />;
      case "예매 / 취소 안내":
        return <NoticeSection />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.tabContainer}>
      <div className={styles.tabWrapper}>
        {TABS.map((tab) => (
          <div
            key={tab}
            className={
              activeTab === tab ? styles.activeTabButton : styles.tabButton
            }
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>
      <div className={styles.tabContent}>{renderTabContent()}</div>
    </div>
  );
}
