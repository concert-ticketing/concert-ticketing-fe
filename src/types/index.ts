// 공통 타입 및 Enum
// 타입 가드 함수들
import React from 'react';

import {
  UserGender,
  UserState,
  AdminRole,
  AdminState,
  ReservationState,
  PaymentState,
  InquiryType,
  InquiryStatus,
} from './common';
import { CreateConcertRequest, CreateConcertScheduleRequest } from './concert';

export * from './common';

// 기존 타입들
export * from './venues';
export * from './seat';

// 새로 추가된 ERD 기반 타입들
export * from './user';
export * from './admin';
export * from './reservation';
export * from './payment';
export * from './review';
export * from './inquiry';

export function isValidUserGender(
  value: string,
): value is (typeof UserGender)[keyof typeof UserGender] {
  return Object.values(UserGender).includes(
    value as (typeof UserGender)[keyof typeof UserGender],
  );
}

export function isValidUserState(
  value: string,
): value is (typeof UserState)[keyof typeof UserState] {
  return Object.values(UserState).includes(
    value as (typeof UserState)[keyof typeof UserState],
  );
}

export function isValidAdminRole(
  value: string,
): value is (typeof AdminRole)[keyof typeof AdminRole] {
  return Object.values(AdminRole).includes(
    value as (typeof AdminRole)[keyof typeof AdminRole],
  );
}

export function isValidAdminState(
  value: string,
): value is (typeof AdminState)[keyof typeof AdminState] {
  return Object.values(AdminState).includes(
    value as (typeof AdminState)[keyof typeof AdminState],
  );
}

export function isValidReservationState(
  value: string,
): value is (typeof ReservationState)[keyof typeof ReservationState] {
  return Object.values(ReservationState).includes(
    value as (typeof ReservationState)[keyof typeof ReservationState],
  );
}

export function isValidPaymentState(
  value: string,
): value is (typeof PaymentState)[keyof typeof PaymentState] {
  return Object.values(PaymentState).includes(
    value as (typeof PaymentState)[keyof typeof PaymentState],
  );
}

export function isValidInquiryType(
  value: string,
): value is (typeof InquiryType)[keyof typeof InquiryType] {
  return Object.values(InquiryType).includes(
    value as (typeof InquiryType)[keyof typeof InquiryType],
  );
}

export function isValidInquiryStatus(
  value: string,
): value is (typeof InquiryStatus)[keyof typeof InquiryStatus] {
  return Object.values(InquiryStatus).includes(
    value as (typeof InquiryStatus)[keyof typeof InquiryStatus],
  );
}

// 유틸리티 타입들
export type EntityWithUser<T> = T & { user: import('./user').User };
export type EntityWithAdmin<T> = T & { admin: import('./admin').Admin };
export type EntityWithConcert<T> = T & { concert: import('./concert').Concert };

// API 응답 래퍼 타입들
export type UserResponse = import('./common').ApiResponse<import('./user').User>;
export type UsersResponse = import('./common').ApiResponse<
  import('./common').PaginationResponse<import('./user').User>
>;
export type AdminResponse = import('./common').ApiResponse<import('./admin').Admin>;
export type AdminsResponse = import('./common').ApiResponse<
  import('./common').PaginationResponse<import('./admin').Admin>
>;
export type ConcertResponse = import('./common').ApiResponse<import('./concert').Concert>;
export type ConcertsResponse = import('./common').ApiResponse<
  import('./common').PaginationResponse<import('./concert').Concert>
>;
export type ReservationResponse = import('./common').ApiResponse<
  import('./reservation').Reservation
>;
export type ReservationsResponse = import('./common').ApiResponse<
  import('./common').PaginationResponse<import('./reservation').Reservation>
>;
export type PaymentResponse = import('./common').ApiResponse<import('./payment').Payment>;
export type PaymentsResponse = import('./common').ApiResponse<
  import('./common').PaginationResponse<import('./payment').Payment>
>;

// 폼 데이터 타입들 (클라이언트 사이드용)
export interface UserFormData extends Omit<import('./user').CreateUserRequest, 'state'> {
  state: import('./common').UserStateType;
}

export interface AdminFormData
  extends Omit<import('./admin').CreateAdminRequest, 'state'> {
  state: import('./common').AdminStateType;
  confirm_password: string;
}

export interface ConcertFormData extends CreateConcertRequest {
  schedules?: Array<Omit<CreateConcertScheduleRequest, 'concert_id'>>;
  casts?: Array<{
    cast_id: number;
    role: import('./common').CastRoleType;
  }>;
}

// 테이블 컬럼 정의 (관리자 페이지 테이블용)
export interface TableColumn<T = unknown> {
  key: keyof T | string;
  title: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: unknown, record: T) => React.ReactNode;
}

// 검색 폼 타입들
export interface SearchFormBase {
  search?: string;
  date_from?: string;
  date_to?: string;
  sort_field?: string;
  sort_direction?: 'asc' | 'desc';
}

export interface UserSearchForm extends SearchFormBase {
  gender?: import('./common').UserGenderType;
  state?: import('./common').UserStateType;
}

export interface ConcertSearchForm extends SearchFormBase {
  admin_id?: number;
  location?: string;
  rating_min?: number;
  rating_max?: number;
}

export interface ReservationSearchForm extends SearchFormBase {
  user_id?: number;
  concert_id?: number;
  state?: import('./common').ReservationStateType;
}

export interface PaymentSearchForm extends SearchFormBase {
  state?: import('./common').PaymentStateType;
  amount_min?: number;
  amount_max?: number;
}
