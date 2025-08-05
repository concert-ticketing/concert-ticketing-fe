import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoginForm from '@/components/user/login/LoginForm';
import UserTypeSelect from '@/components/user/signup/UserTypeSelect';
import SignupForm from '@/components/user/signup/SignupForm';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<'select' | 'login' | 'signup'>('select'); // 처음은 'select'

  useEffect(() => {
    if (!router.isReady) return;

    const isFirst = router.query.first;

    if (isFirst === 'true') {
      console.log('소셜 로그인 성공: 최초 로그인');
      setStep('signup');
    } else if (isFirst === 'false') {
      console.log('소셜 로그인 성공: 기존 회원');
      router.replace('/login');
    }
  }, [router.isReady, router.query]);

  const handleRoleSelect = (role: 'user' | 'admin') => {
    console.log('선택된 역할:', role);
    setStep('login'); // 역할 선택하면 로그인폼 보여줌
  };

  if (step === 'signup') return <SignupForm />;
  if (step === 'login') return <LoginForm />;
  return <UserTypeSelect onSelect={handleRoleSelect} />;
}
