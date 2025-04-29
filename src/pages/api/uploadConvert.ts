/* eslint-disable @typescript-eslint/no-require-imports */
import { NextApiRequest, NextApiResponse } from "next";
import * as potrace from "potrace";
import fs from "fs";

const formidable = require("formidable");

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "메소드 에러, POST 요청 필요" });
  }

  try {
    const form = new formidable.IncomingForm();
    const files = await new Promise<formidable.Files>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        console.log(fields);
        console.log(files);
        resolve(files);
      });
    });

    const file = files.file as formidable.File | formidable.File[];
    if (!file || Array.isArray(file)) {
      return res.status(400).json({ error: "파일 업로드 에러" });
    }

    const buffer = fs.readFileSync(file.filepath);

    const svg = await new Promise<string>((resolve, reject) => {
      potrace.trace(buffer, (err, svg) => {
        if (err) reject(err);
        resolve(svg);
      });
    });

    fs.unlinkSync(file.filepath);

    res.status(200).json({ svg });
  } catch (error) {
    console.error("이미지 서버 에러:", error);
    res.status(500).json({ error: "서버 문제로 인한 이미지 불러오기 실패" });
  }
}
