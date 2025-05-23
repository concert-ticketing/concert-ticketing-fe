import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "./Signup.module.css";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    gender: "",
    email: "",
    nickname: "",
    birthday: "",
    phone: "",
    verifyCode: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    gender: "",
    email: "",
    nickname: "",
    birthday: "",
    phone: "",
    verifyCode: "",
  });

  const [showVerifyInput, setShowVerifyInput] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const onlyNumbers = value.replace(/[^0-9]/g, "");
      setForm((prev) => ({ ...prev, [name]: onlyNumbers }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: typeof errors = {
      name: "",
      gender: "",
      email: "",
      nickname: "",
      birthday: "",
      phone: "",
      verifyCode: "",
    };
    let isValid = true;

    if (!form.name) {
      newErrors.name = "이름을 입력해주세요.";
      isValid = false;
    }
    if (!form.gender) {
      newErrors.gender = "성별을 선택해주세요.";
      isValid = false;
    }
    if (!form.email) {
      newErrors.email = "이메일을 입력해주세요.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "유효한 이메일 형식으로 작성해주세요.";
      isValid = false;
    }
    if (!form.nickname) {
      newErrors.nickname = "닉네임을 입력해주세요.";
      isValid = false;
    }
    if (!form.birthday) {
      newErrors.birthday = "생년월일을 선택해주세요.";
      isValid = false;
    }
    if (!form.phone) {
      newErrors.phone = "핸드폰 번호를 입력해주세요.";
      isValid = false;
    }
    if (showVerifyInput && !form.verifyCode) {
      newErrors.verifyCode = "인증번호를 입력해주세요.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleVerifyClick = () => {
    if (!form.phone) {
      setErrors((prev) => ({
        ...prev,
        phone: "핸드폰 번호를 먼저 입력해주세요.",
      }));
      return;
    }
    setShowVerifyInput(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      alert("회원가입 성공!");
      router.push("/");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>concert-ticketing</h1>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* 이름 */}
        <div className={styles.inputGroup}>
          <label htmlFor="name" className={styles.label}>
            이름
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={styles.input}
            value={form.name}
            onChange={handleChange}
            placeholder="이름을 입력해주세요"
          />
          {errors.name && <p className={styles.error}>{errors.name}</p>}
        </div>

        {/* 성별 */}
        <div className={styles.inputGroup}>
          <label htmlFor="gender" className={styles.label}>
            성별
          </label>
          <select
            id="gender"
            name="gender"
            className={styles.input}
            value={form.gender}
            onChange={handleChange}
          >
            <option value="">성별</option>
            <option value="female">여</option>
            <option value="male">남</option>
          </select>
          {errors.gender && <p className={styles.error}>{errors.gender}</p>}
        </div>

        {/* 이메일 */}
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            이메일
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={styles.input}
            value={form.email}
            onChange={handleChange}
            placeholder="이메일을 입력해주세요"
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>

        {/* 닉네임 */}
        <div className={styles.inputGroup}>
          <label htmlFor="nickname" className={styles.label}>
            닉네임
          </label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            className={styles.input}
            value={form.nickname}
            onChange={handleChange}
            placeholder="닉네임을 입력해주세요"
          />
          {errors.nickname && <p className={styles.error}>{errors.nickname}</p>}
        </div>

        {/* 생년월일 */}
        <div className={styles.inputGroup}>
          <label htmlFor="birthday" className={styles.label}>
            생년월일
          </label>

          <input
            type="text"
            id="birthday"
            name="birthday"
            className={styles.input}
            value={form.birthday}
            onChange={handleChange}
          />
          {errors.birthday && <p className={styles.error}>{errors.birthday}</p>}
        </div>

        {/* 핸드폰번호 */}
        <div className={styles.inputGroup}>
          <label htmlFor="phone" className={styles.label}>
            핸드폰번호
          </label>
          <div className={styles.inputWrapper}>
            <input
              type="tel"
              id="phone"
              name="phone"
              className={styles.input}
              value={form.phone}
              onChange={handleChange}
              placeholder="숫자만 입력해주세요"
              inputMode="numeric"
            />
            <button
              type="button"
              className={styles.verifyButton}
              onClick={handleVerifyClick}
            >
              인증
            </button>
          </div>
          {errors.phone && <p className={styles.error}>{errors.phone}</p>}
        </div>

        {/* 인증번호 - 핸드폰 번호 입력 후 인증버튼 클릭 시 노출 */}
        {showVerifyInput && (
          <div className={styles.inputGroup}>
            <label htmlFor="verifyCode" className={styles.label}>
              인증번호
            </label>
            <input
              type="text"
              id="verifyCode"
              name="verifyCode"
              className={styles.input}
              value={form.verifyCode}
              onChange={handleChange}
              placeholder="인증번호를 입력해주세요"
            />
            {errors.verifyCode && (
              <p className={styles.error}>{errors.verifyCode}</p>
            )}
          </div>
        )}

        <button type="submit" className={styles.submitButton}>
          회원가입
        </button>
      </form>
    </div>
  );
}
