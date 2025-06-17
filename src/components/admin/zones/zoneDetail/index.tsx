import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import styles from './zoneDetail.module.css';

interface Seat {
  id: string;
  row: string;
  number: number;
  price: number;
  x: number;
  y: number;
  status: 'available' | 'reserved' | 'sold';
}

interface Zone {
  id: string;
  name: string;
  svgElementId: string;
  seats: Seat[];
  priceCategories: {
    [category: string]: number;
  };
  status: 'draft' | 'completed' | 'published';
  createdAt: string;
  updatedAt: string;
  settings: {
    defaultPrice: number;
    rowPrefix: string;
    maxSeatsPerRow: number;
  };
}

interface ZoneDetailProps {
  venueId: string;
  zoneId: string;
}

export default function ZoneDetail({ venueId, zoneId }: ZoneDetailProps) {
  const [zone, setZone] = useState<Zone | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'seats' | 'pricing' | 'settings'
  >('overview');

  useEffect(() => {
    // TODO: API 호출로 구역 상세 데이터 가져오기
    const fetchZoneDetail = async () => {
      try {
        // 임시 데이터
        const mockZone: Zone = {
          id: zoneId,
          name: 'VIP석',
          svgElementId: 'vip-area',
          seats: [
            {
              id: 'seat-1',
              row: 'A',
              number: 1,
              price: 150000,
              x: 100,
              y: 100,
              status: 'available',
            },
            {
              id: 'seat-2',
              row: 'A',
              number: 2,
              price: 150000,
              x: 120,
              y: 100,
              status: 'reserved',
            },
            {
              id: 'seat-3',
              row: 'A',
              number: 3,
              price: 150000,
              x: 140,
              y: 100,
              status: 'sold',
            },
            // ... 더 많은 좌석 데이터
          ],
          priceCategories: {
            VIP: 150000,
            Premium: 120000,
            Standard: 100000,
          },
          status: 'completed',
          createdAt: '2024-01-15',
          updatedAt: '2024-01-20',
          settings: {
            defaultPrice: 150000,
            rowPrefix: 'A',
            maxSeatsPerRow: 20,
          },
        };

        setTimeout(() => {
          setZone(mockZone);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Failed to fetch zone detail:', error);
        setLoading(false);
      }
    };

    fetchZoneDetail();
  }, [venueId, zoneId]);

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

  const getSeatStatusStats = () => {
    if (!zone) return { available: 0, reserved: 0, sold: 0 };

    return zone.seats.reduce(
      (acc, seat) => {
        acc[seat.status]++;
        return acc;
      },
      { available: 0, reserved: 0, sold: 0 },
    );
  };

  const getPriceStats = () => {
    if (!zone) return { min: 0, max: 0, average: 0 };

    const prices = zone.seats.map((seat) => seat.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;

    return { min, max, average: Math.round(average) };
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>구역 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!zone) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>구역을 찾을 수 없습니다.</p>
          <Link href={`/admin/venues/${venueId}/zones`} className={styles.backButton}>
            구역 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const seatStats = getSeatStatusStats();
  const priceStats = getPriceStats();

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href={`/admin/venues/${venueId}/zones`} className={styles.backButton}>
            ← 구역 목록
          </Link>
          <div>
            <h1 className={styles.title}>{zone.name}</h1>
            <div className={styles.titleMeta}>
              <span className={`${styles.status} ${getStatusColor(zone.status)}`}>
                {getStatusText(zone.status)}
              </span>
              <span className={styles.seatCount}>총 {zone.seats.length}석</span>
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <Link
            href={`/admin/venues/${venueId}/zones/${zoneId}/editor`}
            className={styles.editButton}
          >
            좌석 편집
          </Link>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          개요
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'seats' ? styles.active : ''}`}
          onClick={() => setActiveTab('seats')}
        >
          좌석 목록
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'pricing' ? styles.active : ''}`}
          onClick={() => setActiveTab('pricing')}
        >
          가격 설정
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'settings' ? styles.active : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          설정
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      <div className={styles.content}>
        {activeTab === 'overview' && (
          <div className={styles.overview}>
            {/* 통계 카드들 */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h3>좌석 현황</h3>
                <div className={styles.statContent}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>이용 가능</span>
                    <span className={`${styles.statValue} ${styles.available}`}>
                      {seatStats.available}석
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>예약</span>
                    <span className={`${styles.statValue} ${styles.reserved}`}>
                      {seatStats.reserved}석
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>판매</span>
                    <span className={`${styles.statValue} ${styles.sold}`}>
                      {seatStats.sold}석
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.statCard}>
                <h3>가격 정보</h3>
                <div className={styles.statContent}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>최저가</span>
                    <span className={styles.statValue}>
                      {priceStats.min.toLocaleString()}원
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>최고가</span>
                    <span className={styles.statValue}>
                      {priceStats.max.toLocaleString()}원
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>평균가</span>
                    <span className={styles.statValue}>
                      {priceStats.average.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.statCard}>
                <h3>구역 정보</h3>
                <div className={styles.statContent}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>생성일</span>
                    <span className={styles.statValue}>{zone.createdAt}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>수정일</span>
                    <span className={styles.statValue}>{zone.updatedAt}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>SVG ID</span>
                    <span className={styles.statValue}>{zone.svgElementId}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seats' && (
          <div className={styles.seats}>
            <div className={styles.seatTableHeader}>
              <h3>좌석 목록 (총 {zone.seats.length}석)</h3>
              <div className={styles.seatFilters}>
                <select className={styles.select}>
                  <option value='all'>전체 상태</option>
                  <option value='available'>이용 가능</option>
                  <option value='reserved'>예약</option>
                  <option value='sold'>판매</option>
                </select>
              </div>
            </div>

            <div className={styles.seatTable}>
              <div className={styles.tableHeader}>
                <div className={styles.tableCell}>좌석</div>
                <div className={styles.tableCell}>가격</div>
                <div className={styles.tableCell}>상태</div>
                <div className={styles.tableCell}>위치</div>
              </div>

              {zone.seats.slice(0, 20).map((seat) => (
                <div key={seat.id} className={styles.tableRow}>
                  <div className={styles.tableCell}>
                    {seat.row}-{seat.number}
                  </div>
                  <div className={styles.tableCell}>{seat.price.toLocaleString()}원</div>
                  <div className={styles.tableCell}>
                    <span className={`${styles.seatStatus} ${styles[seat.status]}`}>
                      {(() => {
                        if (seat.status === 'available') {
                          return '이용가능';
                        } else if (seat.status === 'reserved') {
                          return '예약';
                        } else {
                          return '판매';
                        }
                      })()}
                    </span>
                  </div>
                  <div className={styles.tableCell}>
                    ({seat.x}, {seat.y})
                  </div>
                </div>
              ))}

              {zone.seats.length > 20 && (
                <div className={styles.tableFooter}>
                  <p>... 외 {zone.seats.length - 20}개 좌석</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className={styles.pricing}>
            <h3>가격 카테고리</h3>
            <div className={styles.priceCategories}>
              {Object.entries(zone.priceCategories).map(([category, price]) => (
                <div key={category} className={styles.priceCategory}>
                  <span className={styles.categoryName}>{category}</span>
                  <span className={styles.categoryPrice}>{price.toLocaleString()}원</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className={styles.settings}>
            <h3>구역 설정</h3>
            <div className={styles.settingsGrid}>
              <div className={styles.settingItem}>
                <label>기본 가격</label>
                <span>{zone.settings.defaultPrice.toLocaleString()}원</span>
              </div>
              <div className={styles.settingItem}>
                <label>행 접두사</label>
                <span>{zone.settings.rowPrefix}</span>
              </div>
              <div className={styles.settingItem}>
                <label>행당 최대 좌석 수</label>
                <span>{zone.settings.maxSeatsPerRow}석</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
