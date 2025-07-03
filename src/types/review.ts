import { User } from './user';

import {
  BaseEntity,
  ReportReasonType,
  PaginationParams,
  SortOption,
  FilterOption,
} from './common';
import { Concert } from './concert';
import { Admin } from './admin';

// 리뷰 기본 정보
export interface Review extends BaseEntity {
  user_id: number;
  concert_id: number;
  rating: number;
  content: string;
  // 조인된 정보
  user?: User;
  concert?: Concert;
}

// 신고 정보
export interface Report extends BaseEntity {
  admin_id: number;
  reason: ReportReasonType;
  review_id: number;
  // 조인된 정보
  admin?: Admin;
  review?: Review;
}

// 리뷰 생성 요청
export interface CreateReviewRequest {
  user_id: number;
  concert_id: number;
  rating: number;
  content: string;
}

// 리뷰 수정 요청
export interface UpdateReviewRequest {
  rating?: number;
  content?: string;
}

// 신고 생성 요청
export interface CreateReportRequest {
  admin_id: number;
  reason: ReportReasonType;
  review_id: number;
  description?: string; // 추가 설명
}

// 리뷰 목록 조회 파라미터
export interface GetReviewsParams extends PaginationParams {
  search?: string; // 내용, 사용자명, 콘서트명으로 검색
  user_id?: number;
  concert_id?: number;
  rating_min?: number;
  rating_max?: number;
  has_reports?: boolean; // 신고가 있는 리뷰만
  sort?: SortOption;
  filters?: FilterOption[];
  date_from?: string;
  date_to?: string;
}

// 신고 목록 조회 파라미터
export interface GetReportsParams extends PaginationParams {
  search?: string;
  admin_id?: number;
  review_id?: number;
  reason?: ReportReasonType;
  status?: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  sort?: SortOption;
  date_from?: string;
  date_to?: string;
}

// 리뷰 상세 정보
export interface ReviewDetail extends Review {
  report_count: number;
  reports: Report[];
  is_blocked: boolean; // 차단된 리뷰인지
  block_reason?: string;
  blocked_at?: string;
  blocked_by?: number; // 차단한 관리자 ID
}

// 리뷰 통계 정보
export interface ReviewStats {
  total_reviews: number;
  reviews_this_month: number;
  average_rating: number;
  rating_distribution: Array<{
    rating: number;
    count: number;
    percentage: number;
  }>;
  reported_reviews: number;
  blocked_reviews: number;
  top_reviewed_concerts: Array<{
    concert_id: number;
    concert_title: string;
    review_count: number;
    average_rating: number;
  }>;
}

// 리뷰 차단/해제 요청
export interface BlockReviewRequest {
  review_id: number;
  reason: string;
  notify_user: boolean; // 사용자에게 알림 발송 여부
}
