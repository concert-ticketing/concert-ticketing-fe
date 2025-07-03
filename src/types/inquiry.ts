import { User } from './user';

import {
  BaseEntity,
  InquiryTypeType,
  InquiryStatusType,
  PaginationParams,
  SortOption,
  FilterOption,
} from './common';

// 문의 기본 정보
export interface Inquiry extends BaseEntity {
  user_id: number;
  title: string;
  content: string;
  type: InquiryTypeType;
  status: InquiryStatusType;
  replied_at?: string;
  // 조인된 정보
  user?: User;
}

// 문의 생성 요청 (사용자용)
export interface CreateInquiryRequest {
  user_id: number;
  title: string;
  content: string;
  type: InquiryTypeType;
  attachments?: File[]; // 첨부파일
}

// 문의 수정 요청 (사용자용 - 답변 전에만 가능)
export interface UpdateInquiryRequest {
  title?: string;
  content?: string;
  type?: InquiryTypeType;
}

// 문의 답변 요청 (관리자용)
export interface ReplyInquiryRequest {
  inquiry_id: number;
  reply_content: string;
  admin_id: number;
}

// 문의 목록 조회 파라미터
export interface GetInquiriesParams extends PaginationParams {
  search?: string; // 제목, 내용, 사용자명으로 검색
  user_id?: number;
  type?: InquiryTypeType;
  status?: InquiryStatusType;
  sort?: SortOption;
  filters?: FilterOption[];
  date_from?: string;
  date_to?: string;
  replied_date_from?: string; // 답변일 범위
  replied_date_to?: string;
}

// 문의 상세 정보
export interface InquiryDetail extends Inquiry {
  attachments: Array<{
    id: number;
    filename: string;
    filesize: number;
    content_type: string;
    download_url: string;
  }>;
  reply?: {
    id: number;
    content: string;
    admin_id: number;
    admin_name: string;
    replied_at: string;
  };
  read_by_admin: boolean; // 관리자가 읽었는지
  read_at?: string; // 관리자가 읽은 시간
}

// 문의 통계 정보
export interface InquiryStats {
  total_inquiries: number;
  pending_inquiries: number;
  completed_inquiries: number;
  inquiries_this_month: number;
  average_response_time: number; // 평균 응답 시간 (시간 단위)
  type_distribution: Array<{
    type: InquiryTypeType;
    count: number;
    percentage: number;
  }>;
  urgent_inquiries: number; // 3일 이상 미답변 문의
  recent_inquiries: Inquiry[];
}

// 문의 대량 처리 요청
export interface BulkInquiryAction {
  inquiry_ids: number[];
  action: 'MARK_READ' | 'DELETE' | 'CHANGE_STATUS';
  status?: InquiryStatusType; // CHANGE_STATUS 액션용
}

// 문의 템플릿 (자주 사용하는 답변)
export interface InquiryTemplate {
  id: number;
  title: string;
  content: string;
  type: InquiryTypeType;
  usage_count: number;
  created_by: number;
  created_at: string;
}

// 문의 템플릿 생성/수정 요청
export interface CreateInquiryTemplateRequest {
  title: string;
  content: string;
  type: InquiryTypeType;
}

export interface UpdateInquiryTemplateRequest {
  title?: string;
  content?: string;
  type?: InquiryTypeType;
}
