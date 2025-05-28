import * as fabric from "fabric";

export function getColorString(
  fill: string | fabric.TFiller | null | undefined
): string {
  // fill 값이 이미 문자열(색상 코드)인 경우
  if (typeof fill === "string") {
    // RGB 또는 RGBA 문자열을 16진수 문자열로 변환합니다.
    const rgbMatch = fill.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    const rgbaMatch = fill.match(
      /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/
    );

    if (rgbMatch) {
      const r = parseInt(rgbMatch[1], 10);
      const g = parseInt(rgbMatch[2], 10);
      const b = parseInt(rgbMatch[3], 10);
      // 16진수 형식으로 변환하여 반환합니다.
      return (
        "#" +
        ((1 << 24) + (r << 16) + (g << 8) + b)
          .toString(16)
          .slice(1)
          .toUpperCase()
      );
    } else if (rgbaMatch) {
      const r = parseInt(rgbaMatch[1], 10);
      const g = parseInt(rgbaMatch[2], 10);
      const b = parseInt(rgbaMatch[3], 10);
      // RGBA는 알파 채널을 가지고 있으나, input type="color"는 알파 채널을 지원하지 않으므로 RGB만 변환합니다.
      return (
        "#" +
        ((1 << 24) + (r << 16) + (g << 8) + b)
          .toString(16)
          .slice(1)
          .toUpperCase()
      );
    }
    // 이미 16진수 형식이거나 다른 유효한 문자열 색상인 경우 그대로 반환합니다.
    return fill;
  }
  // fill 값이 fabric.Gradient 객체인 경우
  else if (fill instanceof fabric.Gradient) {
    if (fill.colorStops && fill.colorStops.length > 0) {
      // 그라디언트의 첫 번째 색상 스톱의 색상을 반환합니다.
      // 이 색상도 문자열일 수 있으므로 재귀적으로 getColorString을 호출하여 변환을 시도합니다.
      return getColorString(fill.colorStops[0].color);
    }
    return "#FFFFFF";
  }
  // fill 값이 fabric.Pattern 객체인 경우
  else if (fill instanceof fabric.Pattern) {
    return "#FFFFFF";
  }
  // fill 값이 null 또는 undefined인 경우
  else if (fill === null || fill === undefined) {
    return "#FFFFFF";
  }
  // 그 외 예상치 못한 타입의 경우에도 기본값(흰색)을 반환합니다.
  return "#FFFFFF";
}
