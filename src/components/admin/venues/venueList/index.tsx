import React, { useState } from 'react';
import Link from 'next/link';

import { Venue } from '@/types/venues';

import { VenueCard } from './VenueCard';
import styles from './venueList.module.css';

interface VenueListProps {
  initialVenues?: Venue[];
}

interface FilterOptions {
  status: 'all' | 'active' | 'draft' | 'archived';
  sortBy: 'name' | 'created' | 'modified' | 'seats';
  sortOrder: 'asc' | 'desc';
  searchQuery: string;
}

// 목업 데이터를 별도 함수로 분리
const getInitialVenues = (): Venue[] => [
  {
    id: 'seoul-arena',
    name: '서울 아레나',
    location: '서울 송파구',
    description: '올림픽공원 내 대형 콘서트홀로 최대 2만명 수용 가능',
    floorCount: 3,
    totalSeats: 18500,
    status: 'active',
    thumbnail: '#3b82f6',
    createdAt: '2024-03-15',
    lastModified: '2024-06-05 14:30',
    tags: ['대형', '실내', '서울'],
  },
  {
    id: 'busan-center',
    name: '부산 문화회관',
    location: '부산 해운대구',
    description: '부산 대표 문화공간으로 클래식부터 팝까지 다양한 공연',
    floorCount: 2,
    totalSeats: 1200,
    status: 'active',
    thumbnail: '#10b981',
    createdAt: '2024-04-20',
    lastModified: '2024-06-01 09:15',
    tags: ['중형', '실내', '부산'],
  },
  {
    id: 'olympic-hall',
    name: '올림픽공원 체조경기장',
    location: '서울 송파구',
    description: '1988 올림픽 체조경기장을 콘서트홀로 리모델링',
    floorCount: 4,
    totalSeats: 15000,
    status: 'draft',
    thumbnail: '#f59e0b',
    createdAt: '2024-05-10',
    lastModified: '2024-05-25 16:45',
    tags: ['대형', '실내', '역사적'],
  },
  {
    id: 'jeju-arena',
    name: '제주 야외극장',
    location: '제주 제주시',
    description: '자연과 함께하는 야외 콘서트 공간',
    floorCount: 1,
    totalSeats: 8000,
    status: 'archived',
    thumbnail: '#8b5cf6',
    createdAt: '2024-02-05',
    lastModified: '2024-04-10 11:20',
    tags: ['야외', '자연', '제주'],
  },
];

export default function VenueList({ initialVenues }: VenueListProps = {}) {
  const [venues, setVenues] = useState<Venue[]>(initialVenues || getInitialVenues());

  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    sortBy: 'modified',
    sortOrder: 'desc',
    searchQuery: '',
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 필터링 및 정렬된 venue 목록
  const filteredVenues = venues
    .filter((venue) => {
      // 상태 필터
      if (filters.status !== 'all' && venue.status !== filters.status) {
        return false;
      }

      // 검색 필터
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          venue.name.toLowerCase().includes(query) ||
          venue.location.toLowerCase().includes(query) ||
          venue.description.toLowerCase().includes(query) ||
          venue.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      }

      return true;
    })
    .sort((a, b) => {
      const order = filters.sortOrder === 'asc' ? 1 : -1;

      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name) * order;
        case 'created':
          return (
            (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * order
          );
        case 'modified':
          return (
            (new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime()) *
            order
          );
        case 'seats':
          return (a.totalSeats - b.totalSeats) * order;
        default:
          return 0;
      }
    });

  const updateFilter = <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K],
  ): void => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDeleteVenue = (venueId: string, venueName: string): void => {
    if (
      window.confirm(
        `${venueName}을(를) 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
      )
    ) {
      setVenues(venues.filter((venue) => venue.id !== venueId));
    }
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerInfo}>
            <h1 className={styles.title}>🎪 내 콘서트장</h1>
            <p className={styles.subtitle}>
              총 {filteredVenues.length}개의 콘서트장을 관리하고 있습니다
            </p>
          </div>

          <Link href='/admin/venues/create' className={styles.createButton}>
            ➕ 새 콘서트장 만들기
          </Link>
        </div>

        {/* 필터 및 검색 */}
        <div className={styles.filterGrid}>
          {/* 상태 필터 */}
          <select
            value={filters.status}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              updateFilter('status', e.target.value as FilterOptions['status'])
            }
            className={styles.filterSelect}
          >
            <option value='all'>전체 상태</option>
            <option value='active'>활성</option>
            <option value='draft'>임시저장</option>
            <option value='archived'>보관됨</option>
          </select>

          {/* 정렬 */}
          <select
            value={filters.sortBy}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              updateFilter('sortBy', e.target.value as FilterOptions['sortBy'])
            }
            className={styles.filterSelect}
          >
            <option value='modified'>최근 수정순</option>
            <option value='created'>생성순</option>
            <option value='name'>이름순</option>
            <option value='seats'>좌석수순</option>
          </select>

          {/* 정렬 방향 */}
          <button
            onClick={() =>
              updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')
            }
            className={styles.sortButton}
            title={`${filters.sortOrder === 'asc' ? '오름차순' : '내림차순'}`}
          >
            {filters.sortOrder === 'asc' ? '⬆️' : '⬇️'}
          </button>

          {/* 검색 */}
          <input
            type='text'
            placeholder='콘서트장 이름, 위치, 태그로 검색...'
            value={filters.searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFilter('searchQuery', e.target.value)
            }
            className={styles.searchInput}
          />

          {/* 보기 모드 */}
          <div className={styles.viewModeButtons}>
            <button
              onClick={() => setViewMode('grid')}
              className={`${styles.viewModeButton} ${viewMode === 'grid' ? styles.active : ''}`}
            >
              ⊞
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`${styles.viewModeButton} ${viewMode === 'list' ? styles.active : ''}`}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* 콘서트장 목록 */}
      {filteredVenues.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🎪</div>
          <h3 className={styles.emptyTitle}>
            {filters.searchQuery || filters.status !== 'all'
              ? '검색 조건에 맞는 콘서트장이 없습니다'
              : '아직 콘서트장이 없습니다'}
          </h3>
          <p className={styles.emptyDescription}>
            {filters.searchQuery || filters.status !== 'all'
              ? '다른 검색 조건을 시도해보세요.'
              : '첫 번째 콘서트장을 만들어서 시작해보세요.'}
          </p>
          {!filters.searchQuery && filters.status === 'all' && (
            <Link href='/admin/venues/create' className={styles.emptyCreateButton}>
              첫 콘서트장 만들기
            </Link>
          )}
        </div>
      ) : (
        <div
          className={`${styles.venueGrid} ${viewMode === 'list' ? styles.listMode : ''}`}
        >
          {filteredVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} onDelete={handleDeleteVenue} />
          ))}
        </div>
      )}
    </div>
  );
}
