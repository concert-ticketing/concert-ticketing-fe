import { User } from './user';

import {
  BaseEntity,
  ReservationStateType,
  PaginationParams,
  SortOption,
  FilterOption,
} from './common';
import { Concert } from './concert';

// 좌석 정보 (예약에 필요한 기본 정보)
export interface Seat {
  id: number;
  concert_hall_area_id: number;
  seat_name: string;
  x: number;
  y: number;
  ui_metadata: Record<string, unknown>; // JSON 타입
}

// 콘서트 스케줄 (예약에 필요한 정보)
export interface ConcertSchedule extends BaseEntity {
  concert_id: number;
  start_time: string;
  end_time: string;
  concert?: Concert;
}

// 콘서트 좌석 메타데이터 (가격 정보)
export interface ConcertSeatMetadata extends BaseEntity {
  seats_id: number;
  concert_id: number;
  price: number;
  seat_per_able_person: number; // 좌석당 수용가능 인원
  // 조인된 정보
  seat?: Seat;
  concert?: Concert;
}

// 예약 기본 정보
export interface Reservation extends BaseEntity {
  user_id: number;
  concert_id: number;
  ticket_count: number; // 반정규화된 티켓 수량
  state: ReservationStateType;
  // 조인된 정보
  user?: User;
  concert?: Concert;
}

// 좌석 예약 (실질적인 티켓)
export interface SeatReservation {
  id: string; // UUID
  reservation_id: number;
  schedule_id: number;
  concert_seat_metadata_id: number;
  created_at: string;
  // 조인된 정보
  reservation?: Reservation;
  concert_schedule?: ConcertSchedule;
  concert_seat_metadata?: ConcertSeatMetadata;
}

// 예약 생성 요청
export interface CreateReservationRequest {
  user_id: number;
  concert_id: number;
  seats: Array<{
    schedule_id: number;
    concert_seat_metadata_id: number;
  }>;
}

// 예약 수정 요청 (상태 변경)
export interface UpdateReservationRequest {
  state: ReservationStateType;
}

// 예약 목록 조회 파라미터
export interface GetReservationsParams extends PaginationParams {
  search?: string; // 사용자명, 콘서트명으로 검색
  user_id?: number;
  concert_id?: number;
  state?: ReservationStateType;
  sort?: SortOption;
  filters?: FilterOption[];
  date_from?: string; // 예약일 범위 조회
  date_to?: string;
  schedule_date_from?: string; // 공연일 범위 조회
  schedule_date_to?: string;
}

// 좌석 예약 목록 조회 파라미터
export interface GetSeatReservationsParams extends PaginationParams {
  reservation_id?: number;
  schedule_id?: number;
  concert_id?: number;
  search?: string;
  sort?: SortOption;
  date_from?: string;
  date_to?: string;
}

// 예약 상세 정보 (모든 관련 정보 포함)
export interface ReservationDetail extends Reservation {
  seat_reservations: Array<
    SeatReservation & {
      seat_info: {
        seat_name: string;
        area_name: string;
        hall_name: string;
      };
      schedule_info: {
        start_time: string;
        end_time: string;
      };
      price_info: {
        price: number;
        seat_per_able_person: number;
      };
    }
  >;
  total_amount: number; // 총 결제 금액
  payment_status: 'PENDING' | 'PAID' | 'CANCELLED'; // 결제 상태
}

// 예약 통계 정보
export interface ReservationStats {
  total_reservations: number;
  active_reservations: number;
  cancelled_reservations: number;
  total_revenue: number;
  reservations_this_month: number;
  popular_concerts: Array<{
    concert_id: number;
    concert_title: string;
    reservation_count: number;
    revenue: number;
  }>;
  peak_hours: Array<{
    hour: number;
    reservation_count: number;
  }>;
}

// 좌석 예약 현황 조회
export interface SeatAvailabilityRequest {
  concert_id: number;
  schedule_id: number;
}

export interface SeatAvailabilityResponse {
  total_seats: number;
  available_seats: number;
  reserved_seats: number;
  seat_details: Array<{
    seat_id: number;
    seat_name: string;
    area_name: string;
    price: number;
    is_available: boolean;
    reserved_by?: string; // 예약자 정보 (관리자만)
  }>;
}

// 예약 취소 요청
export interface CancelReservationRequest {
  reason?: string; // 취소 사유
  refund_amount?: number; // 환불 금액
}
