import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function OAuthSuccess() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const code = router.query.code as string;
    const state = router.query.state as string;

    if (code && state) {
      fetch('http://localhost:8080/oauth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, state }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('✅ 파싱된 JSON:', data);

          if (data.token) {
            localStorage.setItem('accessToken', data.token);

            // 🔍 최초 로그인 여부 출력
            console.log('✅ 최초 로그인 여부 (data.first):', data.first);

            if (data.first === true) {
              router.push('/signup?first=true'); // 최초 회원
            } else {
              router.push('/'); // 기존 회원
            }
          } else {
            alert('로그인 실패: 토큰 없음');
          }
        })
        .catch((err) => {
          console.error('API 호출 실패:', err);
          alert('로그인 중 오류 발생');
        });
    }
  }, [router.isReady, router.query]);

  return <p>로그인 처리 중입니다…</p>;
}
