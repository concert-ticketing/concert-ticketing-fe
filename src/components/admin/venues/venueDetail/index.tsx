import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import styles from './venueDetail.module.css';

interface Zone {
  id: string;
  name: string;
  svgElementId: string;
  seatCount: number;
  priceRange: {
    min: number;
    max: number;
  };
}

interface Venue {
  id: string;
  name: string;
  location: string;
  svgContent: string;
  zones: Zone[];
  createdAt: string;
  updatedAt: string;
}

interface VenueDetailProps {
  venueId: string;
}

export default function VenueDetail({ venueId }: VenueDetailProps) {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO: API 호출로 공연장 데이터 가져오기
    const fetchVenue = async () => {
      try {
        // 임시 데이터
        const mockVenue: Venue = {
          id: venueId,
          name: 'Olympic Hall',
          location: '서울시 송파구',
          svgContent: '<svg>...</svg>', // 실제 SVG 내용
          zones: [
            {
              id: 'zone-1',
              name: 'VIP석',
              svgElementId: 'vip-area',
              seatCount: 100,
              priceRange: { min: 150000, max: 200000 },
            },
            {
              id: 'zone-2',
              name: 'R석',
              svgElementId: 'r-area',
              seatCount: 200,
              priceRange: { min: 100000, max: 120000 },
            },
          ],
          createdAt: '2024-01-15',
          updatedAt: '2024-01-20',
        };

        setTimeout(() => {
          setVenue(mockVenue);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch venue:', error);
        setLoading(false);
      }
    };

    fetchVenue();
  }, [venueId]);

  useEffect(() => {
    if (!venue?.svgContent || !svgContainerRef.current) return;

    // SVG 렌더링 및 구역 클릭 이벤트 설정
    svgContainerRef.current.innerHTML = venue.svgContent;

    const svgEl = svgContainerRef.current.querySelector('svg');
    if (svgEl) {
      venue.zones.forEach((zone) => {
        const element = svgEl.querySelector(`#${zone.svgElementId}`);
        if (element) {
          element.addEventListener('click', () => {
            setSelectedZone(zone.id);
          });

          element.addEventListener('mouseenter', () => {
            element.setAttribute('fill', 'rgba(59, 130, 246, 0.7)');
            element.setAttribute('cursor', 'pointer'); 
          });

          element.addEventListener('mouseleave', () => {
            if (selectedZone !== zone.id) {
              element.setAttribute('fill', 'rgba(107, 114, 128, 0.5)');
            }
          });

          // 초기 스타일 설정
          element.setAttribute(
            'fill',
            selectedZone === zone.id
              ? 'rgba(59, 130, 246, 0.7)'
              : 'rgba(107, 114, 128, 0.5)',
          );
          element.setAttribute('stroke', 'rgba(0, 0, 0, 0.3)');
          element.setAttribute('stroke-width', '1');
        }
      });
    }
  }, [venue, selectedZone]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>공연장 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>공연장을 찾을 수 없습니다.</p>
          <Link href='/admin/venues' className={styles.backButton}>
            공연장 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const selectedZoneData = venue.zones.find((zone) => zone.id === selectedZone);

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href='/admin/venues' className={styles.backButton}>
            ← 목록으로
          </Link>
          <div>
            <h1 className={styles.title}>{venue.name}</h1>
            <p className={styles.subtitle}>{venue.location}</p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <Link
            href={`/admin/venues/${venueId}/preview`}
            className={styles.previewButton}
          >
            전체 미리보기
          </Link>
          <Link href={`/admin/venues/${venueId}/zones`} className={styles.manageButton}>
            구역 관리
          </Link>
        </div>
      </div>

      <div className={styles.content}>
        {/* SVG 뷰어 */}
        <div className={styles.svgSection}>
          <div className={styles.svgHeader}>
            <h2>공연장 레이아웃</h2>
            <p>구역을 클릭하여 선택하세요</p>
          </div>
          <div ref={svgContainerRef} className={styles.svgContainer} />
        </div>

        {/* 구역 정보 패널 */}
        <div className={styles.infoPanel}>
          <h2>구역 정보</h2>

          {selectedZoneData ? (
            <div className={styles.zoneDetail}>
              <div className={styles.zoneHeader}>
                <h3>{selectedZoneData.name}</h3>
                <div className={styles.zoneActions}>
                  <Link
                    href={`/admin/venues/${venueId}/zones/${selectedZoneData.id}`}
                    className={styles.detailButton}
                  >
                    상세보기
                  </Link>
                  <Link
                    href={`/admin/venues/${venueId}/zones/${selectedZoneData.id}/editor`}
                    className={styles.editButton}
                  >
                    좌석 편집
                  </Link>
                </div>
              </div>

              <div className={styles.zoneStats}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>좌석 수</span>
                  <span className={styles.statValue}>{selectedZoneData.seatCount}석</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>가격 범위</span>
                  <span className={styles.statValue}>
                    {selectedZoneData.priceRange.min.toLocaleString()}원 ~{' '}
                    {selectedZoneData.priceRange.max.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.noSelection}>
              <p>구역을 선택해주세요</p>
            </div>
          )}

          {/* 전체 구역 목록 */}
          <div className={styles.zoneList}>
            <h3>전체 구역</h3>
            <div className={styles.zones}>
              {venue.zones.map((zone) => (
                <div
                  key={zone.id}
                  className={`${styles.zoneCard} ${selectedZone === zone.id ? styles.selected : ''}`}
                  onClick={() => setSelectedZone(zone.id)}
                >
                  <div className={styles.zoneCardHeader}>
                    <h4>{zone.name}</h4>
                    <span className={styles.seatCount}>{zone.seatCount}석</span>
                  </div>
                  <p className={styles.priceRange}>
                    {zone.priceRange.min.toLocaleString()}원 ~{' '}
                    {zone.priceRange.max.toLocaleString()}원
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 정보 섹션 */}
      <div className={styles.infoSection}>
        <div className={styles.infoCard}>
          <h3>공연장 정보</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>생성일</span>
              <span className={styles.infoValue}>{venue.createdAt}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>수정일</span>
              <span className={styles.infoValue}>{venue.updatedAt}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>총 구역 수</span>
              <span className={styles.infoValue}>{venue.zones.length}개</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>총 좌석 수</span>
              <span className={styles.infoValue}>
                {venue.zones.reduce((total, zone) => total + zone.seatCount, 0)}석
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
