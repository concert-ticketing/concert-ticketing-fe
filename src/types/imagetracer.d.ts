/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ImageTracerType {
  getImgdata: (canvas: HTMLCanvasElement) => any;
  imagedataToSVG: (imgData: any, options?: Record<string, any>) => string;
}
