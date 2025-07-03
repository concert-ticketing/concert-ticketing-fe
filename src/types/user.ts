import {
  BaseEntity,
  UserGenderType,
  UserStateType,
  PaginationParams,
  SortOption,
  FilterOption,
} from './common';

// 사용자 기본 정보
export interface User extends BaseEntity {
  user_id: string;
  email: string;
  name: string;
  phone: string;
  gender: UserGenderType;
  state: UserStateType;
}

// 사용자 생성 시 필요한 데이터
export interface CreateUserRequest {
  user_id: string;
  email: string;
  name: string;
  phone: string;
  gender: UserGenderType;
  state?: UserStateType;
}

// 사용자 수정 시 필요한 데이터
export interface UpdateUserRequest {
  email?: string;
  name?: string;
  phone?: string;
  gender?: UserGenderType;
  state?: UserStateType;
}

// 블랙리스트
export interface BlackList extends BaseEntity {
  user_id: number;
  reason: string;
  user?: User; // 조인된 사용자 정보
}

// 블랙리스트 생성 요청
export interface CreateBlackListRequest {
  user_id: number;
  reason: string;
}

// 블랙리스트 수정 요청
export interface UpdateBlackListRequest {
  reason?: string;
}

// 사용자 목록 조회 파라미터
export interface GetUsersParams extends PaginationParams {
  search?: string; // 이름, 이메일, 사용자ID로 검색
  gender?: UserGenderType;
  state?: UserStateType;
  sort?: SortOption;
  filters?: FilterOption[];
  date_from?: string; // 가입일 범위 조회
  date_to?: string;
}

// 블랙리스트 목록 조회 파라미터
export interface GetBlackListParams extends PaginationParams {
  search?: string; // 사용자 정보로 검색
  reason?: string; // 사유로 검색
  sort?: SortOption;
  date_from?: string; // 등록일 범위 조회
  date_to?: string;
}

// 사용자 상세 정보 (예약 내역 포함)
export interface UserDetail extends User {
  reservation_count: number; // 예약 횟수
  total_payment: number; // 총 결제 금액
  last_reservation_date?: string; // 마지막 예약일
  is_blacklisted: boolean; // 블랙리스트 여부
  blacklist_reason?: string; // 블랙리스트 사유
}

// 사용자 통계 정보
export interface UserStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  blacklisted_users: number;
  new_users_this_month: number;
  gender_distribution: {
    woman: number;
    man: number;
  };
}

// 사용자 활동 내역
export interface UserActivity {
  type: 'RESERVATION' | 'CANCELLATION' | 'PAYMENT' | 'LOGIN';
  description: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}

export interface GetUserActivitiesParams extends PaginationParams {
  user_id: number;
  type?: UserActivity['type'];
  date_from?: string;
  date_to?: string;
}
