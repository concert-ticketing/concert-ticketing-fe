import React from 'react';
import Link from 'next/link';

import { Venue } from '@/types/venues';

import styles from './venueList.module.css';

interface VenueCardProps {
  venue: Venue;
  onDelete: (venueId: string, venueName: string) => void;
}

export function VenueCard({ venue, onDelete }: VenueCardProps) {
  const getStatusBadge = (status: Venue['status']): React.ReactNode => {
    const statusConfig = {
      active: { label: '활성', className: styles.statusActive },
      draft: { label: '임시저장', className: styles.statusDraft },
      archived: { label: '보관됨', className: styles.statusArchived },
    };

    const config = statusConfig[status];

    return (
      <span className={`${styles.statusBadge} ${config.className}`}>{config.label}</span>
    );
  };

  return (
    <div
      className={`${styles.venueCard} ${venue.status === 'archived' ? styles.archived : ''}`}
    >
      {/* 썸네일 */}
      <div className={styles.thumbnail} style={{ backgroundColor: venue.thumbnail }}>
        🎪
        {/* 상태 뱃지 */}
        <div className={styles.statusContainer}>{getStatusBadge(venue.status)}</div>
      </div>

      {/* 기본 정보 */}
      <div className={styles.venueInfo}>
        <h3 className={styles.venueName}>{venue.name}</h3>

        <p className={styles.venueLocation}>📍 {venue.location}</p>

        <p className={styles.venueDescription}>{venue.description}</p>
      </div>

      {/* 통계 */}
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{venue.totalSeats.toLocaleString()}</div>
          <div className={styles.statLabel}>총 좌석</div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statValue}>{venue.floorCount}</div>
          <div className={styles.statLabel}>층 수</div>
        </div>
      </div>

      {/* 태그 */}
      <div className={styles.tagContainer}>
        {venue.tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>

      {/* 날짜 정보 */}
      <div className={styles.dateInfo}>
        <div>생성: {venue.createdAt}</div>
        <div>수정: {venue.lastModified}</div>
      </div>

      {/* 액션 버튼 */}
      <div className={styles.actionButtons}>
        <Link
          href={`/admin/venues/${venue.id}`}
          className={styles.editButton}
          style={{ backgroundColor: venue.thumbnail }}
        >
          📝 편집
        </Link>

        <button
          onClick={() => onDelete(venue.id, venue.name)}
          className={styles.deleteButton}
          title='삭제'
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
