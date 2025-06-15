import React from 'react';
import Image from 'next/image';

import style from './LoginForm.module.css';

const REDIRECT_URI = 'http://localhost:3000/api/callback';

const CLIENT_IDS = {
  kakao: 'f64869f097fa9ce71f4d1d614b6c896a',
  naver: 'jE6XvGK6FxADoCMEjT0m',
  google: '1033931690858-kk6du920qj7i9i0do2t376196pd5u2os.apps.googleusercontent.com',
};

export default function LoginForm() {
  const handleLogin = (provider: 'kakao' | 'naver' | 'google') => {
    let url = '';

    if (provider === 'kakao') {
      url = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_IDS.kakao}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    } else if (provider === 'naver') {
      const state = crypto.randomUUID();
      url = `https://nid.naver.com/oauth2.0/authorize?client_id=${CLIENT_IDS.naver}&redirect_uri=${REDIRECT_URI}&state=${state}&response_type=code`;
    } else if (provider === 'google') {
      url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_IDS.google}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
    }

    window.location.href = url;
  };

  return (
    <div className={style.all}>
      <div className={style.center}>
         <h1>소셜 로그인</h1>
      <div className={style.socialButtons}>
        <button onClick={() => handleLogin('kakao')} aria-label="카카오 로그인">
        <Image
          src="/login/kakao_login_large_narrow.png"
          alt="카카오 로그인"
          width={222}
          height={49}
        />
      </button>
      <button onClick={() => handleLogin('naver')} aria-label="네이버 로그인">
        <Image
          src="/login/btnG_완성형.png"
          alt="네이버 로그인"
          width={222}
          height={49}
        />
      </button>
      <button onClick={() => handleLogin('google')}>
        구글 로그인
      </button>
      </div>
      </div>
     
      
    </div>
  );
}
