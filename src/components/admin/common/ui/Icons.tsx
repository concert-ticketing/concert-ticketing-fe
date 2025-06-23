import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const Icons = {
  // 네비게이션
  ArrowLeft: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='m12 19-7-7 7-7' />
        <path d='M19 12H5' />
      </svg>
    ) as React.JSX.Element,

  ArrowRight: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='M5 12h14' />
        <path d='m12 5 7 7-7 7' />
      </svg>
    ) as React.JSX.Element,

  // 편집 관련
  Edit: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z' />
        <path d='m15 5 4 4' />
      </svg>
    ) as React.JSX.Element,

  // 상태 아이콘
  CheckCircle: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
        <path d='m9 11 3 3L22 4' />
      </svg>
    ) as React.JSX.Element,

  XCircle: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <circle cx='12' cy='12' r='10' />
        <path d='m15 9-6 6' />
        <path d='m9 9 6 6' />
      </svg>
    ) as React.JSX.Element,

  AlertCircle: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <circle cx='12' cy='12' r='10' />
        <line x1='12' y1='8' x2='12' y2='12' />
        <line x1='12' y1='16' x2='12.01' y2='16' />
      </svg>
    ) as React.JSX.Element,

  // UI 컨트롤
  X: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='M18 6 6 18' />
        <path d='m6 6 12 12' />
      </svg>
    ) as React.JSX.Element,

  Check: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='m9 12 2 2 4-4' />
      </svg>
    ) as React.JSX.Element,

  // 뷰 모드
  Grid: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <rect width='7' height='7' x='3' y='3' rx='1' />
        <rect width='7' height='7' x='14' y='3' rx='1' />
        <rect width='7' height='7' x='14' y='14' rx='1' />
        <rect width='7' height='7' x='3' y='14' rx='1' />
      </svg>
    ) as React.JSX.Element,

  Map: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z' />
        <path d='m9 3 0 15' />
        <path d='m15 6 0 15' />
      </svg>
    ) as React.JSX.Element,

  // 장소/위치
  MapPin: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z' />
        <circle cx='12' cy='10' r='3' />
      </svg>
    ) as React.JSX.Element,

  // 좌석
  Seat: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z' />
        <path d='M9 13v6' />
        <path d='M15 13v6' />
      </svg>
    ) as React.JSX.Element,

  // 로딩
  Loading: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='M21 12a9 9 0 1 1-6.219-8.56' />
      </svg>
    ) as React.JSX.Element,

  // 대시보드
  BarChart: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <line x1='12' y1='20' x2='12' y2='10' />
        <line x1='18' y1='20' x2='18' y2='4' />
        <line x1='6' y1='20' x2='6' y2='16' />
      </svg>
    ) as React.JSX.Element,

  // 설정
  Settings: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z' />
        <circle cx='12' cy='12' r='3' />
      </svg>
    ) as React.JSX.Element,

  // 플러스/마이너스
  Plus: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='M5 12h14' />
        <path d='M12 5v14' />
      </svg>
    ) as React.JSX.Element,

  Minus: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='M5 12h14' />
      </svg>
    ) as React.JSX.Element,

  // 검색
  Search: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <circle cx='11' cy='11' r='8' />
        <path d='m21 21-4.35-4.35' />
      </svg>
    ) as React.JSX.Element,

  // 필터
  Filter: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <polygon points='22,3 2,3 10,12.46 10,19 14,21 14,12.46' />
      </svg>
    ) as React.JSX.Element,

  // 사용자
  User: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
        <circle cx='12' cy='7' r='4' />
      </svg>
    ) as React.JSX.Element,

  Users: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
        <circle cx='9' cy='7' r='4' />
        <path d='M22 21v-2a4 4 0 0 0-3-3.87' />
        <path d='M16 3.13a4 4 0 0 1 0 7.75' />
      </svg>
    ) as React.JSX.Element,

  // 카렌다
  Calendar: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='M8 2v4' />
        <path d='M16 2v4' />
        <rect width='18' height='18' x='3' y='4' rx='2' />
        <path d='M3 10h18' />
      </svg>
    ) as React.JSX.Element,

  // 시계
  Clock: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <circle cx='12' cy='12' r='10' />
        <polyline points='12,6 12,12 16,14' />
      </svg>
    ) as React.JSX.Element,

  // 음악/공연
  Music: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='M9 18V5l12-2v13' />
        <circle cx='6' cy='18' r='3' />
        <circle cx='18' cy='16' r='3' />
      </svg>
    ) as React.JSX.Element,

  // 파일
  Upload: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
        <polyline points='7,10 12,5 17,10' />
        <line x1='12' y1='5' x2='12' y2='15' />
      </svg>
    ) as React.JSX.Element,

  Download: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
        <polyline points='7,10 12,15 17,10' />
        <line x1='12' y1='15' x2='12' y2='3' />
      </svg>
    ) as React.JSX.Element,

  // 더 보기
  MoreHorizontal: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <circle cx='12' cy='12' r='1' />
        <circle cx='19' cy='12' r='1' />
        <circle cx='5' cy='12' r='1' />
      </svg>
    ) as React.JSX.Element,

  MoreVertical: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <circle cx='12' cy='12' r='1' />
        <circle cx='12' cy='5' r='1' />
        <circle cx='12' cy='19' r='1' />
      </svg>
    ) as React.JSX.Element,

  // 삭제
  Trash: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='M3 6h18' />
        <path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' />
        <path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' />
      </svg>
    ) as React.JSX.Element,

  // 복사
  Copy: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <rect width='14' height='14' x='8' y='8' rx='2' ry='2' />
        <path d='M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' />
      </svg>
    ) as React.JSX.Element,

  // 저장
  Save: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z' />
        <polyline points='17,21 17,13 7,13 7,21' />
        <polyline points='7,3 7,8 15,8' />
      </svg>
    ) as React.JSX.Element,

  // 새로고침
  RefreshCw: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8' />
        <path d='M21 3v5h-5' />
        <path d='M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16' />
        <path d='M8 16H3v5' />
      </svg>
    ) as React.JSX.Element,

  // 눈 (보기)
  Eye: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z' />
        <circle cx='12' cy='12' r='3' />
      </svg>
    ) as React.JSX.Element,

  EyeOff: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='M9.88 9.88a3 3 0 1 0 4.24 4.24' />
        <path d='M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68' />
        <path d='M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61' />
        <line x1='2' y1='2' x2='22' y2='22' />
      </svg>
    ) as React.JSX.Element,

  // 햄버거 메뉴
  Menu: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <line x1='4' y1='6' x2='20' y2='6' />
        <line x1='4' y1='12' x2='20' y2='12' />
        <line x1='4' y1='18' x2='20' y2='18' />
      </svg>
    ) as React.JSX.Element,

  // 추가된 아이콘들 - RowManager용
  Layers: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.9a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z' />
        <path d='m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65' />
        <path d='m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65' />
      </svg>
    ) as React.JSX.Element,

  Zap: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='M4 14a1 1 0 0 1-.78-1.63L9.9 5.24a1 1 0 0 1 1.56 0l6.68 7.13A1 1 0 0 1 17.36 14Z' />
      </svg>
    ) as React.JSX.Element,

  Info: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <circle cx='12' cy='12' r='10' />
        <path d='m9 12 2 2 4-4' />
      </svg>
    ) as React.JSX.Element,

  Target: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <circle cx='12' cy='12' r='10' />
        <circle cx='12' cy='12' r='6' />
        <circle cx='12' cy='12' r='2' />
      </svg>
    ) as React.JSX.Element,

  // ControlPanel용 추가 아이콘들
  BarChart3: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='M3 3v18h18' />
        <path d='m19 9-5 5-4-4-3 3' />
      </svg>
    ) as React.JSX.Element,

  Grid3x3: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <rect width='18' height='18' x='3' y='3' rx='2' />
        <path d='M9 3v18' />
        <path d='M15 3v18' />
        <path d='M3 9h18' />
        <path d='M3 15h18' />
      </svg>
    ) as React.JSX.Element,

  MousePointer: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z' />
        <path d='m13 13 6 6' />
      </svg>
    ) as React.JSX.Element,

  CheckSquare: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <polyline points='9,11 12,14 22,4' />
        <path d='M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' />
      </svg>
    ) as React.JSX.Element,

  Square: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <rect width='18' height='18' x='3' y='3' rx='2' />
      </svg>
    ) as React.JSX.Element,

  Trash2: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='M3 6h18' />
        <path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' />
        <path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' />
        <line x1='10' y1='11' x2='10' y2='17' />
        <line x1='14' y1='11' x2='14' y2='17' />
      </svg>
    ) as React.JSX.Element,

  HelpCircle: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <circle cx='12' cy='12' r='10' />
        <path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' />
        <path d='M12 17h.01' />
      </svg>
    ) as React.JSX.Element,

  Move: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <polyline points='5,9 2,12 5,15' />
        <polyline points='9,5 12,2 15,5' />
        <polyline points='15,19 12,22 9,19' />
        <polyline points='19,9 22,12 19,15' />
        <line x1='2' y1='12' x2='22' y2='12' />
        <line x1='12' y1='2' x2='12' y2='22' />
      </svg>
    ) as React.JSX.Element,

  RotateCcw: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <path d='M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' />
        <path d='M3 3v5h5' />
      </svg>
    ) as React.JSX.Element,

  Keyboard: ({ className, size = 20 }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <rect width='20' height='16' x='2' y='4' rx='2' />
        <path d='M6 8h.01' />
        <path d='M10 8h.01' />
        <path d='M14 8h.01' />
        <path d='M18 8h.01' />
        <path d='M8 12h.01' />
        <path d='M12 12h.01' />
        <path d='M16 12h.01' />
        <path d='M7 16h10' />
      </svg>
    ) as React.JSX.Element,
};
