import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

import { THUMBNAIL_COLORS, PREDEFINED_ICONS, PREDEFINED_TAGS } from './options';
import styles from './create.module.css';

interface VenueFormData {
  name: string;
  location: string;
  description: string;
  thumbnail: string;
  thumbnailImage: string | null;
  selectedIcon: string;
  tags: string[];
  floorCount: number;
  estimatedSeats: number;
  venueType: 'indoor' | 'outdoor' | 'mixed';
  capacity: 'small' | 'medium' | 'large' | 'xlarge';
}

interface FormErrors {
  name?: string;
  location?: string;
  description?: string;
  floorCount?: string;
  estimatedSeats?: string;
}

export default function CreateForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<VenueFormData>({
    name: '',
    location: '',
    description: '',
    thumbnail: THUMBNAIL_COLORS[0],
    thumbnailImage: null,
    selectedIcon: '🎪',
    tags: [],
    floorCount: 1,
    estimatedSeats: 1000,
    venueType: 'indoor',
    capacity: 'medium',
  });

  const updateFormData = <K extends keyof VenueFormData>(
    field: K,
    value: VenueFormData[K],
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
        updateFormData('thumbnailImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (): void => {
    updateFormData('thumbnailImage', null);
  };

  const toggleTag = (tag: string): void => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '콘서트장 이름을 입력해주세요.';
    } else if (formData.name.length < 2) {
      newErrors.name = '콘서트장 이름은 최소 2글자 이상이어야 합니다.';
    } else if (formData.name.length > 50) {
      newErrors.name = '콘서트장 이름은 최대 50글자까지 입력 가능합니다.';
    }

    if (!formData.location.trim()) {
      newErrors.location = '위치를 입력해주세요.';
    } else if (formData.location.length < 2) {
      newErrors.location = '위치는 최소 2글자 이상이어야 합니다.';
    }

    if (!formData.description.trim()) {
      newErrors.description = '설명을 입력해주세요.';
    } else if (formData.description.length < 10) {
      newErrors.description = '설명은 최소 10글자 이상 입력해주세요.';
    } else if (formData.description.length > 200) {
      newErrors.description = '설명은 최대 200글자까지 입력 가능합니다.';
    }

    if (formData.floorCount < 1 || formData.floorCount > 10) {
      newErrors.floorCount = '층 수는 1~10층 사이여야 합니다.';
    }

    if (formData.estimatedSeats < 100 || formData.estimatedSeats > 100000) {
      newErrors.estimatedSeats = '예상 좌석 수는 100~100,000석 사이여야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // API 호출 시뮬레이션
      const postData = {
        name: formData.name,
        location: formData.location,
        description: formData.description,
        thumbnail: formData.thumbnail,
        thumbnailImage: formData.thumbnailImage,
        selectedIcon: formData.selectedIcon,
        tags: formData.tags,
        floorCount: formData.floorCount,
        estimatedSeats: formData.estimatedSeats,
        venueType: formData.venueType,
        capacity: formData.capacity,
        createdAt: new Date().toISOString(),
        id: `venue_${Date.now()}`,
      };
      console.log('전체 POST 데이터:', postData);

      await new Promise((resolve) => {
        setTimeout(resolve, 1500);
      });

      console.log('콘서트장 생성 완료!');

      // 성공 시 목록 페이지로 이동
      router.push('/admin/venues');
    } catch (error) {
      console.error('콘서트장 생성 실패:', error);
      alert('콘서트장 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>🎪 새 콘서트장 만들기</h1>
          <p className={styles.subtitle}>
            새로운 콘서트장의 기본 정보를 입력하고 첫 번째 층을 설계해보세요.
          </p>
        </div>
      </div>

      <div className={styles.content}>
        {/* 프리뷰 카드 */}
        <div className={styles.previewSection}>
          <h3 className={styles.sectionTitle}>📋 미리보기</h3>
          <div className={styles.previewCard}>
            <div
              className={styles.previewThumbnail}
              style={{ backgroundColor: formData.thumbnail }}
            >
              {formData.thumbnailImage ? (
                <Image
                  src={formData.thumbnailImage}
                  alt='콘서트장 썸네일'
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
                <span style={{ fontSize: '24px' }}>{formData.selectedIcon}</span>
              )}
            </div>

            <div className={styles.previewInfo}>
              <h4 className={styles.previewName}>{formData.name || '콘서트장 이름'}</h4>
              <p className={styles.previewLocation}>
                📍 {formData.location || '위치를 입력하세요'}
              </p>
              <p className={styles.previewDescription}>
                {formData.description || '설명을 입력하세요...'}
              </p>

              <div className={styles.previewStats}>
                <span className={styles.previewStat}>
                  {formData.estimatedSeats.toLocaleString()}석
                </span>
                <span className={styles.previewStat}>{formData.floorCount}층</span>
                <span className={styles.previewStat}>
                  {(() => {
                    if (formData.venueType === 'indoor') return '실내';
                    if (formData.venueType === 'outdoor') return '야외';
                    return '복합';
                  })()}
                </span>
              </div>

              {formData.tags.length > 0 && (
                <div className={styles.previewTags}>
                  {formData.tags.map((tag) => (
                    <span key={tag} className={styles.previewTag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 입력 폼 */}
        <div className={styles.form}>
          {/* 기본 정보 */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>📝 기본 정보</h3>

            <div className={styles.formGrid}>
              {/* 콘서트장 이름 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  콘서트장 이름 <span className={styles.required}>*</span>
                </label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder='예: 서울 아레나'
                  className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  maxLength={50}
                />
                {errors.name && (
                  <span className={styles.errorMessage}>{errors.name}</span>
                )}
                <span className={styles.inputHint}>{formData.name.length}/50</span>
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
                  placeholder='예: 서울 송파구 올림픽로 424'
                  className={`${styles.input} ${errors.location ? styles.inputError : ''}`}
                  maxLength={100}
                />
                {errors.location && (
                  <span className={styles.errorMessage}>{errors.location}</span>
                )}
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
                placeholder='콘서트장에 대한 간단한 설명을 입력해주세요...'
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

          {/* 시각적 설정 */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>🎨 시각적 설정</h3>

            {/* 이미지 업로드 */}
            <div className={styles.formGroup}>
              <label className={styles.label}>썸네일 이미지</label>
              <div className={styles.imageUploadSection}>
                {formData.thumbnailImage ? (
                  <div className={styles.imagePreview}>
                    <Image
                      src={formData.thumbnailImage}
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
              <div className={styles.inputHint}>
                추천 크기: 400x400px, 최대 5MB (JPG, PNG, GIF)
              </div>
            </div>

            {/* 아이콘 선택 (이미지가 없을 때만 표시) */}
            {!formData.thumbnailImage && (
              <div className={styles.formGroup}>
                <label className={styles.label}>아이콘 선택</label>
                <div className={styles.iconGrid}>
                  {PREDEFINED_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type='button'
                      onClick={() => updateFormData('selectedIcon', icon)}
                      className={`${styles.iconButton} ${
                        formData.selectedIcon === icon ? styles.iconButtonActive : ''
                      }`}
                      title={icon}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 테마 색상 */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                {formData.thumbnailImage ? '배경 색상' : '테마 색상'}
              </label>
              <div className={styles.colorGrid}>
                {THUMBNAIL_COLORS.map((color) => (
                  <button
                    key={color}
                    type='button'
                    onClick={() => updateFormData('thumbnail', color)}
                    className={`${styles.colorButton} ${
                      formData.thumbnail === color ? styles.colorButtonActive : ''
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  >
                    {formData.thumbnail === color && '✓'}
                  </button>
                ))}
              </div>
              {formData.thumbnailImage && (
                <div className={styles.inputHint}>
                  이미지 뒤 배경색으로 사용됩니다. (GIF 파일은 불가)
                </div>
              )}
            </div>
          </div>

          {/* 규모 및 타입 */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>📊 규모 및 타입</h3>

            <div className={styles.formGrid}>
              {/* 층 수 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  층 수 <span className={styles.required}>*</span>
                </label>
                <input
                  type='number'
                  value={formData.floorCount}
                  onChange={(e) =>
                    updateFormData('floorCount', Number(e.target.value) || 1)
                  }
                  min='1'
                  max='10'
                  className={`${styles.input} ${errors.floorCount ? styles.inputError : ''}`}
                />
                {errors.floorCount && (
                  <span className={styles.errorMessage}>{errors.floorCount}</span>
                )}
              </div>

              {/* 예상 좌석 수 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  예상 좌석 수 <span className={styles.required}>*</span>
                </label>
                <input
                  type='number'
                  value={formData.estimatedSeats}
                  onChange={(e) =>
                    updateFormData('estimatedSeats', Number(e.target.value) || 1000)
                  }
                  min='100'
                  max='100000'
                  step='100'
                  className={`${styles.input} ${errors.estimatedSeats ? styles.inputError : ''}`}
                />
                {errors.estimatedSeats && (
                  <span className={styles.errorMessage}>{errors.estimatedSeats}</span>
                )}
              </div>
            </div>

            {/* 공연장 타입 */}
            <div className={styles.formGroup}>
              <label className={styles.label}>공연장 타입</label>
              <div className={styles.radioGroup}>
                {[
                  {
                    value: 'indoor',
                    label: '실내',
                    icon: '🏢',
                    desc: '폐쇄된 실내 공간',
                  },
                  {
                    value: 'outdoor',
                    label: '야외',
                    icon: '🌳',
                    desc: '개방된 야외 공간',
                  },
                  { value: 'mixed', label: '복합', icon: '🏛️', desc: '실내외 혼합 공간' },
                ].map((option) => (
                  <label key={option.value} className={styles.radioOption}>
                    <input
                      type='radio'
                      name='venueType'
                      value={option.value}
                      checked={formData.venueType === option.value}
                      onChange={(e) =>
                        updateFormData(
                          'venueType',
                          e.target.value as VenueFormData['venueType'],
                        )
                      }
                      className={styles.radioInput}
                    />
                    <div className={styles.radioContent}>
                      <div className={styles.radioIcon}>{option.icon}</div>
                      <div className={styles.radioText}>
                        <div className={styles.radioLabel}>{option.label}</div>
                        <div className={styles.radioDesc}>{option.desc}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 규모 */}
            <div className={styles.formGroup}>
              <label className={styles.label}>규모 분류</label>
              <select
                value={formData.capacity}
                onChange={(e) =>
                  updateFormData('capacity', e.target.value as VenueFormData['capacity'])
                }
                className={styles.select}
              >
                <option value='small'>소형 (100~1,000석)</option>
                <option value='medium'>중형 (1,000~5,000석)</option>
                <option value='large'>대형 (5,000~20,000석)</option>
                <option value='xlarge'>초대형 (20,000석 이상)</option>
              </select>
            </div>
          </div>

          {/* 태그 */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>🏷️ 태그</h3>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                태그 선택 ({formData.tags.length}/10)
              </label>
              <div className={styles.tagGrid}>
                {PREDEFINED_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type='button'
                    onClick={() => toggleTag(tag)}
                    disabled={!formData.tags.includes(tag) && formData.tags.length >= 10}
                    className={`${styles.tagButton} ${
                      formData.tags.includes(tag) ? styles.tagButtonActive : ''
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className={styles.inputHint}>
                콘서트장을 설명하는 태그를 선택해주세요. (최대 10개)
              </div>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className={styles.submitSection}>
            <div className={styles.submitButtons}>
              <Link href='/admin/venues' className={styles.cancelButton}>
                취소
              </Link>

              <button
                type='button'
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.spinner} />
                    생성 중...
                  </>
                ) : (
                  '🎪 콘서트장 생성하기'
                )}
              </button>
            </div>

            <div className={styles.submitHint}>
              생성 후 층별 상세 설계를 진행할 수 있습니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
