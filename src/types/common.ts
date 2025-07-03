// 공통 타입 및 Enum 정의

// 공통 기본 타입
export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at?: string;
  deleted_at?: string | null;
}

// 사용자 관련 Enum
export const UserGender = {
  WOMAN: 'woman',
  MAN: 'man',
} as const;

export const UserState = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type UserGenderType = (typeof UserGender)[keyof typeof UserGender];
export type UserStateType = (typeof UserState)[keyof typeof UserState];

// 관리자 관련 Enum
export const AdminRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
} as const;

export const AdminState = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
} as const;

export type AdminRoleType = (typeof AdminRole)[keyof typeof AdminRole];
export type AdminStateType = (typeof AdminState)[keyof typeof AdminState];

// 출연진 역할 Enum
export const CastRole = {
  MAIN: 'MAIN',
  SUPPORTING: 'SUPPORTING',
  GUEST: 'GUEST',
} as const;

export type CastRoleType = (typeof CastRole)[keyof typeof CastRole];

// 예약 상태 Enum
export const ReservationState = {
  RESERVED: 'RESERVED',
  CANCELLED: 'CANCELLED',
} as const;

export type ReservationStateType =
  (typeof ReservationState)[keyof typeof ReservationState];

// 결제 상태 Enum
export const PaymentState = {
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
} as const;

export type PaymentStateType = (typeof PaymentState)[keyof typeof PaymentState];

// 문의 타입 Enum
export const InquiryType = {
  BOOKING: 'BOOKING',
  PRODUCT: 'PRODUCT',
  DELIVERY: 'DELIVERY',
  CANCELLATION: 'CANCELLATION',
  MEMBER: 'MEMBER',
  ETC: 'ETC',
} as const;

export type InquiryTypeType = (typeof InquiryType)[keyof typeof InquiryType];

// 문의 상태 Enum
export const InquiryStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
} as const;

export type InquiryStatusType = (typeof InquiryStatus)[keyof typeof InquiryStatus];

// 신고 사유 Enum
export const ReportReason = {
  INAPPROPRIATE_CONTENT: 'INAPPROPRIATE_CONTENT',
  SPAM: 'SPAM',
  HARASSMENT: 'HARASSMENT',
  FALSE_INFORMATION: 'FALSE_INFORMATION',
  ETC: 'ETC',
} as const;

export type ReportReasonType = (typeof ReportReason)[keyof typeof ReportReason];

// 페이지네이션 공통 타입
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// API 응답 공통 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
}

// 정렬 옵션
export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

// 필터 옵션
export interface FilterOption {
  field: string;
  value: string | number | boolean;
  operator?: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in';
}
