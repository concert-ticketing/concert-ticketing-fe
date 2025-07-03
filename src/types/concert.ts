import {
  BaseEntity,
  CastRoleType,
  PaginationParams,
  SortOption,
  FilterOption,
} from './common';
import { Admin } from './admin';

// 콘서트 기본 정보 (ERD 기반)
export interface Concert extends BaseEntity {
  title: string;
  description: string;
  location: string;
  location_X: number; // 경도
  location_y: number; // 위도
  start_date: string;
  end_date: string;
  rating: number;
  admin_id: number;
  // 조인된 정보
  admin?: Admin;
}

// 출연진 (Cast)
export interface Cast extends BaseEntity {
  name: string;
  admin_id: number;
  // 조인된 정보
  admin?: Admin;
}

// 콘서트 스케줄 (Cast용 - 순환 참조 방지)
export interface ConcertScheduleForCast extends BaseEntity {
  concert_id: number;
  start_time: string;
  end_time: string;
  concert?: Concert;
}

// 콘서트 출연진 (콘서트별 출연진 배정)
export interface ConcertCast extends BaseEntity {
  concert_schedule_id: number;
  cast_id: number;
  role: CastRoleType;
  // 조인된 정보
  concert_schedule?: ConcertScheduleForCast;
  cast?: Cast;
}

// 콘서트 생성 요청
export interface CreateConcertRequest {
  title: string;
  description: string;
  location: string;
  location_X: number;
  location_y: number;
  start_date: string;
  end_date: string;
  rating?: number;
  admin_id: number;
}

// 콘서트 수정 요청
export interface UpdateConcertRequest {
  title?: string;
  description?: string;
  location?: string;
  location_X?: number;
  location_y?: number;
  start_date?: string;
  end_date?: string;
  rating?: number;
}

// 콘서트 스케줄 생성 요청
export interface CreateConcertScheduleRequest {
  concert_id: number;
  start_time: string;
  end_time: string;
}

// 콘서트 스케줄 수정 요청
export interface UpdateConcertScheduleRequest {
  start_time?: string;
  end_time?: string;
}

// 출연진 생성 요청
export interface CreateCastRequest {
  name: string;
  admin_id: number;
}

// 출연진 수정 요청
export interface UpdateCastRequest {
  name?: string;
}

// 콘서트 출연진 배정 요청
export interface CreateConcertCastRequest {
  concert_schedule_id: number;
  cast_id: number;
  role: CastRoleType;
}

// 콘서트 출연진 배정 수정 요청
export interface UpdateConcertCastRequest {
  role?: CastRoleType;
}

// 콘서트 목록 조회 파라미터
export interface GetConcertsParams extends PaginationParams {
  search?: string; // 제목, 설명, 위치로 검색
  admin_id?: number;
  location?: string;
  rating_min?: number;
  rating_max?: number;
  start_date_from?: string; // 공연 시작일 범위
  start_date_to?: string;
  end_date_from?: string; // 공연 종료일 범위
  end_date_to?: string;
  sort?: SortOption;
  filters?: FilterOption[];
  created_date_from?: string; // 생성일 범위
  created_date_to?: string;
}

// 콘서트 스케줄 목록 조회 파라미터
export interface GetConcertSchedulesParams extends PaginationParams {
  concert_id?: number;
  start_time_from?: string;
  start_time_to?: string;
  end_time_from?: string;
  end_time_to?: string;
  sort?: SortOption;
}

// 출연진 목록 조회 파라미터
export interface GetCastsParams extends PaginationParams {
  search?: string; // 이름으로 검색
  admin_id?: number;
  sort?: SortOption;
  created_date_from?: string;
  created_date_to?: string;
}

// 콘서트 출연진 목록 조회 파라미터
export interface GetConcertCastsParams extends PaginationParams {
  concert_id?: number;
  concert_schedule_id?: number;
  cast_id?: number;
  role?: CastRoleType;
  sort?: SortOption;
}

// 콘서트 상세 정보 (모든 관련 정보 포함)
export interface ConcertDetail extends Concert {
  schedules: Array<
    ConcertScheduleForCast & {
      cast_assignments: Array<
        ConcertCast & {
          cast_info: Cast;
        }
      >;
      seat_count: number; // 해당 스케줄의 총 좌석 수
      available_seats: number; // 예약 가능한 좌석 수
      reserved_seats: number; // 예약된 좌석 수
      revenue: number; // 해당 스케줄의 매출
    }
  >;
  total_seats: number; // 전체 좌석 수
  total_revenue: number; // 전체 매출
  reservation_count: number; // 전체 예약 수
  average_rating: number; // 평균 평점 (리뷰 기반)
  review_count: number; // 리뷰 수
}

// 출연진 상세 정보
export interface CastDetail extends Cast {
  concert_count: number; // 참여한 콘서트 수
  schedule_count: number; // 참여한 스케줄 수
  recent_concerts: Array<{
    concert_id: number;
    concert_title: string;
    role: CastRoleType;
    schedule_count: number;
    latest_schedule: string;
  }>;
}

// 콘서트 통계 정보
export interface ConcertStats {
  total_concerts: number;
  active_concerts: number; // 현재 진행 중인 콘서트
  upcoming_concerts: number; // 예정된 콘서트
  completed_concerts: number; // 완료된 콘서트
  concerts_this_month: number;
  total_revenue: number;
  average_rating: number;
  popular_locations: Array<{
    location: string;
    concert_count: number;
    revenue: number;
  }>;
  top_rated_concerts: Array<{
    concert_id: number;
    title: string;
    rating: number;
    review_count: number;
  }>;
}

// 출연진 통계 정보
export interface CastStats {
  total_casts: number;
  active_casts: number; // 최근 3개월 내 활동한 출연진
  casts_this_month: number;
  popular_casts: Array<{
    cast_id: number;
    name: string;
    concert_count: number;
    main_role_count: number;
    supporting_role_count: number;
    guest_role_count: number;
  }>;
  role_distribution: {
    main: number;
    supporting: number;
    guest: number;
  };
}

// 콘서트 검색 필터
export interface ConcertSearchFilters {
  location?: string[];
  date_range?: {
    start: string;
    end: string;
  };
  rating_range?: {
    min: number;
    max: number;
  };
  price_range?: {
    min: number;
    max: number;
  };
  has_available_seats?: boolean;
}

// 콘서트 복사 요청 (기존 콘서트를 복사하여 새 콘서트 생성)
export interface CopyConcertRequest {
  source_concert_id: number;
  title: string;
  start_date: string;
  end_date: string;
  copy_schedules: boolean; // 스케줄도 함께 복사할지
  copy_casts: boolean; // 출연진 배정도 함께 복사할지
}
