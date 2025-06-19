import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';

export default function TestCanvasPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [objectCount, setObjectCount] = useState(0);

  // Canvas 초기화
  useEffect(() => {
    if (!canvasRef.current) return;

    console.log('Canvas 초기화 시작');

    // 약간의 지연을 두고 Canvas 생성
    setTimeout(() => {
      const canvasElement = canvasRef.current;
      if (!canvasElement) return;

      const container = canvasElement.parentElement;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const width = rect.width || 800;
      const height = rect.height || 600;

      console.log('컨테이너 크기:', { width, height });

      const fabricCanvas = new fabric.Canvas(canvasElement, {
        width,
        height,
        backgroundColor: '#f0f0f0',
        selection: true,
      });

      console.log('Fabric Canvas 생성됨:', {
        width: fabricCanvas.width,
        height: fabricCanvas.height,
      });

      // 이벤트 리스너
      fabricCanvas.on('object:added', () => {
        setObjectCount(fabricCanvas.getObjects().length);
      });

      fabricCanvas.on('object:removed', () => {
        setObjectCount(fabricCanvas.getObjects().length);
      });

      setCanvas(fabricCanvas);

      // 테스트용 빨간 사각형 추가
      const testRect = new fabric.Rect({
        left: 100,
        top: 100,
        width: 100,
        height: 100,
        fill: 'red',
        stroke: 'blue',
        strokeWidth: 3,
      });

      fabricCanvas.add(testRect);
      fabricCanvas.renderAll();

      console.log('테스트 사각형 추가 완료');
    }, 100);

    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, []);

  // 사각형 생성 함수
  const createRect = () => {
    if (!canvas) {
      console.error('Canvas가 없습니다');
      return;
    }

    console.log('사각형 생성 시작');

    const center = canvas.getCenter();
    console.log('Canvas 중앙:', center);

    const rect = new fabric.Rect({
      left: center.left + (Math.random() - 0.5) * 200,
      top: center.top + (Math.random() - 0.5) * 200,
      width: 50,
      height: 50,
      fill: '#dddddd',
      stroke: '#000000',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
    });

    console.log('생성된 사각형:', {
      left: rect.left,
      top: rect.top,
      fill: rect.fill,
      visible: rect.visible,
    });

    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();

    console.log('Canvas에 추가 완료, 총 객체 수:', canvas.getObjects().length);
  };

  // 모든 객체 삭제
  const clearCanvas = () => {
    if (!canvas) return;

    canvas.clear();
    canvas.backgroundColor = '#f0f0f0';
    canvas.renderAll();
  };

  // 선택된 객체 삭제
  const deleteSelected = () => {
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length === 0) {
      alert('삭제할 객체를 선택해주세요');
      return;
    }

    activeObjects.forEach((obj) => {
      canvas.remove(obj);
    });

    canvas.discardActiveObject();
    canvas.renderAll();
  };

  // Canvas 정보 출력
  const logCanvasInfo = () => {
    if (!canvas) return;

    console.log('=== Canvas 정보 ===');
    console.log('크기:', canvas.width, 'x', canvas.height);
    console.log('객체 수:', canvas.getObjects().length);
    console.log('선택된 객체:', canvas.getActiveObject());
    console.log('Zoom:', canvas.getZoom());
    console.log('ViewportTransform:', canvas.viewportTransform);
    console.log(
      '객체 목록:',
      canvas.getObjects().map((obj) => ({
        type: obj.type,
        left: obj.left,
        top: obj.top,
        visible: obj.visible,
      })),
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          padding: '20px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #ddd',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '24px' }}>Canvas 테스트 페이지</h1>
        <p style={{ margin: '10px 0 0 0', color: '#666' }}>
          Fabric.js Canvas 동작 테스트 - 객체 수: {objectCount}
        </p>
      </div>

      {/* 컨트롤 버튼들 */}
      <div
        style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #ddd',
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={createRect}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          사각형 생성
        </button>

        <button
          onClick={deleteSelected}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          선택 삭제
        </button>

        <button
          onClick={clearCanvas}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          전체 삭제
        </button>

        <button
          onClick={logCanvasInfo}
          style={{
            padding: '10px 20px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Canvas 정보 출력
        </button>
      </div>

      {/* Canvas 컨테이너 */}
      <div
        style={{
          flex: 1,
          padding: '20px',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            border: '2px solid #007bff',
            borderRadius: '8px',
            backgroundColor: '#f8f9fa',
            position: 'relative',
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              display: 'block',
              border: 'none',
            }}
          />
        </div>
      </div>

      {/* 사용법 안내 */}
      <div
        style={{
          padding: '15px 20px',
          backgroundColor: '#e9ecef',
          borderTop: '1px solid #ddd',
          fontSize: '14px',
          color: '#495057',
        }}
      >
        <strong>사용법:</strong>
        버튼을 클릭해서 객체를 생성하고, 객체를 클릭/드래그해서 선택/이동할 수 있습니다.
        브라우저 개발자 도구 콘솔에서 상세 로그를 확인하세요.
      </div>
    </div>
  );
}
