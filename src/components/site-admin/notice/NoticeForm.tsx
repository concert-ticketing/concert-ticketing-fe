import { useState, ChangeEvent } from 'react';
import styles from './NoticeForm.module.css';

type NoticeFormProps = {
  mode: 'create' | 'edit';
  initialData?: {
    title: string;
    description?: string;
    status:string;
    imageUrl?: string;
  };
  onSubmit: (form: {
    title: string;
    status:string;
    description: string;
    imageFile: File | null;
  }) => void;
};

const NoticeForm = ({ mode, initialData, onSubmit }: NoticeFormProps) => {
    console.log('initialData:', initialData);
  console.log('initialData.status:', initialData?.status);
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState(initialData?.status || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null,
  );

  console.log('sdasdasasd',status)
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, status, imageFile });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label htmlFor='title'>제목</label>
      <input
        id='title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='공지사항 제목을 입력하세요'
        required
      />

      <label htmlFor='description'>설명</label>
      <textarea
        id='description'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder='공지사항 설명을 입력하세요'
        rows={10}
      />
     <label htmlFor="status">공개</label>
     <select
        id='status'
        value={status}
        onChange={(e) => setStatus(e.target.value as '노출' | '비노출')}
      >
        <option value='노출'>노출</option>
        <option value='비노출'>비노출</option>
      </select>

      <label htmlFor='image'>이미지 업로드</label>
      <input type='file' id='image' accept='image/*' onChange={handleImageChange} />

      {imagePreview && (
        <div className={styles.imagePreview}>
          <img src={imagePreview} alt='미리보기' />
        </div>
      )}

      <div className={styles.buttonGroup}>
        <button type='submit'>{mode === 'edit' ? '수정' : '등록'}</button>
      </div>
    </form>
  );
};

export default NoticeForm;
