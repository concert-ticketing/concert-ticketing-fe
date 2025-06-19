import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

import { useVenueStore } from '@/stores/venue';
import { useZoneStore } from '@/stores/zone';
import { useSeatStore } from '@/stores/seat';

import { Icons } from '@/components/admin/common/ui/Icons';
import styles from './venuePreview.module.css';

interface VenuePreviewProps {
  venueId: string;
}

interface Zone {
  id: string;
  name: string;
  color: string;
  seatCount: number;
  priceCategory: string;
}

interface Seat {
  id: string;
  zoneId: string;
  row: string;
  number: number;
  x: number;
  y: number;
  status: 'available' | 'occupied' | 'disabled';
  priceCategory: string;
}

interface Venue {
  id: string;
  name: string;
  description: string;
  capacity: number;
  svgData?: string;
  zones: Zone[];
}

export default function VenuePreview({ venueId }: VenuePreviewProps) {
  const router = useRouter();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Zustand stores
  const { getVenue } = useVenueStore();
  const { getZonesByVenue } = useZoneStore();
  const { getSeatsByZone } = useSeatStore();

  const loadVenueData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 공연장 정보 로드
      const venueData = await getVenue(venueId);
      if (!venueData) {
        setError('공연장을 찾을 수 없습니다.');
        return;
      }
      setVenue(venueData);

      // 구역 정보 로드
      const zonesData = await getZonesByVenue(venueId);
      setZones(zonesData);

      // 모든 구역의 좌석 정보 로드
      const seatPromises = zonesData.map((zone) => getSeatsByZone(zone.id));
      const seatResults = await Promise.all(seatPromises);
      const allSeats = seatResults.flat();
      setSeats(allSeats);
    } catch (err) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
      console.error('Error loading venue data:', err);
    } finally {
      setLoading(false);
    }
  }, [venueId, getVenue, getZonesByVenue, getSeatsByZone]);

  useEffect(() => {
    loadVenueData();
  }, [loadVenueData]);

  const handleZoneClick = (zoneId: string) => {
    if (selectedZone === zoneId) {
      setSelectedZone(null);
    } else {
      setSelectedZone(zoneId);
    }
  };

  const getZoneSeats = (zoneId: string) => {
    return seats.filter((seat) => seat.zoneId === zoneId);
  };

  const getZoneStats = (zoneId: string) => {
    const zoneSeats = getZoneSeats(zoneId);
    const available = zoneSeats.filter((seat) => seat.status === 'available').length;
    const occupied = zoneSeats.filter((seat) => seat.status === 'occupied').length;
    const disabled = zoneSeats.filter((seat) => seat.status === 'disabled').length;

    return { total: zoneSeats.length, available, occupied, disabled };
  };

  const getTotalStats = () => {
    const available = seats.filter((seat) => seat.status === 'available').length;
    const occupied = seats.filter((seat) => seat.status === 'occupied').length;
    const disabled = seats.filter((seat) => seat.status === 'disabled').length;

    return { total: seats.length, available, occupied, disabled };
  };

  const handleBackToList = () => {
    router.push('/admin/venues');
  };

  const handleEditVenue = () => {
    router.push(`/admin/venues/${venueId}`);
  };

  const handleZoneEditor = (zoneId: string) => {
    router.push(`/admin/venues/${venueId}/zones/${zoneId}/editor`);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Icons.Loading className={styles.loadingIcon} />
          <span>공연장 정보를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <Icons.AlertCircle className={styles.errorIcon} />
          <span>{error || '공연장을 찾을 수 없습니다.'}</span>
          <button type='button' onClick={handleBackToList} className={styles.backButton}>
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const totalStats = getTotalStats();

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button type='button' onClick={handleBackToList} className={styles.backButton}>
            <Icons.ArrowLeft />
            <span>목록</span>
          </button>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>{venue.name}</h1>
            <p className={styles.subtitle}>전체 좌석 배치 미리보기</p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.viewModeToggle}>
            <button
              type='button'
              className={`${styles.toggleButton} ${viewMode === 'overview' ? styles.active : ''}`}
              onClick={() => setViewMode('overview')}
            >
              <Icons.Grid />
              <span>전체보기</span>
            </button>
            <button
              type='button'
              className={`${styles.toggleButton} ${viewMode === 'detailed' ? styles.active : ''}`}
              onClick={() => setViewMode('detailed')}
            >
              <Icons.Map />
              <span>상세보기</span>
            </button>
          </div>
          <button type='button' onClick={handleEditVenue} className={styles.editButton}>
            <Icons.Edit />
            <span>수정</span>
          </button>
        </div>
      </header>

      {/* 통계 정보 */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Icons.MapPin />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>총 구역</span>
            <span className={styles.statValue}>{zones.length}개</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Icons.Seat />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>총 좌석</span>
            <span className={styles.statValue}>{totalStats.total}석</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Icons.CheckCircle />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>예약 가능</span>
            <span className={styles.statValue}>{totalStats.available}석</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Icons.XCircle />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>사용 불가</span>
            <span className={styles.statValue}>{totalStats.disabled}석</span>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className={styles.mainContent}>
        {/* SVG 미리보기 */}
        {venue.svgData && (
          <div className={styles.svgContainer}>
            <div className={styles.svgWrapper}>
              <div
                className={styles.svgContent}
                dangerouslySetInnerHTML={{ __html: venue.svgData }}
              />
              {/* SVG 위에 구역 오버레이 */}
              <div className={styles.zoneOverlay}>
                {zones.map((zone) => (
                  <div
                    key={zone.id}
                    className={`${styles.zoneIndicator} ${
                      selectedZone === zone.id ? styles.selected : ''
                    }`}
                    style={{ backgroundColor: zone.color }}
                    onClick={() => handleZoneClick(zone.id)}
                    title={zone.name}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 구역 목록 */}
        <div className={styles.zoneList}>
          <h3 className={styles.sectionTitle}>구역 정보</h3>
          <div className={styles.zoneCards}>
            {zones.map((zone) => {
              const stats = getZoneStats(zone.id);
              const isSelected = selectedZone === zone.id;

              return (
                <div
                  key={zone.id}
                  className={`${styles.zoneCard} ${isSelected ? styles.selected : ''}`}
                  onClick={() => handleZoneClick(zone.id)}
                >
                  <div className={styles.zoneHeader}>
                    <div
                      className={styles.zoneColor}
                      style={{ backgroundColor: zone.color }}
                    />
                    <h4 className={styles.zoneName}>{zone.name}</h4>
                    <span className={styles.priceCategory}>{zone.priceCategory}</span>
                  </div>

                  <div className={styles.zoneStats}>
                    <div className={styles.zoneStat}>
                      <span className={styles.statLabel}>총 좌석</span>
                      <span className={styles.statValue}>{stats.total}석</span>
                    </div>
                    <div className={styles.zoneStat}>
                      <span className={styles.statLabel}>예약 가능</span>
                      <span className={styles.statValue}>{stats.available}석</span>
                    </div>
                    <div className={styles.zoneStat}>
                      <span className={styles.statLabel}>예약됨</span>
                      <span className={styles.statValue}>{stats.occupied}석</span>
                    </div>
                    <div className={styles.zoneStat}>
                      <span className={styles.statLabel}>사용 불가</span>
                      <span className={styles.statValue}>{stats.disabled}석</span>
                    </div>
                  </div>

                  <div className={styles.zoneActions}>
                    <button
                      type='button'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleZoneEditor(zone.id);
                      }}
                      className={styles.editZoneButton}
                    >
                      <Icons.Edit />
                      <span>좌석 편집</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 선택된 구역 상세 정보 */}
        {selectedZone && (
          <div className={styles.selectedZoneDetail}>
            {(() => {
              const zone = zones.find((z) => z.id === selectedZone);
              const zoneSeats = getZoneSeats(selectedZone);

              if (!zone) return null;

              return (
                <div className={styles.detailCard}>
                  <div className={styles.detailHeader}>
                    <h4 className={styles.detailTitle}>{zone.name} 상세 정보</h4>
                    <button
                      type='button'
                      onClick={() => setSelectedZone(null)}
                      className={styles.closeButton}
                    >
                      <Icons.X />
                    </button>
                  </div>

                  <div className={styles.seatGrid}>
                    {zoneSeats.map((seat) => (
                      <div
                        key={seat.id}
                        className={`${styles.seatItem} ${styles[seat.status]}`}
                        title={`${seat.row}열 ${seat.number}번 - ${seat.status}`}
                      >
                        <span className={styles.seatLabel}>
                          {seat.row}
                          {seat.number}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* 범례 */}
      <div className={styles.legend}>
        <h4 className={styles.legendTitle}>범례</h4>
        <div className={styles.legendItems}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.available}`} />
            <span>예약 가능</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.occupied}`} />
            <span>예약됨</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.disabled}`} />
            <span>사용 불가</span>
          </div>
        </div>
      </div>
    </div>
  );
}
