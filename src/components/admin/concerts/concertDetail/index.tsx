import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { ConcertDetail as ConcertDetailType } from '@/types/concert';
import { mockConcertDetails } from '@/lib/mockData';
import styles from './concertDetail.module.css';

interface ConcertDetailProps {
  concertId: string;
}

export default function ConcertDetail({ concertId }: ConcertDetailProps) {
  const [concert, setConcert] = useState<ConcertDetailType | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [tempZones, setTempZones] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'schedules' | 'analytics' | 'settings'
  >('overview');

  // SVG 확대/축소 상태
  const [svgTransform, setSvgTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const svgContainerRef = useRef<HTMLDivElement>(null);
  const svgWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        // TODO: 나중에 실제 API 호출로 변경
        // const response = await fetch(`/api/venues/${venueId}`);
        // const venueData = await response.json();

        // 목업 데이터에서 해당 ID로 찾기
        const foundConcert =
          mockConcertDetails.find((c) => c.id === parseInt(concertId)) || null;

        setTimeout(() => {
          if (foundConcert) {
            setConcert(foundConcert);
          } else {
            setConcert(null);
          }
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch venue:', error);
        setLoading(false);
      }
    };

    fetchVenue();
  }, [concertId]);

  // SVG 확대/축소 기능
  const handleZoom = (delta: number, centerX?: number, centerY?: number) => {
    setSvgTransform((prev) => {
      const newScale = Math.max(0.1, Math.min(5, prev.scale + delta));

      if (centerX !== undefined && centerY !== undefined) {
        // 마우스 위치를 중심으로 확대/축소
        const scaleRatio = newScale / prev.scale;
        const newX = centerX - (centerX - prev.x) * scaleRatio;
        const newY = centerY - (centerY - prev.y) * scaleRatio;

        return { x: newX, y: newY, scale: newScale };
      }

      return { ...prev, scale: newScale };
    });
  };

  const handleZoomIn = () => handleZoom(0.2);
  const handleZoomOut = () => handleZoom(-0.2);
  const handleZoomReset = () => setSvgTransform({ x: 0, y: 0, scale: 1 });

  // 드래그 기능
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditMode) return; // 편집 모드에서는 드래그 비활성화

    setIsDragging(true);
    setDragStart({
      x: e.clientX - svgTransform.x,
      y: e.clientY - svgTransform.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isEditMode) return;

    setSvgTransform((prev) => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 마우스 휠 확대/축소 (shift 키와 함께)
  const handleWheel = (e: React.WheelEvent) => {
    // shift 키가 눌린 상태에서만 확대/축소
    if (!e.shiftKey) return;

    e.preventDefault();

    const rect = svgWrapperRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = e.clientX - rect.left;
    const centerY = e.clientY - rect.top;
    const delta = e.deltaY > 0 ? -0.1 : 0.1;

    handleZoom(delta, centerX, centerY);
  };

  const handleSVGUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'image/svg+xml') {
      alert('SVG 파일만 업로드 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const svg_content = reader.result as string;
      setConcert((prev) => (prev ? { ...prev, svg_content } : null));
      setIsEditMode(true);
      setTempZones([]);
    };
    reader.readAsText(file);
  };

  // SVG 요소 클릭 시 구역 설정
  const handleSVGElementClick = (e: Event, element: Element) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isEditMode) return;

    const existingId = element.getAttribute('id');
    const existingName = element.getAttribute('data-name');

    const name = prompt(
      existingName ? `구역 이름 수정 (현재: ${existingName})` : '구역 이름을 입력하세요',
      existingName || '',
    );

    if (name) {
      const id =
        existingId || `zone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // SVG 요소 스타일 적용
      element.setAttribute('fill', 'rgba(59, 130, 246, 0.7)');
      element.setAttribute('stroke', 'rgba(59, 130, 246, 1)');
      element.setAttribute('stroke-width', '2');
      element.setAttribute('id', id);
      element.setAttribute('data-name', name);
      element.setAttribute('data-zone-configured', 'true');

      // 임시 구역 목록에 추가/수정
      setTempZones((prev) => {
        const existing = prev.find((z) => z.id === id);
        if (existing) {
          return prev.map((z) => (z.id === id ? { ...z, name, svgElementId: id } : z));
        } else {
          return [
            ...prev,
            {
              id,
              name,
              svgElementId: id,
              seatCount: 0, // 기본값
              priceRange: { min: 50000, max: 100000 }, // 기본값
            },
          ];
        }
      });
    }
  };

  // 구역 설정 저장
  const handleSaveZones = async () => {
    if (!concert) return;

    try {
      // TODO: API 호출로 구역 정보 저장
      const updatedConcert = {
        ...concert,
        zones: tempZones,
        lastModified: new Date().toISOString().split('T')[0],
      };

      setConcert(updatedConcert);
      setIsEditMode(false);
      setTempZones([]);

      alert('구역 설정이 저장되었습니다.');
    } catch (error) {
      console.error('Failed to save zones:', error);
      alert('구역 저장에 실패했습니다.');
    }
  };

  // 구역 설정 취소
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setTempZones([]);
    setSelectedZone(null);
    // SVG 다시 렌더링하여 기존 구역 복원
    if (concert?.svg_content && svgContainerRef.current) {
      // 모든 data-zone-configured 속성 제거
      const svgEl = svgContainerRef.current.querySelector('svg');
      if (svgEl) {
        svgEl.querySelectorAll('[data-zone-configured]').forEach((element) => {
          element.removeAttribute('data-zone-configured');
          element.removeAttribute('data-name');
          // 원래 스타일로 복원
          element.setAttribute('fill', 'rgba(107, 114, 128, 0.3)');
          element.setAttribute('stroke', 'rgba(0, 0, 0, 0.3)');
          element.setAttribute('stroke-width', '1');
        });
      }
      renderSVG();
    }
  };

  // SVG 렌더링 및 이벤트 설정
  const renderSVG = () => {
    if (!concert?.svg_content || !svgContainerRef.current) return;

    svgContainerRef.current.innerHTML = concert.svg_content;
    const svgEl = svgContainerRef.current.querySelector('svg');

    if (svgEl) {
      // 기존 이벤트 리스너 제거를 위해 클론 생성
      const newSvgEl = svgEl.cloneNode(true) as SVGElement;
      svgEl.parentNode?.replaceChild(newSvgEl, svgEl);

      // 편집 모드일 때
      if (isEditMode) {
        // 모든 SVG 요소에 클릭 이벤트 추가 (text 요소 제외)
        newSvgEl
          .querySelectorAll('polygon, rect, path, circle, ellipse, g')
          .forEach((element) => {
            // text 요소나 text를 포함한 요소는 제외
            if (
              element.tagName.toLowerCase() === 'text' ||
              element.querySelector('text') ||
              element.closest('text')
            ) {
              return;
            }

            // 이미 설정된 구역인지 확인
            const isAlreadyConfigured =
              element.getAttribute('data-zone-configured') === 'true';

            const clickHandler = (e: Event) => {
              handleSVGElementClick(e, element);
            };

            element.addEventListener('click', clickHandler, { once: false });

            // 호버 효과
            element.addEventListener('mouseenter', () => {
              if (!isAlreadyConfigured) {
                element.setAttribute('opacity', '0.8');
                (element as HTMLElement).style.cursor = 'pointer';
              }
            });

            element.addEventListener('mouseleave', () => {
              if (!isAlreadyConfigured) {
                element.setAttribute('opacity', '1');
              }
            });

            // 기본 스타일 설정
            if (!isAlreadyConfigured) {
              element.setAttribute(
                'fill',
                element.getAttribute('fill') || 'rgba(107, 114, 128, 0.3)',
              );
              element.setAttribute(
                'stroke',
                element.getAttribute('stroke') || 'rgba(0, 0, 0, 0.3)',
              );
              element.setAttribute(
                'stroke-width',
                element.getAttribute('stroke-width') || '1',
              );
            }
          });
      } else {
        // 일반 모드일 때 - 기존 구역들만 클릭 가능
        concert.zones?.forEach((zone) => {
          const element = newSvgEl.querySelector(`#${zone.svgElementId}`);
          if (element) {
            const clickHandler = () => {
              setSelectedZone(zone.id);
            };

            element.addEventListener('click', clickHandler);

            element.addEventListener('mouseenter', () => {
              element.setAttribute('fill', 'rgba(59, 130, 246, 0.7)');
              (element as HTMLElement).style.cursor = 'pointer';
            });

            element.addEventListener('mouseleave', () => {
              if (selectedZone !== zone.id) {
                element.setAttribute('fill', 'rgba(107, 114, 128, 0.5)');
              }
            });

            // 초기 스타일 설정
            element.setAttribute(
              'fill',
              selectedZone === zone.id
                ? 'rgba(59, 130, 246, 0.7)'
                : 'rgba(107, 114, 128, 0.5)',
            );
            element.setAttribute('stroke', 'rgba(0, 0, 0, 0.3)');
            element.setAttribute('stroke-width', '1');
          }
        });
      }
    }
  };

  useEffect(() => {
    renderSVG();
  }, [concert, selectedZone, isEditMode]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>공연장 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!concert) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>공연장을 찾을 수 없습니다.</p>
          <Link href='/admin/concerts' className={styles.backButton}>
            콘서트 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const selectedZoneData = concert.zones?.find((zone) => zone.id === selectedZone);
  const displayZones = isEditMode ? tempZones : concert.zones || [];

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href='/admin/concerts' className={styles.backButton}>
            ← 목록으로
          </Link>
          <div>
            <h1 className={styles.title}>{concert.title}</h1>
            <p className={styles.subtitle}>{concert.location}</p>
            {concert.description && (
              <p className={styles.description}>{concert.description}</p>
            )}
          </div>
        </div>
        <div className={styles.headerRight}>
          <Link
            href={`/admin/concerts/${concertId}/preview`}
            className={styles.previewButton}
          >
            전체 미리보기
          </Link>
          <Link
            href={`/admin/concerts/${concertId}/zones`}
            className={styles.manageButton}
          >
            구역 관리
          </Link>
        </div>
      </div>

      <div className={styles.content}>
        {/* SVG 뷰어 */}
        <div className={styles.svgSection}>
          <div className={styles.svgHeader}>
            <div className={styles.svgHeaderLeft}>
              <h2>공연장 레이아웃</h2>
              {isEditMode ? (
                <p>SVG 도형 요소를 클릭하여 구역을 설정하세요 (텍스트 제외)</p>
              ) : concert.svg_content ? (
                <p>Shift + 마우스휠로 확대/축소, 드래그로 이동 가능합니다</p>
              ) : (
                <p>SVG 파일을 업로드하여 공연장 레이아웃을 설정하세요</p>
              )}
            </div>

            <div className={styles.svgActions}>
              {!concert.svg_content ? (
                // SVG 업로드
                <label className={styles.uploadButton}>
                  📁 SVG 업로드
                  <input
                    type='file'
                    accept='.svg'
                    onChange={handleSVGUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              ) : isEditMode ? (
                // 편집 모드 버튼들
                <div className={styles.editActions}>
                  <button onClick={handleCancelEdit} className={styles.cancelButton}>
                    취소
                  </button>
                  <button onClick={handleSaveZones} className={styles.saveButton}>
                    저장
                  </button>
                </div>
              ) : (
                // 일반 모드 버튼들
                <div className={styles.normalActions}>
                  <div className={styles.zoomControls}>
                    <button
                      onClick={handleZoomOut}
                      className={styles.zoomButton}
                      title='축소'
                    >
                      ➖
                    </button>
                    <button
                      onClick={handleZoomIn}
                      className={styles.zoomButton}
                      title='확대'
                    >
                      ➕
                    </button>
                    <button
                      onClick={handleZoomReset}
                      className={styles.zoomButton}
                      title='원본 크기'
                    >
                      🔄
                    </button>
                  </div>
                  <label className={styles.reuploadButton}>
                    🔄 다시 업로드
                    <input
                      type='file'
                      accept='.svg'
                      onChange={handleSVGUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <button
                    onClick={() => setIsEditMode(true)}
                    className={styles.editButton}
                  >
                    ✏️ 구역 편집
                  </button>
                </div>
              )}
            </div>
          </div>

          {concert.svg_content ? (
            <div className={styles.svgWrapper}>
              <div
                ref={svgWrapperRef}
                className={styles.svgViewport}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                  cursor: isDragging ? 'grabbing' : isEditMode ? 'default' : 'grab',
                  overflow: 'hidden',
                  position: 'relative',
                  height: '600px',
                  border: '1px solid var(--border-secondary)',
                }}
              >
                <div
                  ref={svgContainerRef}
                  className={styles.svgContainer}
                  style={{
                    transform: `translate(${svgTransform.x}px, ${svgTransform.y}px) scale(${svgTransform.scale})`,
                    transformOrigin: '0 0',
                    transition: isDragging ? 'none' : 'transform 0.2s ease',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                />
              </div>

              {isEditMode && (
                <div className={styles.editHint}>
                  💡 SVG의 도형 요소들을 클릭하여 구역으로 설정할 수 있습니다 (텍스트는
                  제외됩니다)
                </div>
              )}

              {!isEditMode && concert.svg_content && (
                <div className={styles.controlHints}>
                  <div className={styles.zoomInfo}>
                    확대/축소: {Math.round(svgTransform.scale * 100)}%
                  </div>
                  <div className={styles.controlHint}>
                    💡 Shift + 휠: 확대/축소 | 드래그: 이동
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.noSvg}>
              <div className={styles.noSvgIcon}>🏗️</div>
              <h3>SVG 레이아웃이 없습니다</h3>
              <p>공연장 도면 SVG 파일을 업로드하여 레이아웃을 설정하세요</p>
            </div>
          )}
        </div>

        {/* 구역 정보 패널 */}
        <div className={styles.infoPanel}>
          <h2>구역 정보</h2>

          {selectedZoneData && !isEditMode ? (
            <div className={styles.zoneDetail}>
              <div className={styles.zoneHeader}>
                <h3>{selectedZoneData.name}</h3>
                <div className={styles.zoneActions}>
                  <Link
                    href={`/admin/concerts/${concertId}/zones/${selectedZoneData.id}`}
                    className={styles.detailButton}
                  >
                    상세보기
                  </Link>
                  <Link
                    href={`/admin/concerts/${concertId}/zones/${selectedZoneData.id}/editor`}
                    className={styles.editButton}
                  >
                    좌석 편집
                  </Link>
                </div>
              </div>

              <div className={styles.zoneStats}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>좌석 수</span>
                  <span className={styles.statValue}>{selectedZoneData.seatCount}석</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>가격 범위</span>
                  <span className={styles.statValue}>
                    {selectedZoneData.priceRange.min.toLocaleString()}원 ~{' '}
                    {selectedZoneData.priceRange.max.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          ) : isEditMode ? (
            <div className={styles.editModeInfo}>
              <h3>🔧 구역 편집 모드</h3>
              <p>SVG 요소를 클릭하여 구역으로 설정하세요</p>
              <div className={styles.tempZoneCount}>
                설정된 구역: {tempZones.length}개
              </div>
            </div>
          ) : (
            <div className={styles.noSelection}>
              <p>구역을 선택해주세요</p>
            </div>
          )}

          {/* 구역 목록 */}
          {displayZones.length > 0 && (
            <div className={styles.zoneList}>
              <h3>{isEditMode ? '설정 중인 구역' : '전체 구역'}</h3>
              <div className={styles.zones}>
                {displayZones.map((zone) => (
                  <div
                    key={zone.id}
                    className={`${styles.zoneCard} ${
                      selectedZone === zone.id ? styles.selected : ''
                    } ${isEditMode ? styles.editMode : ''}`}
                    onClick={() => !isEditMode && setSelectedZone(zone.id)}
                  >
                    <div className={styles.zoneCardHeader}>
                      <h4>{zone.name}</h4>
                      {!isEditMode && (
                        <span className={styles.seatCount}>{zone.seatCount}석</span>
                      )}
                    </div>
                    {!isEditMode && (
                      <p className={styles.priceRange}>
                        {zone.priceRange.min.toLocaleString()}원 ~{' '}
                        {zone.priceRange.max.toLocaleString()}원
                      </p>
                    )}
                    {isEditMode && (
                      <p className={styles.zoneId}>ID: {zone.svgElementId}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 정보 섹션 */}
      {!isEditMode && (
        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>공연장 정보</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>생성일</span>
                <span className={styles.infoValue}>{concert.created_at}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>수정일</span>
                <span className={styles.infoValue}>{concert.updated_at}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>총 좌석 수</span>
                <span className={styles.infoValue}>{concert.total_seats}석</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>총 구역 수</span>
                <span className={styles.infoValue}>{concert.zones?.length || 0}개</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>평점</span>
                <span className={styles.infoValue}>{concert.rating}/5</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>리뷰 수</span>
                <span className={styles.infoValue}>{concert.review_count}개</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
