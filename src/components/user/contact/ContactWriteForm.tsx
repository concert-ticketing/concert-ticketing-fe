import React, { useState } from 'react';
import { useRouter } from 'next/router';

import ContactSidebar from '@/components/user/contact/ContactNav';
import styles from './ContactWrite.module.css';

const CustomerInquiryForm: React.FC = () => {
  const router = useRouter();
  const [category, setCategory] = useState<string>('예매');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [phoneConsent, setPhoneConsent] = useState<boolean>(false);
  const [smsConsent, setSmsConsent] = useState<boolean>(false);
  const [notificationEmail, setNotificationEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const categories = ['예매', '상품', '배송', '취소', '결제/환불', '기타'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleSubmit = () => {
    console.log('문의 제출:', {
      category,
      title,
      content,
      files,
      phoneConsent,
      smsConsent,
      notificationEmail: phoneConsent ? notificationEmail : '',
      phoneNumber: smsConsent ? phoneNumber : '',
    });

    // ✅ 등록 후 이동
    router.push('/mypage/inquiry');
  };

  const handleCancel = () => {
    console.log('취소');
  };

  const handlePhoneConsentChange = (checked: boolean) => {
    setPhoneConsent(checked);
    if (!checked) setNotificationEmail('');
  };

  const handleSmsConsentChange = (checked: boolean) => {
    setSmsConsent(checked);
    if (!checked) setPhoneNumber('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>고객센터</h1>
        <div className={styles.layout}>
          <ContactSidebar activeMenu='inquiry' />
          <div className={styles.mainContent}>
            <h1 className={styles.pageTitle}>1:1 문의하기</h1>

            <div className={styles.form}>
              <div className={styles.formGroup}>
                <select
                  title='카테고리 선택'
                  className={styles.select}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>문의제목</label>
                <input
                  type='text'
                  className={styles.input}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='문의제목을 입력해주세요'
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>문의내용</label>
                <textarea
                  className={styles.textarea}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder='문의 내용을 자세히 적어주세요'
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>파일첨부</label>
                <div className={styles.fileUpload}>
                  <input
                    type='file'
                    multiple
                    onChange={handleFileChange}
                    className={styles.fileInput}
                    id='fileUpload'
                  />
                  <label htmlFor='fileUpload' className={styles.fileLabel}>
                    파일첨부
                  </label>
                </div>
                <div className={styles.fileInfo}>
                  <p>
                    첨부가능 파일용량: 파일당 10MB(총합계100MB)이하로 제한, 총 5개 파일
                    업로드 가능합니다.
                  </p>
                  <p>첨부가능 파일 확장자: jpg, png, PDF등 일반적.</p>
                  <p>
                    캡쳐파일 및 개인정보가 포함되어있는 파일은 첨부 시 주의하여, 차후 삭제
                    처리됩니다. 사용자의 답변요청.
                  </p>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>답변알림</label>
                <div className={styles.checkboxGroup}>
                  <div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>알림 받을 이메일</label>
                      <input
                        type='email'
                        className={styles.inputs}
                        value={notificationEmail}
                        onChange={(e) => setNotificationEmail(e.target.value)}
                        placeholder='알림을 받을 이메일 주소를 입력해주세요'
                        disabled={!phoneConsent}
                      />
                      <label className={styles.checkboxLabel}>
                        <input
                          type='checkbox'
                          checked={phoneConsent}
                          onChange={(e) => handlePhoneConsentChange(e.target.checked)}
                        />
                        <span className={styles.checkboxText}>이메일로 답변 받기</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>휴대폰 번호</label>
                      <input
                        type='tel'
                        className={styles.inputs}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder='휴대폰 번호를 입력해주세요 (예: 010-1234-5678)'
                        disabled={!smsConsent}
                      />
                      <label className={styles.checkboxLabel}>
                        <input
                          type='checkbox'
                          checked={smsConsent}
                          onChange={(e) => handleSmsConsentChange(e.target.checked)}
                        />
                        <span className={styles.checkboxText}>SMS로 받기</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.privacySection}>
                <h3 className={styles.privacyTitle}>(필수)개인정보 수집 및 이용 동의</h3>
                <div className={styles.privacyContent}>
                  <p>
                    고객님의 개인정보를 안전하게 처리할 수 있도록 개인정보를 수집 및
                    이용합니다. 고객문의 처리에만 수집 및 이용 목적으로 이용됩니다.
                  </p>
                  <p>□ 개인정보 항목: 수집정보등의 항목정보</p>
                  <p>
                    수집정보: 이메일, 이름, 전화번호, 비밀번호 등의 정보, 문의 시 작성시,
                    첨부한 파일등
                  </p>
                  <p>□ 이용목적: 고객문의 및 회신답변</p>
                  <p>보유기간: 3년</p>
                </div>
              </div>

              <div className={styles.buttonGroup}>
                <button className={styles.cancelButton} onClick={handleCancel}>
                  취소
                </button>
                <button
                  className={styles.submitButton}
                  onClick={handleSubmit}
                  disabled={!phoneConsent && !smsConsent}
                >
                  등록
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInquiryForm;
