import React from 'react';
import Link from 'next/link';

import styles from './dashboard.module.css';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}

interface RecentActivityItem {
  id: string;
  type: 'venue_created' | 'venue_updated' | 'concert_scheduled';
  title: string;
  description: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'info';
}

interface UpcomingEvent {
  id: string;
  title: string;
  venue: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  attendees: number;
}

// 아이콘 컴포넌트들
const VenueStatsIcon = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <circle cx='12' cy='12' r='10' />
    <line x1='12' y1='8' x2='12' y2='16' />
    <line x1='8' y1='12' x2='16' y2='12' />
  </svg>
);

const EventStatsIcon = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <rect x='3' y='4' width='18' height='18' rx='2' ry='2' />
    <line x1='16' y1='2' x2='16' y2='6' />
    <line x1='8' y1='2' x2='8' y2='6' />
    <line x1='3' y1='10' x2='21' y2='10' />
  </svg>
);

const RevenueIcon = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <line x1='12' y1='1' x2='12' y2='23' />
    <path d='M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
  </svg>
);

const VisitorIcon = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' />
    <circle cx='9' cy='7' r='4' />
    <path d='M23 21v-2a4 4 0 0 0-3-3.87' />
    <path d='M16 3.13a4 4 0 0 1 0 7.75' />
  </svg>
);

const TrendUpIcon = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <polyline points='23,6 13.5,15.5 8.5,10.5 1,18' />
    <polyline points='17,6 23,6 23,12' />
  </svg>
);

const TrendDownIcon = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <polyline points='23,18 13.5,8.5 8.5,13.5 1,6' />
    <polyline points='17,18 23,18 23,12' />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <line x1='5' y1='12' x2='19' y2='12' />
    <polyline points='12,5 19,12 12,19' />
  </svg>
);

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
}) => (
  <div className={styles.statCard}>
    <div className={styles.statCardHeader}>
      <div className={styles.statCardIcon}>{icon}</div>
      <div className={styles.statCardInfo}>
        <h3 className={styles.statCardTitle}>{title}</h3>
        <div className={styles.statCardValue}>{value}</div>
      </div>
    </div>
    {change && (
      <div className={`${styles.statCardChange} ${styles[changeType || 'neutral']}`}>
        {changeType === 'positive' && <TrendUpIcon />}
        {changeType === 'negative' && <TrendDownIcon />}
        <span>{change}</span>
      </div>
    )}
  </div>
);

export default function Dashboard() {
  // 샘플 데이터
  const statsData = [
    {
      title: '총 콘서트장',
      value: 12,
      change: '+2 이번 달',
      changeType: 'positive' as const,
      icon: <VenueStatsIcon />,
    },
    {
      title: '예정된 이벤트',
      value: 28,
      change: '+5 이번 주',
      changeType: 'positive' as const,
      icon: <EventStatsIcon />,
    },
    {
      title: '이번 달 수익',
      value: '₩45,200,000',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: <RevenueIcon />,
    },
    {
      title: '총 방문객',
      value: '156,847',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: <VisitorIcon />,
    },
  ];

  const recentActivities: RecentActivityItem[] = [
    {
      id: '1',
      type: 'venue_created',
      title: '새 콘서트장 등록',
      description: '올림픽공원 콘서트홀이 등록되었습니다.',
      timestamp: '2시간 전',
      status: 'success',
    },
    {
      id: '2',
      type: 'concert_scheduled',
      title: '콘서트 일정 등록',
      description: 'IU 콘서트가 잠실종합운동장에 예약되었습니다.',
      timestamp: '4시간 전',
      status: 'info',
    },
    {
      id: '3',
      type: 'venue_updated',
      title: '콘서트장 정보 업데이트',
      description: '코엑스 홀 D의 좌석 배치가 수정되었습니다.',
      timestamp: '6시간 전',
      status: 'warning',
    },
    {
      id: '4',
      type: 'venue_created',
      title: '새 콘서트장 등록',
      description: '롯데콘서트홀이 등록되었습니다.',
      timestamp: '1일 전',
      status: 'success',
    },
  ];

  const upcomingEvents: UpcomingEvent[] = [
    {
      id: '1',
      title: 'BTS 월드투어',
      venue: '잠실종합운동장',
      date: '2025-06-15',
      time: '19:00',
      status: 'confirmed',
      attendees: 50000,
    },
    {
      id: '2',
      title: 'IU 골든아워 콘서트',
      venue: '올림픽공원 체조경기장',
      date: '2025-06-18',
      time: '18:00',
      status: 'confirmed',
      attendees: 15000,
    },
    {
      id: '3',
      title: 'NewJeans 팬미팅',
      venue: '코엑스 홀 D',
      date: '2025-06-20',
      time: '16:00',
      status: 'pending',
      attendees: 8000,
    },
    {
      id: '4',
      title: 'SEVENTEEN 콘서트',
      venue: 'KSPO DOME',
      date: '2025-06-25',
      time: '19:30',
      status: 'confirmed',
      attendees: 12000,
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      confirmed: { text: '확정', className: styles.statusConfirmed },
      pending: { text: '대기', className: styles.statusPending },
      cancelled: { text: '취소', className: styles.statusCancelled },
      success: { text: '성공', className: styles.statusSuccess },
      warning: { text: '주의', className: styles.statusWarning },
      info: { text: '정보', className: styles.statusInfo },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap];
    return (
      <span className={`${styles.statusBadge} ${statusInfo.className}`}>
        {statusInfo.text}
      </span>
    );
  };

  return (
    <div className={styles.dashboard}>
      {/* 헤더 */}
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.dashboardTitle}>대시보드</h1>
          <p className={styles.dashboardSubtitle}>
            콘서트장 관리 현황을 한눈에 확인하세요
          </p>
        </div>
        <div className={styles.dashboardActions}>
          <Link href='/admin/create' className={styles.primaryButton}>
            새 콘서트장 등록
          </Link>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className={styles.statsGrid}>
        {statsData.map((stat) => (
          <StatCard
            key={stat.value}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* 메인 컨텐츠 그리드 */}
      <div className={styles.contentGrid}>
        {/* 최근 활동 */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>최근 활동</h2>
            <Link href='/admin/activities' className={styles.cardAction}>
              전체 보기 <ArrowRightIcon />
            </Link>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.activityList}>
              {recentActivities.map((activity) => (
                <div key={activity.id} className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    {activity.status && getStatusBadge(activity.status)}
                  </div>
                  <div className={styles.activityContent}>
                    <h4 className={styles.activityTitle}>{activity.title}</h4>
                    <p className={styles.activityDescription}>{activity.description}</p>
                    <span className={styles.activityTimestamp}>{activity.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 예정된 이벤트 */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>예정된 이벤트</h2>
            <Link href='/admin/events' className={styles.cardAction}>
              전체 보기 <ArrowRightIcon />
            </Link>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.eventList}>
              {upcomingEvents.map((event) => (
                <div key={event.id} className={styles.eventItem}>
                  <div className={styles.eventDate}>
                    <div className={styles.eventDay}>
                      {new Date(event.date).getDate()}
                    </div>
                    <div className={styles.eventMonth}>
                      {new Date(event.date).toLocaleDateString('ko-KR', {
                        month: 'short',
                      })}
                    </div>
                  </div>
                  <div className={styles.eventDetails}>
                    <div className={styles.eventHeader}>
                      <h4 className={styles.eventTitle}>{event.title}</h4>
                      {getStatusBadge(event.status)}
                    </div>
                    <p className={styles.eventVenue}>{event.venue}</p>
                    <div className={styles.eventMeta}>
                      <span className={styles.eventTime}>{event.time}</span>
                      <span className={styles.eventAttendees}>
                        {event.attendees.toLocaleString()}명
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 빠른 액션 */}
      <div className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>빠른 작업</h2>
        <div className={styles.actionGrid}>
          <Link href='/admin/venues/create' className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <VenueStatsIcon />
            </div>
            <h3 className={styles.actionTitle}>새 콘서트장</h3>
            <p className={styles.actionDescription}>새로운 콘서트장을 등록하세요</p>
          </Link>

          <Link href='/admin/venues' className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <EventStatsIcon />
            </div>
            <h3 className={styles.actionTitle}>콘서트장 관리</h3>
            <p className={styles.actionDescription}>기존 콘서트장을 관리하세요</p>
          </Link>

          <Link href='/admin/editor' className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
              >
                <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
                <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' />
              </svg>
            </div>
            <h3 className={styles.actionTitle}>에디터</h3>
            <p className={styles.actionDescription}>콘서트장 레이아웃을 편집하세요</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
