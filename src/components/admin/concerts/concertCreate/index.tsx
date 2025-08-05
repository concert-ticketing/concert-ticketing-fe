import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useVenueStore } from '@/stores/venue';
import styles from './concertCreate.module.css';
import PostcodeModal from './PostcodeModal';

declare global {
  interface Window {
    kakao: any;
  }
}

interface ConcertFormData {
  title: string;
  description: string;
  location: string;
  location_x: number | null;
  location_y: number | null;
  start_date: string;
  end_date: string;
  thumbnail_image: string | null;
  svg_content: string | null;
  schedules: {
    startTime: string;
    endTime: string;
  }[];
}

interface FormErrors {
  title?: string;
  location?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  thumbnail_image?: string;
  svg_content?: string;
  schedules?: string;
}

export default function ConcertCreate() {
  const router = useRouter();
  const createVenue = useVenueStore((state) => state.createVenue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPostcodeModal, setShowPostcodeModal] = useState(false);

  const [formData, setFormData] = useState<ConcertFormData>({
    title: '',
    description: '',
    location: '',
    location_x: null,
    location_y: null,
    start_date: '',
    end_date: '',
    thumbnail_image: null,
    svg_content: null,
    schedules: [{ startTime: '', endTime: '' }],
  });

  const updateFormData = <K extends keyof ConcertFormData>(
    field: K,
    value: ConcertFormData[K],
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // 에러 메시지 제거
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateFormData('thumbnail_image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (): void => {
    updateFormData('thumbnail_image', null);
  };

  const handleSVGUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'image/svg+xml') {
        setErrors((prev) => ({ ...prev, svg_content: 'SVG 파일만 업로드 가능합니다.' }));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        updateFormData('svg_content', reader.result as string);
      };
      reader.readAsText(file);
    }
  };

  const removeSVG = (): void => {
    updateFormData('svg_content', null);
  };

  const addSchedule = (): void => {
    setFormData((prev) => ({
      ...prev,
      schedules: [...prev.schedules, { startTime: '', endTime: '' }],
    }));
  };

  const removeSchedule = (index: number): void => {
    setFormData((prev) => ({
      ...prev,
      schedules: prev.schedules.filter((_, i) => i !== index),
    }));
  };

  const updateSchedule = (
    index: number,
    field: 'startTime' | 'endTime',
    value: string,
  ): void => {
    setFormData((prev) => ({
      ...prev,
      schedules: prev.schedules.map((schedule, i) =>
        i === index ? { ...schedule, [field]: value } : schedule,
      ),
    }));
  };

  const handleAddressSelect = (data: any): void => {
    let fullAddress = data.address;
    let extraAddress = '';

    // 법정동명이 있을 때 추가
    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress +=
          extraAddress !== '' ? ', ' + data.buildingName : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ' (' + extraAddress + ')' : '';
    }

    updateFormData('location', fullAddress);

    // TODO: 추후 카카오 지도 API 연동하여 주소를 좌표로 변환 구현 필요

    setShowPostcodeModal(false);
  };

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '콘서트 제목을 입력해주세요.';
    } else if (formData.title.length < 2) {
      newErrors.title = '콘서트 제목은 최소 2글자 이상이어야 합니다.';
    } else if (formData.title.length > 50) {
      newErrors.title = '콘서트 제목은 최대 50글자까지 입력 가능합니다.';
    }

    if (!formData.location.trim()) {
      newErrors.location = '위치를 입력해주세요.';
    } else if (formData.location.length < 2) {
      newErrors.location = '위치는 최소 2글자 이상이어야 합니다.';
    }

    if (!formData.thumbnail_image?.trim()) {
      newErrors.thumbnail_image = '썸네일 이미지를 업로드해주세요.';
    }

    if (!formData.description.trim()) {
      newErrors.description = '설명을 입력해주세요.';
    } else if (formData.description.length < 10) {
      newErrors.description = '설명은 최소 10글자 이상 입력해주세요.';
    } else if (formData.description.length > 200) {
      newErrors.description = '설명은 최대 200글자까지 입력 가능합니다.';
    }

    if (!formData.start_date) {
      newErrors.start_date = '콘서트 시작일자를 선택해주세요.';
    }

    if (!formData.end_date) {
      newErrors.end_date = '콘서트 종료일자를 선택해주세요.';
    }

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      if (startDate > endDate) {
        newErrors.end_date = '종료일자는 시작일자보다 늦어야 합니다.';
      }
    }

    if (formData.schedules.length === 0) {
      newErrors.schedules = '최소 1개의 공연 시간을 설정해주세요.';
    } else {
      for (let i = 0; i < formData.schedules.length; i++) {
        const schedule = formData.schedules[i];
        if (!schedule.startTime || !schedule.endTime) {
          newErrors.schedules = `${i + 1}번째 공연 시간을 모두 입력해주세요.`;
          break;
        }
        const startTime = new Date(schedule.startTime);
        const endTime = new Date(schedule.endTime);
        if (startTime >= endTime) {
          newErrors.schedules = `${i + 1}번째 공연의 종료시간이 시작시간보다 늦어야 합니다.`;
          break;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const newVenue = await createVenue({
        title: formData.title,
        location: formData.location,
        description: formData.description,
        thumbnailImage: formData.thumbnailImage ?? '',
        tags: formData.tags,
        floorCount: formData.floorCount,
        estimatedSeats: formData.estimatedSeats,
        venueType: formData.venueType,
        capacity: formData.capacity,
        svgData: '',
        zones: [],
      });

      console.log('✅ 공연장 생성 성공:', newVenue);
      router.push('/admin/venues');
    } catch (error) {
      console.error('❌ 공연장 생성 실패:', error);
      alert('공연장 생성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* 프리뷰 카드 */}
        <div className={styles.previewSection}>
          <div className={styles.previewCard}>
            <div className={styles.previewThumbnail}>
              {formData.thumbnail_image ? (
                <Image
                  src={formData.thumbnail_image}
                  alt='콘서트 썸네일'
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                  width={200}
                  height={200}
                />
              ) : (
                <span className={styles.placeholder}>썸네일 이미지</span>
              )}
            </div>

            <div className={styles.previewInfo}>
              <h4 className={styles.previewName}>{formData.title || '콘서트 제목'}</h4>
              <p className={styles.previewLocation}>
                📍 {formData.location || '위치를 입력하세요'}
              </p>
              <p className={styles.previewDescription}>
                {formData.description || '설명을 입력하세요...'}
              </p>

              <div className={styles.previewStats}>
                {formData.start_date && (
                  <span className={styles.previewStat}>
                    📅 {new Date(formData.start_date).toLocaleDateString()}
                  </span>
                )}
                <span className={styles.previewStat}>
                  🎵 {formData.schedules.length}회차
                </span>
                {formData.svg_content && (
                  <span className={styles.previewStat}>🗺️ 배치도</span>
                )}
                {formData.location_x && formData.location_y && (
                  <span className={styles.previewStat}>📍 좌표</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 입력 폼 */}
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* 기본 정보 */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>기본 정보</h3>
            <div className={styles.formGrid}>
              {/* 콘서트 제목 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  콘서트 제목 <span className={styles.required}>*</span>
                </label>
                <input
                  type='text'
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  placeholder='예: BTS World Tour'
                  className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                  maxLength={50}
                />
                {errors.title && (
                  <span className={styles.errorMessage}>{errors.title}</span>
                )}
                <span className={styles.inputHint}>{formData.title.length}/50</span>
              </div>

              {/* 위치 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  위치 <span className={styles.required}>*</span>
                </label>
                <input
                  type='text'
                  value={formData.location}
                  onChange={(e) => updateFormData('location', e.target.value)}
                  onClick={() => {
                    console.log('위치 입력창 클릭됨');
                    setShowPostcodeModal(true);
                  }}
                  placeholder='클릭하여 주소 검색'
                  className={`${styles.input} ${styles.clickableInput} ${errors.location ? styles.inputError : ''}`}
                  maxLength={100}
                  readOnly
                />
                {errors.location && (
                  <span className={styles.errorMessage}>{errors.location}</span>
                )}
                <div className={styles.inputHint}>
                  주소를 정확하게 입력하려면 클릭하세요
                </div>
              </div>
            </div>

            {/* 설명 */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                설명 <span className={styles.required}>*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder='콘서트에 대한 간단한 설명을 입력해주세요...'
                className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                rows={4}
                maxLength={200}
              />
              {errors.description && (
                <span className={styles.errorMessage}>{errors.description}</span>
              )}
              <span className={styles.inputHint}>{formData.description.length}/200</span>
            </div>
          </div>

          {/* 일정 정보 */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>일정 정보</h3>
            <div className={styles.formGrid}>
              {/* 시작일자 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  시작일자 <span className={styles.required}>*</span>
                </label>
                <input
                  type='date'
                  value={formData.start_date}
                  onChange={(e) => updateFormData('start_date', e.target.value)}
                  className={`${styles.input} ${errors.start_date ? styles.inputError : ''}`}
                />
                {errors.start_date && (
                  <span className={styles.errorMessage}>{errors.start_date}</span>
                )}
              </div>

              {/* 종료일자 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  종료일자 <span className={styles.required}>*</span>
                </label>
                <input
                  type='date'
                  value={formData.end_date}
                  onChange={(e) => updateFormData('end_date', e.target.value)}
                  className={`${styles.input} ${errors.end_date ? styles.inputError : ''}`}
                />
                {errors.end_date && (
                  <span className={styles.errorMessage}>{errors.end_date}</span>
                )}
              </div>
            </div>
          </div>

          {/* 공연 스케줄 */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>공연 스케줄</h3>
            {formData.schedules.map((schedule, index) => (
              <div key={index} className={styles.scheduleItem}>
                <div className={styles.scheduleHeader}>
                  <span className={styles.scheduleNumber}>{index + 1}회차</span>
                  {formData.schedules.length > 1 && (
                    <button
                      type='button'
                      onClick={() => removeSchedule(index)}
                      className={styles.removeScheduleButton}
                    >
                      삭제
                    </button>
                  )}
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>시작시간</label>
                    <input
                      type='datetime-local'
                      value={schedule.startTime}
                      onChange={(e) => updateSchedule(index, 'startTime', e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>종료시간</label>
                    <input
                      type='datetime-local'
                      value={schedule.endTime}
                      onChange={(e) => updateSchedule(index, 'endTime', e.target.value)}
                      className={styles.input}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type='button'
              onClick={addSchedule}
              className={styles.addScheduleButton}
            >
              + 스케줄 추가
            </button>

            {errors.schedules && (
              <span className={styles.errorMessage}>{errors.schedules}</span>
            )}
          </div>

          {/* 이미지 및 배치도 */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>이미지 및 배치도</h3>
            <div className={styles.formGrid}>
              {/* 썸네일 이미지 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>썸네일 이미지 *</label>
                <div className={styles.imageUploadSection}>
                  {formData.thumbnail_image ? (
                    <div className={styles.imagePreview}>
                      <Image
                        src={formData.thumbnail_image}
                        alt='썸네일 미리보기'
                        width={200}
                        height={200}
                        style={{ objectFit: 'cover' }}
                      />
                      <button
                        type='button'
                        onClick={removeImage}
                        className={styles.removeImageButton}
                        title='이미지 제거'
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label className={styles.imageUploadBox}>
                      <input
                        type='file'
                        accept='image/*'
                        onChange={handleImageUpload}
                        className={styles.imageInput}
                      />
                      <div className={styles.uploadContent}>
                        <div className={styles.uploadIcon}>📷</div>
                        <div className={styles.uploadText}>
                          <div>이미지 업로드</div>
                          <div className={styles.uploadSubtext}>클릭하여 이미지 선택</div>
                        </div>
                      </div>
                    </label>
                  )}
                </div>
                <div className={styles.inputHint}>최대 5MB (JPG, PNG, GIF)</div>
                {errors.thumbnail_image && (
                  <span className={styles.errorMessage}>{errors.thumbnail_image}</span>
                )}
              </div>

              {/* SVG 콘서트 배치도 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>콘서트 배치도 (SVG)</label>
                <div className={styles.svgUploadSection}>
                  {formData.svg_content ? (
                    <div className={styles.svgPreview}>
                      <div
                        className={styles.svgContainer}
                        dangerouslySetInnerHTML={{ __html: formData.svg_content }}
                      />
                      <button
                        type='button'
                        onClick={removeSVG}
                        className={styles.removeSvgButton}
                        title='SVG 제거'
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label className={styles.svgUploadBox}>
                      <input
                        type='file'
                        accept='.svg'
                        onChange={handleSVGUpload}
                        className={styles.svgInput}
                      />
                      <div className={styles.uploadContent}>
                        <div className={styles.uploadIcon}>🗺️</div>
                        <div className={styles.uploadText}>
                          <div>SVG 배치도 업로드</div>
                          <div className={styles.uploadSubtext}>콘서트 좌석 배치도</div>
                        </div>
                      </div>
                    </label>
                  )}
                </div>
                <div className={styles.inputHint}>
                  콘서트 좌석 배치도 SVG 파일 (선택사항)
                </div>
                {errors.svg_content && (
                  <span className={styles.errorMessage}>{errors.svg_content}</span>
                )}
              </div>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className={styles.submitSection}>
            <div className={styles.submitButtons}>
              <Link href='/admin/concerts' className={styles.cancelButton}>
                취소
              </Link>

              <button
                type='submit'
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.spinner} />
                    생성 중...
                  </>
                ) : (
                  '콘서트 생성하기'
                )}
              </button>
            </div>

            <div className={styles.submitHint}>
              생성 후 추가 설정을 진행할 수 있습니다.
            </div>
          </div>
        </form>
      </div>

      {/* Daum 우편번호 검색 모달 */}
      {showPostcodeModal && (
        <PostcodeModal
          onAddressSelect={handleAddressSelect}
          onClose={() => setShowPostcodeModal(false)}
        />
      )}
    </div>
  );
}
