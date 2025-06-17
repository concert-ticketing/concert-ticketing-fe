import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as fabric from 'fabric';

export type ToolType = 'rect' | 'circle' | 'text' | 'group' | 'polygon' | null;

interface CanvasState {
  // Canvas 관련 상태
  canvas: fabric.Canvas | null;
  canvasRef: HTMLCanvasElement | null;

  // Tool 관련 상태
  selectedTool: ToolType;

  // 변경사항 추적
  hasUnsavedChanges: boolean;

  // Canvas 설정
  canvasWidth: number;
  canvasHeight: number;
  backgroundColor: string;

  // Actions
  setCanvas: (canvas: fabric.Canvas | null) => void;
  setCanvasRef: (ref: HTMLCanvasElement | null) => void;
  setSelectedTool: (tool: ToolType) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  setCanvasDimensions: (width: number, height: number) => void;
  setBackgroundColor: (color: string) => void;

  // Canvas 초기화
  initializeCanvas: (
    canvasElement: HTMLCanvasElement,
    initialData?: string,
  ) => Promise<void>;

  // Canvas 이벤트 핸들러 등록
  setupCanvasEvents: () => void;

  // Canvas 정리
  disposeCanvas: () => void;

  // Canvas 데이터 관리
  saveCanvasData: () => string;
  loadCanvasData: (data: string) => Promise<void>;

  // 객체 삭제
  deleteSelectedObjects: () => void;

  // 리사이즈 핸들러
  handleResize: () => void;
}

export const useCanvasStore = create<CanvasState>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      canvas: null,
      canvasRef: null,
      selectedTool: null,
      hasUnsavedChanges: false,
      canvasWidth: typeof window !== 'undefined' ? window.innerWidth - 300 : 900,
      canvasHeight: typeof window !== 'undefined' ? window.innerHeight - 120 : 680,
      backgroundColor: '#f8f9fa',

      // Basic setters
      setCanvas: (canvas) => set({ canvas }),
      setCanvasRef: (canvasRef) => set({ canvasRef }),
      setSelectedTool: (selectedTool) => set({ selectedTool }),
      setHasUnsavedChanges: (hasUnsavedChanges) => set({ hasUnsavedChanges }),
      setCanvasDimensions: (canvasWidth, canvasHeight) =>
        set({ canvasWidth, canvasHeight }),
      setBackgroundColor: (backgroundColor) => {
        const { canvas } = get();
        if (canvas) {
          canvas.backgroundColor = backgroundColor;
          canvas.renderAll();
        }
        set({ backgroundColor });
      },

      // Canvas 초기화
      initializeCanvas: async (canvasElement, initialData) => {
        console.log('Initializing canvas...'); // 디버그용

        // 기존 캔버스가 있다면 정리
        const { canvas: existingCanvas } = get();
        if (existingCanvas) {
          existingCanvas.dispose();
        }

        const { canvasWidth, canvasHeight, backgroundColor } = get();

        // 새 캔버스 생성
        const initCanvas = new fabric.Canvas(canvasElement, {
          width: canvasWidth,
          height: canvasHeight,
          selection: true,
          backgroundColor,
        });

        console.log('Canvas created with dimensions:', canvasWidth, 'x', canvasHeight); // 디버그용

        // 테스트용 객체 추가 (디버그용)
        const testRect = new fabric.Rect({
          left: 100,
          top: 100,
          width: 50,
          height: 50,
          fill: '#dddddd',
          stroke: '#000000',
          strokeWidth: 1,
        });
        initCanvas.add(testRect);

        // 초기 데이터 로드
        if (initialData) {
          try {
            await new Promise<void>((resolve, reject) => {
              initCanvas.loadFromJSON(initialData, (data, error) => {
                if (error) {
                  reject(error);
                } else {
                  initCanvas.renderAll();
                  resolve();
                }
              });
            });
          } catch (error) {
            console.error('Failed to load initial data:', error);
            initCanvas.renderAll();
          }
        } else {
          initCanvas.renderAll();
        }

        // 상태 업데이트
        set({ canvas: initCanvas, canvasRef: canvasElement });

        // 이벤트 설정
        get().setupCanvasEvents();

        console.log('Canvas initialization complete'); // 디버그용
      },

      // Canvas 이벤트 설정
      setupCanvasEvents: () => {
        const { canvas } = get();
        if (!canvas) return;

        console.log('Setting up canvas events'); // 디버그용

        const handleCanvasChange = () => {
          set({ hasUnsavedChanges: true });
        };

        canvas.on('object:added', handleCanvasChange);
        canvas.on('object:removed', handleCanvasChange);
        canvas.on('object:modified', handleCanvasChange);
      },

      // Canvas 정리
      disposeCanvas: () => {
        const { canvas } = get();
        if (canvas) {
          console.log('Disposing canvas'); // 디버그용
          canvas.dispose();
        }
        set({ canvas: null, canvasRef: null });
      },

      // Canvas 데이터 저장
      saveCanvasData: () => {
        const { canvas } = get();
        if (!canvas) return '';
        return JSON.stringify(canvas.toJSON());
      },

      // Canvas 데이터 로드
      loadCanvasData: async (data) => {
        const { canvas } = get();
        if (!canvas) return;

        await new Promise<void>((resolve) => {
          canvas.loadFromJSON(data, () => {
            canvas.renderAll();
            resolve();
          });
        });
      },

      // 선택된 객체 삭제
      deleteSelectedObjects: () => {
        const { canvas } = get();
        if (!canvas) return;

        const activeObject = canvas.getActiveObject();
        if (!activeObject) return;

        if (activeObject.type === 'activeSelection') {
          // 다중 선택된 객체들 삭제
          const activeSelection = activeObject as fabric.ActiveSelection;
          const objects = activeSelection.getObjects();

          // 각 객체를 개별적으로 제거
          objects.forEach((obj) => {
            canvas.remove(obj);
          });

          // ActiveSelection 해제
          canvas.discardActiveObject();
        } else {
          // 단일 객체 삭제
          canvas.remove(activeObject);
          canvas.discardActiveObject();
        }

        canvas.renderAll();
        set({ hasUnsavedChanges: true });
      },

      // 리사이즈 핸들러
      handleResize: () => {
        const { canvas } = get();
        if (!canvas) return;

        const newWidth = window.innerWidth - 300; // 좌측 패널 너비 제외
        const newHeight = window.innerHeight - 120; // 헤더/푸터 높이 제외

        canvas.setDimensions({
          width: newWidth,
          height: newHeight,
        });

        set({ canvasWidth: newWidth, canvasHeight: newHeight });
        console.log('Canvas resized to:', newWidth, 'x', newHeight); // 디버그용
      },
    }),
    {
      name: 'canvas-store',
    },
  ),
);
