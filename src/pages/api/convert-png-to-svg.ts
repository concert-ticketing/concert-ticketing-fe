import { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";
import cv from "opencv.js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: "Image data is required" });
    }

    // Base64 이미지 데이터를 Buffer로 변환
    const buffer = Buffer.from(image, "base64");

    // 이미지를 흑백으로 변환
    const grayscale = await sharp(buffer).grayscale().toBuffer();

    // OpenCV로 이미지 로드
    const img = cv.matFromArray(grayscale.length, 1, cv.CV_8UC1, grayscale);
    const mat = cv.imdecode(img, cv.IMREAD_GRAYSCALE);

    // 이미지 이진화
    const binary = new cv.Mat();
    cv.threshold(mat, binary, 128, 255, cv.THRESH_BINARY);

    // 윤곽선(contour) 찾기
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(
      binary,
      contours,
      hierarchy,
      cv.RETR_EXTERNAL,
      cv.CHAIN_APPROX_SIMPLE
    );

    // SVG 경로 생성
    let svgPaths = "";
    for (let i = 0; i < contours.size(); i++) {
      const contour = contours.get(i);
      svgPaths += "M";
      for (let j = 0; j < contour.rows; j++) {
        const point = contour.data32S.subarray(j * 2, j * 2 + 2);
        svgPaths += `${point[0]},${point[1]} `;
      }
      svgPaths += "Z ";
    }

    // SVG 응답
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${mat.cols} ${mat.rows}">${svgPaths}</svg>`;
    res.setHeader("Content-Type", "image/svg+xml");
    res.status(200).send(svg);

    // 메모리 해제
    mat.delete();
    binary.delete();
    contours.delete();
    hierarchy.delete();
  } catch (error) {
    console.error("Error detecting seats:", error);
    res.status(500).json({ message: "Failed to process image" });
  }
}
