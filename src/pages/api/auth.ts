// pages/api/auth/social.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, state } = req.body;

  try {
    // === 카카오 로그인 예시 ===
    const tokenRes = await fetch('https://nid.naver.com/oauth2.0/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: '카카오 REST API 키',
        redirect_uri: 'http://localhost:3000/api/callback',
        code,
      }).toString(),
    });

    const tokenData = await tokenRes.json();

    const userRes = await fetch('https://openapi.naver.com/v1/nid/me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userInfo = await userRes.json();

    // TODO: 사용자 정보 저장 및 로그인 처리
    console.log('카카오 사용자 정보:', userInfo);

    return res.status(200).json({ user: userInfo });
  } catch (error) {
    console.error('OAuth 에러:', error);
    return res.status(500).json({ error: 'OAuth 처리 중 오류 발생' });
  }
}
