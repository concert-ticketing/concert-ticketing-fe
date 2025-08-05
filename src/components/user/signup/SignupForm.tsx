import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './SignupForm.module.css';

export default function SignupForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    gender: '',
    email: '',
    nickname: '',
    birthday: '',
    phone: '',
    verifyCode: '',
  });

  const [errors, setErrors] = useState<typeof form>({
    name: '',
    gender: '',
    email: '',
    nickname: '',
    birthday: '',
    phone: '',
    verifyCode: '',
  });

  const [showVerifyInput, setShowVerifyInput] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const cleanValue = name === 'phone' ? value.replace(/[^0-9]/g, '') : value;

    setForm((prev) => ({ ...prev, [name]: cleanValue }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = { ...errors };
    let isValid = true;

    if (!form.name) {
      newErrors.name = '이름을 입력해주세요.';
      isValid = false;
    }
    if (!form.gender) {
      newErrors.gender = '성별을 선택해주세요.';
      isValid = false;
    }
    if (!form.email) {
      newErrors.email = '이메일을 입력해주세요.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = '유효한 이메일 형식으로 작성해주세요.';
      isValid = false;
    }
    if (!form.nickname) {
      newErrors.nickname = '닉네임을 입력해주세요.';
      isValid = false;
    }
    if (!form.birthday) {
      newErrors.birthday = '생년월일을 선택해주세요.';
      isValid = false;
    }
    if (!form.phone) {
      newErrors.phone = '핸드폰 번호를 입력해주세요.';
      isValid = false;
    }
    if (showVerifyInput && !form.verifyCode) {
      newErrors.verifyCode = '인증번호를 입력해주세요.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleVerifyClick = () => {
    if (!form.phone) {
      setErrors((prev) => ({
        ...prev,
        phone: '핸드폰 번호를 먼저 입력해주세요.',
      }));
      return;
    }
    // TODO: 인증번호 요청 API 호출 가능
    setShowVerifyInput(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      name: form.name,
      gender: form.gender === 'male' ? 'MAN' : 'WOMAN',
      email: form.email,
      nickName: form.nickname,
      phone: form.phone,
      birthday: form.birthday,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_LOCAL_BASE_URL}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

      if (res.ok) {
        alert('회원가입 성공!');
        router.push('/');
      } else {
        const data = await res.json();
        alert(`회원가입 실패: ${data.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      alert('네트워크 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>concert-ticketing</h1>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* 이름 */}
        <div className={styles.inputGroup}>
          <label htmlFor='name'>이름</label>
          <input
            id='name'
            name='name'
            value={form.name}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.name && <p className={styles.error}>{errors.name}</p>}
        </div>

        {/* 성별 */}
        <div className={styles.inputGroup}>
          <label htmlFor='gender'>성별</label>
          <select
            id='gender'
            name='gender'
            value={form.gender}
            onChange={handleChange}
            className={styles.input}
          >
            <option value=''>성별</option>
            <option value='female'>여</option>
            <option value='male'>남</option>
          </select>
          {errors.gender && <p className={styles.error}>{errors.gender}</p>}
        </div>

        {/* 이메일 */}
        <div className={styles.inputGroup}>
          <label htmlFor='email'>이메일</label>
          <input
            type='email'
            id='email'
            name='email'
            value={form.email}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>

        {/* 닉네임 */}
        <div className={styles.inputGroup}>
          <label htmlFor='nickname'>닉네임</label>
          <input
            id='nickname'
            name='nickname'
            value={form.nickname}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.nickname && <p className={styles.error}>{errors.nickname}</p>}
        </div>

        {/* 생년월일 */}
        <div className={styles.inputGroup}>
          <label htmlFor='birthday'>생년월일</label>
          <input
            id='birthday'
            name='birthday'
            type='date'
            value={form.birthday}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.birthday && <p className={styles.error}>{errors.birthday}</p>}
        </div>

        {/* 핸드폰번호 */}
        <div className={styles.inputGroup}>
          <label htmlFor='phone'>핸드폰번호</label>
          <div className={styles.inputWrapper}>
            <input
              type='tel'
              id='phone'
              name='phone'
              value={form.phone}
              onChange={handleChange}
              className={styles.input}
            />
            <button
              type='button'
              className={styles.verifyButton}
              onClick={handleVerifyClick}
            >
              인증
            </button>
          </div>
          {errors.phone && <p className={styles.error}>{errors.phone}</p>}
        </div>

        {/* 인증번호 */}
        {showVerifyInput && (
          <div className={styles.inputGroup}>
            <label htmlFor='verifyCode'>인증번호</label>
            <input
              id='verifyCode'
              name='verifyCode'
              value={form.verifyCode}
              onChange={handleChange}
              className={styles.input}
            />
            {errors.verifyCode && <p className={styles.error}>{errors.verifyCode}</p>}
          </div>
        )}

        <button type='submit' className={styles.submitButton}>
          회원가입
        </button>
      </form>
    </div>
  );
}
