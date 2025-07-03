import {
  BaseEntity,
  PaymentStateType,
  PaginationParams,
  SortOption,
  FilterOption,
} from './common';
import { Reservation, ReservationDetail } from './reservation';

// 결제 수단 타입
export const PaymentMethod = {
  CREDIT_CARD: 'CREDIT_CARD',
  DEBIT_CARD: 'DEBIT_CARD',
  BANK_TRANSFER: 'BANK_TRANSFER',
  VIRTUAL_ACCOUNT: 'VIRTUAL_ACCOUNT',
  MOBILE_PAYMENT: 'MOBILE_PAYMENT',
  POINT: 'POINT',
} as const;

export type PaymentMethodType = (typeof PaymentMethod)[keyof typeof PaymentMethod];

// 결제 상세 정보 (PG사 연동 데이터)
export interface PaymentDetails {
  payment_method: PaymentMethodType;
  pg_provider: string; // PG사명 (ex: 'toss', 'nice', 'kakao')
  pg_transaction_id: string; // PG사 거래 고유번호
  card_info?: {
    card_company: string;
    card_number_masked: string; // 마스킹된 카드번호
    installment: number; // 할부 개월수
  };
  bank_info?: {
    bank_name: string;
    account_number_masked: string;
  };
  mobile_info?: {
    provider: string; // 카카오페이, 네이버페이 등
    phone_number_masked: string;
  };
}

// 결제 기본 정보
export interface Payment extends BaseEntity {
  reservation_id: number;
  total_price: number;
  state: PaymentStateType;
  // 조인된 정보
  reservation?: Reservation;
}

// 결제 수정 요청 (상태 변경, 환불 등)
export interface UpdatePaymentRequest {
  state: PaymentStateType;
  refund_amount?: number;
  refund_reason?: string;
}

// 결제 목록 조회 파라미터
export interface GetPaymentsParams extends PaginationParams {
  search?: string; // 예약자명, 콘서트명으로 검색
  reservation_id?: number;
  user_id?: number;
  concert_id?: number;
  state?: PaymentStateType;
  payment_method?: PaymentMethodType;
  amount_min?: number; // 결제 금액 범위
  amount_max?: number;
  sort?: SortOption;
  filters?: FilterOption[];
  date_from?: string; // 결제일 범위 조회
  date_to?: string;
}

// 결제 상세 정보 (모든 관련 정보 포함)
export interface PaymentDetail extends Payment {
  payment_details: PaymentDetails;
  reservation_detail: ReservationDetail;
  refund_history?: Array<{
    id: number;
    amount: number;
    reason: string;
    processed_at: string;
    processed_by: number; // 처리한 관리자 ID
  }>;
}

// 결제 통계 정보
export interface PaymentStats {
  total_payments: number;
  successful_payments: number;
  cancelled_payments: number;
  total_revenue: number;
  total_refunds: number;
  payments_this_month: number;
  revenue_this_month: number;
  payment_method_distribution: Array<{
    method: PaymentMethodType;
    count: number;
    amount: number;
    percentage: number;
  }>;
  daily_revenue: Array<{
    date: string;
    revenue: number;
    payment_count: number;
  }>;
}

// 환불 요청
export interface RefundPaymentRequest {
  payment_id: number;
  refund_amount: number;
  refund_reason: string;
  refund_method?: 'ORIGINAL' | 'BANK_TRANSFER'; // 원결제수단 또는 계좌이체
  bank_info?: {
    bank_name: string;
    account_number: string;
    account_holder: string;
  };
}

// 환불 응답
export interface RefundPaymentResponse {
  refund_id: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  refund_amount: number;
  estimated_completion: string; // 예상 완료일
  pg_refund_id?: string; // PG사 환불 거래번호
}

// 매출 분석 요청
export interface RevenueAnalysisRequest {
  date_from: string;
  date_to: string;
  group_by: 'day' | 'week' | 'month';
  concert_id?: number;
  venue_id?: number;
}

// 매출 분석 응답
export interface RevenueAnalysisResponse {
  period: {
    start: string;
    end: string;
  };
  total_revenue: number;
  total_payments: number;
  average_payment: number;
  growth_rate: number; // 전 기간 대비 성장률
  data: Array<{
    period: string;
    revenue: number;
    payment_count: number;
    refund_count: number;
    refund_amount: number;
  }>;
  top_concerts: Array<{
    concert_id: number;
    concert_title: string;
    revenue: number;
    payment_count: number;
  }>;
}

// 결제 상태 변경 이력
export interface PaymentStatusHistory {
  id: number;
  payment_id: number;
  from_state: PaymentStateType;
  to_state: PaymentStateType;
  reason?: string;
  changed_by: number; // 변경한 관리자 ID
  changed_at: string;
}
