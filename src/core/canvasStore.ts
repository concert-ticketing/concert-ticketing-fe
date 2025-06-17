import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as fabric from 'fabric';

interface CanvasState {
  // Canvas 관련 상태
  canvas: fabric.Canvas | null;
  canvasRef: HTMLCanvasElement | null;

  // 변경사항 추적
  hasUnsavedChanges: boolean;

  // Actions
  setCanvas: (canvas: fabric.Canvas | null) => void;
  setCanvasRef: (ref: HTMLCanvasElement | null) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;

  // Canvas 초기화
  initializeCanvas: (canvasElement: HTMLCanvasElement, initialData?: string) => void;

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
      hasUnsavedChanges: false,

      // Setters
      setCanvas: (canvas) => set({ canvas }),
      setCanvasRef: (ref) => set({ canvasRef: ref }),
      setHasUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),

      // Canvas 초기화
      initializeCanvas: (canvasElement, initialData) => {
        const fabricCanvas = new fabric.Canvas(canvasElement, {
          width: canvasElement.parentElement?.clientWidth || 800,
          height: canvasElement.parentElement?.clientHeight || 600,
          backgroundColor: '#ffffff',
          selection: true,
          backgroundColor,
        });

        set({ canvas: fabricCanvas, canvasRef: canvasElement });

        // 초기 데이터가 있으면 로드
        if (initialData) {
          get().loadCanvasData(initialData);
        }
      },

      // Canvas 정리
      disposeCanvas: () => {
        const { canvas } = get();
        if (canvas) {
          console.log('Disposing canvas'); // 디버그용
          canvas.dispose();
          set({ canvas: null, canvasRef: null });
        }
      },

      // Canvas 데이터 저장
      saveCanvasData: () => {
        const { canvas } = get();
        if (!canvas) return '';

        try {
          const canvasData = JSON.stringify(canvas.toJSON());
          return canvasData;
        } catch (error) {
          console.error('Canvas 저장 중 오류:', error);
          return '';
        }
      },

      // Canvas 데이터 로드
      loadCanvasData: async (data) => {
        const { canvas } = get();
        if (!canvas || !data) return;

        try {
          const parsedData = JSON.parse(data);
          await canvas.loadFromJSON(parsedData);
          canvas.renderAll();
          set({ hasUnsavedChanges: false });
        } catch (error) {
          console.error('Canvas 로드 중 오류:', error);
        }
      },

      // 선택된 객체들 삭제
      deleteSelectedObjects: () => {
        const { canvas } = get();
        if (!canvas) return;

        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length === 0) return;

        activeObjects.forEach((obj) => {
          canvas.remove(obj);
        });

        canvas.discardActiveObject();
        canvas.renderAll();
        set({ hasUnsavedChanges: true });
      },

      // 리사이즈 핸들러
      handleResize: () => {
        const { canvas, canvasRef } = get();
        if (!canvas || !canvasRef) return;

        const container = canvasRef.parentElement;
        if (!container) return;

        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;

        canvas.setDimensions({
          width: newWidth,
          height: newHeight,
        });

        canvas.renderAll();
      },
    }),
    {
      name: 'canvas-store',
    },
  ),
);
