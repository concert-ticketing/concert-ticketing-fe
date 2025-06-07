import React, { useState, useRef, useEffect } from 'react';

/**
 * @param text 툴팁에 표시될 텍스트
 * @param children 툴팁이 감쌀 자식 요소
 * @param delay 툴팁이 나타나기까지의 지연 시간 (ms)
 * @param position 툴팁 위치
 * @param maxWidth 최대 너비
 * @param className 커스텀 스타일
 * @param disabled 비활성화
 */

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  delay?: number;
  position?: 'top' | 'bottom' | 'left' | 'right';
  maxWidth?: number;
  className?: string;
  disabled?: boolean;
}

export default function Tooltip({
  text,
  children,
  delay = 1000,
  position = 'top',
  maxWidth = 200,
  className = '',
  disabled = false,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const calculatePosition = (rect: DOMRect) => {
    const offset = 10; // 요소와 툴팁 사이의 거리

    switch (position) {
      case 'top':
        return {
          x: rect.left + rect.width / 2,
          y: rect.top - offset,
        };
      case 'bottom':
        return {
          x: rect.left + rect.width / 2,
          y: rect.bottom + offset,
        };
      case 'left':
        return {
          x: rect.left - offset,
          y: rect.top + rect.height / 2,
        };
      case 'right':
        return {
          x: rect.right + offset,
          y: rect.top + rect.height / 2,
        };
      default:
        return {
          x: rect.left + rect.width / 2,
          y: rect.top - offset,
        };
    }
  };

  const getTransform = () => {
    switch (position) {
      case 'top':
        return 'translate(-50%, -100%)';
      case 'bottom':
        return 'translate(-50%, 0%)';
      case 'left':
        return 'translate(-100%, -50%)';
      case 'right':
        return 'translate(0%, -50%)';
      default:
        return 'translate(-50%, -100%)';
    }
  };

  const getArrowStyle = () => {
    const arrowSize = 5;
    const baseStyle = {
      position: 'absolute' as const,
      width: 0,
      height: 0,
    };

    switch (position) {
      case 'top':
        return {
          ...baseStyle,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          borderTop: `${arrowSize}px solid #1f2937`,
        };
      case 'bottom':
        return {
          ...baseStyle,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid #1f2937`,
        };
      case 'left':
        return {
          ...baseStyle,
          top: '50%',
          left: '100%',
          transform: 'translateY(-50%)',
          borderTop: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid transparent`,
          borderLeft: `${arrowSize}px solid #1f2937`,
        };
      case 'right':
        return {
          ...baseStyle,
          top: '50%',
          right: '100%',
          transform: 'translateY(-50%)',
          borderTop: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid #1f2937`,
        };
      default:
        return baseStyle;
    }
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (disabled) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const pos = calculatePosition(rect);
    setTooltipPosition(pos);

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  // 컴포넌트 언마운트 시 timeout 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // 애니메이션을 위한 위치별 offset 계산
  const getAnimationOffset = () => {
    let translateY = '0';
    let translateX = '0';

    if (position === 'top') {
      translateY = '5px';
    } else if (position === 'bottom') {
      translateY = '-5px';
    } else if (position === 'left') {
      translateX = '5px';
    } else if (position === 'right') {
      translateX = '-5px';
    }

    return { translateY, translateX };
  };

  return (
    <>
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'relative',
          display: 'inline-block',
          cursor: disabled ? 'default' : 'pointer',
        }}
        className={className}
      >
        {children}
      </div>

      {/* 툴팁 포털 - body에 직접 렌더링 */}
      {isVisible && !disabled && (
        <div
          ref={tooltipRef}
          style={{
            position: 'fixed',
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: getTransform(),
            backgroundColor: '#1f2937',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500',
            zIndex: 9999,
            maxWidth: `${maxWidth}px`,
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            opacity: 0,
            animation: 'tooltipFadeIn 0.2s ease forwards',
            pointerEvents: 'none',
            whiteSpace: 'pre-wrap', // 줄바꿈 지원
          }}
        >
          {text}
          <div style={getArrowStyle()} />
        </div>
      )}

      {/* 글로벌 애니메이션 스타일 */}
      <style jsx global>{`
        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: ${getTransform()} translateY(${getAnimationOffset().translateY})
              translateX(${getAnimationOffset().translateX});
          }
          to {
            opacity: 1;
            transform: ${getTransform()} translateY(0) translateX(0);
          }
        }
      `}</style>
    </>
  );
}
