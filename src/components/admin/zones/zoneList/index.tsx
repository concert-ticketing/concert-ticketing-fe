import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import styles from './zoneList.module.css';

interface Zone {
  id: string;
  name: string;
  svgElementId: string;
  seatCount: number;
  priceRange: {
    min: number;
    max: number;
  };
  status: 'draft' | 'completed' | 'published';
  lastModified: string;
}

interface ZoneListProps {
  venueId: string;
}

export default function ZoneList({ venueId }: ZoneListProps) {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'seatCount' | 'lastModified'>('name');
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'draft' | 'completed' | 'published'
  >('all');

  useEffect(() => {
    // TODO: API 호출로 구역 데이터 가져오기
    const fetchZones = async () => {
      try {
        // 임시 데이터
        const mockZones: Zone[] = [
          {
            id: 'zone-1',
            name: 'VIP석',
            svgElementId: 'vip-area',
            seatCount: 100,
            priceRange: { min: 150000, max: 200000 },
            status: 'completed',
            lastModified: '2024-01-20',
          },
          {
            id: 'zone-2',
            name: 'R석',
            svgElementId: 'r-area',
            seatCount: 200,
            priceRange: { min: 100000, max: 120000 },
            status: 'completed',
            lastModified: '2024-01-19',
          },
          {
            id: 'zone-3',
            name: 'S석',
            svgElementId: 's-area',
            seatCount: 300,
            priceRange: { min: 80000, max: 90000 },
            status: 'draft',
            lastModified: '2024-01-18',
          },
          {
            id: 'zone-4',
            name: 'A석',
            svgElementId: 'a-area',
            seatCount: 400,
            priceRange: { min: 50000, max: 60000 },
            status: 'published',
            lastModified: '2024-01-17',
          },
        ];

        setTimeout(() => {
          setZones(mockZones);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Failed to fetch zones:', error);
        setLoading(false);
      }
    };

    fetchZones();
  }, [venueId]);

  const getStatusColor = (status: Zone['status']) => {
    switch (status) {
      case 'draft':
        return styles.statusDraft;
      case 'completed':
        return styles.statusCompleted;
      case 'published':
        return styles.statusPublished;
      default:
        return '';
    }
  };

  const getStatusText = (status: Zone['status']) => {
    switch (status) {
      case 'draft':
        return '작업중';
      case 'completed':
        return '완료';
      case 'published':
        return '발행됨';
      default:
        return status;
    }
  };

  const sortedAndFilteredZones = zones
    .filter((zone) => filterStatus === 'all' || zone.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'seatCount':
          return b.seatCount - a.seatCount;
        case 'lastModified':
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>구역 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href={`/admin/venues/${venueId}`} className={styles.backButton}>
            ← 공연장으로 돌아가기
          </Link>
          <div>
            <h1 className={styles.title}>구역 관리</h1>
            <p className={styles.subtitle}>총 {zones.length}개 구역</p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <Link
            href={`/admin/venues/${venueId}/preview`}
            className={styles.previewButton}
          >
            전체 미리보기
          </Link>
        </div>
      </div>

      {/* 필터 및 정렬 */}
      <div className={styles.controls}>
        <div className={styles.filters}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className={styles.select}
          >
            <option value='all'>전체 상태</option>
            <option value='draft'>작업중</option>
            <option value='completed'>완료</option>
            <option value='published'>발행됨</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className={styles.select}
          >
            <option value='name'>이름순</option>
            <option value='seatCount'>좌석수순</option>
            <option value='lastModified'>수정일순</option>
          </select>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>
              {zones.filter((z) => z.status === 'published').length}
            </span>
            <span className={styles.statLabel}>발행</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>
              {zones.filter((z) => z.status === 'completed').length}
            </span>
            <span className={styles.statLabel}>완료</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>
              {zones.filter((z) => z.status === 'draft').length}
            </span>
            <span className={styles.statLabel}>작업중</span>
          </div>
        </div>
      </div>

      {/* 구역 목록 */}
      <div className={styles.zoneGrid}>
        {sortedAndFilteredZones.map((zone) => (
          <div key={zone.id} className={styles.zoneCard}>
            <div className={styles.zoneHeader}>
              <h3 className={styles.zoneName}>{zone.name}</h3>
              <span className={`${styles.status} ${getStatusColor(zone.status)}`}>
                {getStatusText(zone.status)}
              </span>
            </div>

            <div className={styles.zoneStats}>
              <div className={styles.zoneStat}>
                <span className={styles.statLabel}>좌석 수</span>
                <span className={styles.statValue}>{zone.seatCount}석</span>
              </div>
              <div className={styles.zoneStat}>
                <span className={styles.statLabel}>가격 범위</span>
                <span className={styles.statValue}>
                  {zone.priceRange.min.toLocaleString()}원 ~{' '}
                  {zone.priceRange.max.toLocaleString()}원
                </span>
              </div>
              <div className={styles.zoneStat}>
                <span className={styles.statLabel}>수정일</span>
                <span className={styles.statValue}>{zone.lastModified}</span>
              </div>
            </div>

            <div className={styles.zoneActions}>
              <Link
                href={`/admin/venues/${venueId}/zones/${zone.id}`}
                className={styles.detailButton}
              >
                상세보기
              </Link>
              <Link
                href={`/admin/venues/${venueId}/zones/${zone.id}/editor`}
                className={styles.editButton}
              >
                좌석 편집
              </Link>
            </div>
          </div>
        ))}
      </div>

      {sortedAndFilteredZones.length === 0 && (
        <div className={styles.emptyState}>
          <p>조건에 맞는 구역이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
