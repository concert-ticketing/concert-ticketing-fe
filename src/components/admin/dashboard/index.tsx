import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

import { Icons } from '@/components/admin/common/ui/icons';
import styles from './dashboard.module.css';

interface DashboardStats {
  totalVenues: number;
  totalConcerts: number;
  totalPerformers: number;
  totalTicketsSold: number;
  totalRevenue: number;
  activeEvents: number;
}

interface RecentActivity {
  id: string;
  type: 'venue' | 'concert' | 'performer' | 'ticket';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'info';
}

interface TopVenue {
  id: string;
  name: string;
  totalEvents: number;
  totalTickets: number;
  revenue: number;
  occupancyRate: number;
}

interface UpcomingEvent {
  id: string;
  title: string;
  venue: string;
  date: string;
  time: string;
  ticketsSold: number;
  totalTickets: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [topVenues, setTopVenues] = useState<TopVenue[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 실제 구현시에는 API 호출
      // const [statsData, activitiesData, venuesData, eventsData] = await Promise.all([
      //   fetch('/api/admin/dashboard/stats').then(res => res.json()),
      //   fetch('/api/admin/dashboard/activities').then(res => res.json()),
      //   fetch('/api/admin/dashboard/top-venues').then(res => res.json()),
      //   fetch('/api/admin/dashboard/upcoming-events').then(res => res.json()),
      // ]);

      // 임시 더미 데이터
      const statsData: DashboardStats = {
        totalVenues: 12,
        totalConcerts: 89,
        totalPerformers: 156,
        totalTicketsSold: 24567,
        totalRevenue: 1234567890,
        activeEvents: 8,
      };

      const activitiesData: RecentActivity[] = [
        {
          id: '1',
          type: 'concert',
          title: '새로운 콘서트 등록',
          description: 'IU 콘서트 - 올림픽공원 체조경기장',
          timestamp: '2025-06-17T10:30:00Z',
          status: 'success',
        },
        {
          id: '2',
          type: 'venue',
          title: '공연장 정보 수정',
          description: '잠실종합운동장 좌석 배치 업데이트',
          timestamp: '2025-06-17T09:15:00Z',
          status: 'info',
        },
        {
          id: '3',
          type: 'ticket',
          title: '티켓 판매 완료',
          description: 'BTS 콘서트 VIP석 매진',
          timestamp: '2025-06-17T08:45:00Z',
          status: 'warning',
        },
        {
          id: '4',
          type: 'performer',
          title: '출연진 정보 등록',
          description: '새로운 아티스트 프로필 추가',
          timestamp: '2025-06-16T16:20:00Z',
          status: 'success',
        },
      ];

      const venuesData: TopVenue[] = [
        {
          id: '1',
          name: '올림픽공원 체조경기장',
          totalEvents: 24,
          totalTickets: 12000,
          revenue: 240000000,
          occupancyRate: 95.5,
        },
        {
          id: '2',
          name: '잠실종합운동장',
          totalEvents: 18,
          totalTickets: 45000,
          revenue: 450000000,
          occupancyRate: 88.2,
        },
        {
          id: '3',
          name: 'KSPO DOME',
          totalEvents: 15,
          totalTickets: 8000,
          revenue: 160000000,
          occupancyRate: 92.8,
        },
      ];

      const eventsData: UpcomingEvent[] = [
        {
          id: '1',
          title: 'IU 콘서트 2025',
          venue: '올림픽공원 체조경기장',
          date: '2025-07-15',
          time: '19:00',
          ticketsSold: 8500,
          totalTickets: 10000,
          status: 'upcoming',
        },
        {
          id: '2',
          title: 'BTS 월드투어',
          venue: '잠실종합운동장',
          date: '2025-08-20',
          time: '18:00',
          ticketsSold: 42000,
          totalTickets: 45000,
          status: 'upcoming',
        },
        {
          id: '3',
          title: '뉴진스 팬미팅',
          venue: 'KSPO DOME',
          date: '2025-06-25',
          time: '20:00',
          ticketsSold: 7800,
          totalTickets: 8000,
          status: 'ongoing',
        },
      ];

      setStats(statsData);
      setRecentActivities(activitiesData);
      setTopVenues(venuesData);
      setUpcomingEvents(eventsData);
    } catch (err) {
      setError('대시보드 데이터를 불러오는 중 오류가 발생했습니다.');
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const formatDate = (dateString: string): string => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'venue':
        return <Icons.MapPin className={styles.activityIcon} />;
      case 'concert':
        return <Icons.Music className={styles.activityIcon} />;
      case 'performer':
        return <Icons.User className={styles.activityIcon} />;
      case 'ticket':
        return <Icons.Seat className={styles.activityIcon} />;
      default:
        return <Icons.CheckCircle className={styles.activityIcon} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return styles.statusSuccess;
      case 'warning':
        return styles.statusWarning;
      case 'info':
        return styles.statusInfo;
      case 'upcoming':
        return styles.statusUpcoming;
      case 'ongoing':
        return styles.statusOngoing;
      case 'completed':
        return styles.statusCompleted;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return styles.statusDefault;
    }
  };

  const getProgressPercentage = (sold: number, total: number): number => {
    return Math.round((sold / total) * 100);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'create-venue':
        router.push('/admin/venues/create');
        break;
      case 'create-concert':
        router.push('/admin/concerts/create');
        break;
      case 'create-performer':
        router.push('/admin/performers/create');
        break;
      case 'view-venues':
        router.push('/admin/venues');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Icons.Loading className={styles.loadingIcon} />
          <span>대시보드를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <Icons.AlertCircle className={styles.errorIcon} />
          <span>{error || '데이터를 불러올 수 없습니다.'}</span>
          <button
            type='button'
            onClick={loadDashboardData}
            className={styles.retryButton}
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>관리자 대시보드</h1>
          <p className={styles.subtitle}>콘서트 관리 시스템 현황</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.timeRangeSelector}>
            <button
              type='button'
              className={`${styles.timeButton} ${timeRange === 'week' ? styles.active : ''}`}
              onClick={() => setTimeRange('week')}
            >
              주간
            </button>
            <button
              type='button'
              className={`${styles.timeButton} ${timeRange === 'month' ? styles.active : ''}`}
              onClick={() => setTimeRange('month')}
            >
              월간
            </button>
            <button
              type='button'
              className={`${styles.timeButton} ${timeRange === 'year' ? styles.active : ''}`}
              onClick={() => setTimeRange('year')}
            >
              연간
            </button>
          </div>
          <button
            type='button'
            onClick={loadDashboardData}
            className={styles.refreshButton}
          >
            <Icons.RefreshCw className={styles.refreshIcon} />
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Icons.MapPin />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{formatNumber(stats.totalVenues)}</span>
            <span className={styles.statLabel}>등록된 공연장</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Icons.Music />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{formatNumber(stats.totalConcerts)}</span>
            <span className={styles.statLabel}>총 콘서트 수</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Icons.Users />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>
              {formatNumber(stats.totalPerformers)}
            </span>
            <span className={styles.statLabel}>등록된 출연진</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Icons.Seat />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>
              {formatNumber(stats.totalTicketsSold)}
            </span>
            <span className={styles.statLabel}>총 판매 티켓</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Icons.BarChart />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{formatCurrency(stats.totalRevenue)}</span>
            <span className={styles.statLabel}>총 매출</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Icons.Calendar />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{formatNumber(stats.activeEvents)}</span>
            <span className={styles.statLabel}>진행 중인 이벤트</span>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className={styles.mainContent}>
        {/* 왼쪽 컬럼 */}
        <div className={styles.leftColumn}>
          {/* 최근 활동 */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>최근 활동</h3>
              <button type='button' className={styles.viewAllButton}>
                <span>전체 보기</span>
                <Icons.ArrowRight size={16} />
              </button>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.activityList}>
                {recentActivities.map((activity) => (
                  <div key={activity.id} className={styles.activityItem}>
                    <div
                      className={`${styles.activityIconWrapper} ${getStatusColor(activity.status)}`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className={styles.activityContent}>
                      <h4 className={styles.activityTitle}>{activity.title}</h4>
                      <p className={styles.activityDescription}>{activity.description}</p>
                      <span className={styles.activityTime}>
                        {formatDate(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 빠른 작업 */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>빠른 작업</h3>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.quickActions}>
                <button
                  type='button'
                  onClick={() => handleQuickAction('create-venue')}
                  className={styles.quickActionButton}
                >
                  <Icons.Plus />
                  <span>새 공연장</span>
                </button>
                <button
                  type='button'
                  onClick={() => handleQuickAction('create-concert')}
                  className={styles.quickActionButton}
                >
                  <Icons.Music />
                  <span>새 콘서트</span>
                </button>
                <button
                  type='button'
                  onClick={() => handleQuickAction('create-performer')}
                  className={styles.quickActionButton}
                >
                  <Icons.User />
                  <span>새 출연진</span>
                </button>
                <button
                  type='button'
                  onClick={() => handleQuickAction('view-venues')}
                  className={styles.quickActionButton}
                >
                  <Icons.Eye />
                  <span>공연장 보기</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 컬럼 */}
        <div className={styles.rightColumn}>
          {/* 인기 공연장 */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>인기 공연장</h3>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.venueList}>
                {topVenues.map((venue, index) => (
                  <div key={venue.id} className={styles.venueItem}>
                    <div className={styles.venueRank}>#{index + 1}</div>
                    <div className={styles.venueInfo}>
                      <h4 className={styles.venueName}>{venue.name}</h4>
                      <div className={styles.venueStats}>
                        <span>{venue.totalEvents}개 이벤트</span>
                        <span>{formatNumber(venue.totalTickets)}석</span>
                        <span>{venue.occupancyRate}% 점유율</span>
                      </div>
                      <div className={styles.venueRevenue}>
                        {formatCurrency(venue.revenue)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 예정된 이벤트 */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>예정된 이벤트</h3>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.eventList}>
                {upcomingEvents.map((event) => (
                  <div key={event.id} className={styles.eventItem}>
                    <div className={styles.eventInfo}>
                      <h4 className={styles.eventTitle}>{event.title}</h4>
                      <p className={styles.eventVenue}>
                        <Icons.MapPin size={14} />
                        {event.venue}
                      </p>
                      <p className={styles.eventDateTime}>
                        <Icons.Calendar size={14} />
                        {event.date} {event.time}
                      </p>
                    </div>
                    <div className={styles.eventProgress}>
                      <div className={styles.eventStatus}>
                        <span
                          className={`${styles.statusBadge} ${getStatusColor(event.status)}`}
                        >
                          {(() => {
                            switch (event.status) {
                              case 'upcoming':
                                return '예정';
                              case 'ongoing':
                                return '진행중';
                              case 'completed':
                                return '완료';
                              case 'cancelled':
                                return '취소';
                              default:
                                return '';
                            }
                          })()}
                        </span>
                      </div>
                      <div className={styles.ticketProgress}>
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progressFill}
                            style={{
                              width: `${getProgressPercentage(event.ticketsSold, event.totalTickets)}%`,
                            }}
                          />
                        </div>
                        <span className={styles.progressText}>
                          {formatNumber(event.ticketsSold)} /{' '}
                          {formatNumber(event.totalTickets)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
