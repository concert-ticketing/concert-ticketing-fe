import React, { useEffect, useRef } from 'react';

interface PostcodeModalProps {
  onAddressSelect: (data: any) => void;
  onClose: () => void;
}

declare global {
  interface Window {
    daum: any;
  }
}

const PostcodeModal: React.FC<PostcodeModalProps> = ({ onAddressSelect, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadDaumPostcode = () => {
      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.onload = () => {
        if (containerRef.current) {
          new window.daum.Postcode({
            oncomplete: function (data: any) {
              onAddressSelect(data);
            },
            width: '100%',
            height: '400px',
          }).embed(containerRef.current);
        }
      };

      script.onerror = () => {
        console.error('Daum API 로드 실패');
      };

      document.head.appendChild(script);
    };

    if (window.daum && window.daum.Postcode) {
      if (containerRef.current) {
        new window.daum.Postcode({
          oncomplete: function (data: any) {
            onAddressSelect(data);
          },
          width: '100%',
          height: '400px',
        }).embed(containerRef.current);
      }
    } else {
      loadDaumPostcode();
    }
  }, [onAddressSelect]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '500px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#000' }}>
            주소 검색
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        <div
          ref={containerRef}
          style={{
            width: '100%',
            height: '400px',
          }}
        />

        <div
          style={{
            padding: '15px',
            borderTop: '1px solid #eee',
            textAlign: 'right',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: '#f5f5f5',
              cursor: 'pointer',
            }}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostcodeModal;
