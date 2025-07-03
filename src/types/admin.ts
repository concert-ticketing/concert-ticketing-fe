import {
  BaseEntity,
  AdminRoleType,
  AdminStateType,
  PaginationParams,
  SortOption,
  FilterOption,
} from './common';

// 관리자 기본 정보
export interface Admin extends BaseEntity {
  admin_id: string;
  password?: string;
  phone: string;
  role: AdminRoleType;
  email: string;
  company: string;
  company_number: string;
  company_location: string;
  state: AdminStateType;
}

// 관리자 생성 요청
export interface CreateAdminRequest {
  admin_id: string;
  password: string;
  phone: string;
  role: AdminRoleType;
  email: string;
  company: string;
  company_number: string;
  company_location: string;
  state?: AdminStateType;
}

// 관리자 수정 요청
export interface UpdateAdminRequest {
  phone?: string;
  role?: AdminRoleType;
  email?: string;
  company?: string;
  company_number?: string;
  company_location?: string;
  state?: AdminStateType;
}

// 관리자 비밀번호 변경 요청
export interface ChangeAdminPasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

// 관리자 목록 조회 파라미터
export interface GetAdminsParams extends PaginationParams {
  search?: string; // 관리자ID, 이메일, 회사명으로 검색
  role?: AdminRoleType;
  state?: AdminStateType;
  company?: string;
  sort?: SortOption;
  filters?: FilterOption[];
  date_from?: string; // 등록일 범위 조회
  date_to?: string;
}

// 관리자 상세 정보
export interface AdminDetail extends Admin {
  last_login_at?: string;
  login_count: number;
  managed_concerts_count: number; // 관리하는 콘서트 수
  managed_venues_count: number; // 관리하는 공연장 수
  created_casts_count: number; // 생성한 출연진 수
}

// 관리자 권한 정보
export interface AdminPermission {
  resource: string; // 리소스명 (users, concerts, venues, etc.)
  actions: Array<'create' | 'read' | 'update' | 'delete'>;
  scope?: 'own' | 'company' | 'all'; // 권한 범위
}

// 역할별 권한 매핑
export interface RolePermissions {
  role: AdminRoleType;
  permissions: AdminPermission[];
  description: string;
}

// 관리자 로그인 요청
export interface AdminLoginRequest {
  admin_id: string;
  password: string;
}

// 관리자 로그인 응답
export interface AdminLoginResponse {
  admin: Omit<Admin, 'password'>;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  permissions: AdminPermission[];
}

// 관리자 토큰 갱신 요청
export interface RefreshTokenRequest {
  refresh_token: string;
}

// 관리자 활동 로그
export interface AdminActivityLog {
  id: number;
  admin_id: number;
  action: string; // 수행한 작업
  resource: string; // 대상 리소스
  resource_id?: number; // 대상 리소스 ID
  details?: Record<string, unknown>; // 추가 상세 정보
  ip_address: string;
  user_agent: string;
  created_at: string;
  admin?: Admin;
}

// 관리자 활동 로그 조회 파라미터
export interface GetAdminActivityLogsParams extends PaginationParams {
  admin_id?: number;
  action?: string;
  resource?: string;
  date_from?: string;
  date_to?: string;
  ip_address?: string;
  sort?: SortOption;
}

// 관리자 통계 정보
export interface AdminStats {
  total_admins: number;
  active_admins: number;
  suspended_admins: number;
  new_admins_this_month: number;
  role_distribution: Array<{
    role: AdminRoleType;
    count: number;
    percentage: number;
  }>;
  company_distribution: Array<{
    company: string;
    admin_count: number;
    concert_count: number;
    venue_count: number;
  }>;
  recent_activities: AdminActivityLog[];
}

// 관리자 세션 정보
export interface AdminSession {
  session_id: string;
  admin_id: number;
  created_at: string;
  last_accessed_at: string;
  ip_address: string;
  user_agent: string;
  is_active: boolean;
}

// 관리자 세션 목록 조회
export interface GetAdminSessionsParams extends PaginationParams {
  admin_id?: number;
  is_active?: boolean;
  date_from?: string;
  date_to?: string;
}

// 관리자 계정 잠금/해제
export interface LockUnlockAdminRequest {
  admin_id: number;
  reason?: string;
  lock_until?: string; // 잠금 해제 시간 (없으면 수동 해제)
}

// 관리자 비밀번호 재설정 (슈퍼 관리자용)
export interface ResetAdminPasswordRequest {
  admin_id: number;
  new_password: string;
  force_change_on_login: boolean; // 다음 로그인 시 비밀번호 변경 강제
}
