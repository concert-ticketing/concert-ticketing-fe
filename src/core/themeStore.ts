import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  initializeTheme: () => void;
}

// DOM에 테마 클래스 적용하는 함수
const applyThemeToDOM = (theme: Theme) => {
  if (typeof window !== 'undefined') {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      isDark: false,

      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({
          theme: newTheme,
          isDark: newTheme === 'dark',
        });
        applyThemeToDOM(newTheme);
      },

      setTheme: (theme: Theme) => {
        set({
          theme,
          isDark: theme === 'dark',
        });
        applyThemeToDOM(theme);
      },

      initializeTheme: () => {
        // 브라우저 환경에서만 실행
        if (typeof window !== 'undefined') {
          // 컴포넌트 마운트 시 짧은 지연 후 테마 적용 (persist 완료 대기)
          setTimeout(() => {
            const currentTheme = get().theme;
            applyThemeToDOM(currentTheme);
            set({ isDark: currentTheme === 'dark' });
          }, 0);
        }
      },
    }),
    {
      name: 'theme-storage',
      // localStorage에 저장할 필드만 지정
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
);

// 시스템 테마 변경 감지
export const initializeSystemThemeListener = () => {
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // 사용자가 수동으로 설정한 테마가 있는지 확인
      const storage = localStorage.getItem('theme-storage');

      if (!storage) {
        // 저장된 테마가 없으면 시스템 테마 따라가기
        const systemTheme = e.matches ? 'dark' : 'light';
        useThemeStore.getState().setTheme(systemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    // 클린업 함수 반환
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }
};
