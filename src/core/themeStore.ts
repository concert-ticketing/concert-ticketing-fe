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
        const { theme } = get();

        // 브라우저 환경에서만 실행
        if (typeof window !== 'undefined') {
          // localStorage에서 저장된 테마가 없다면 시스템 테마 감지
          const savedTheme = localStorage.getItem('theme-storage');

          if (!savedTheme) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const systemTheme = prefersDark ? 'dark' : 'light';
            get().setTheme(systemTheme);
          } else {
            // 저장된 테마가 있다면 DOM에 적용
            applyThemeToDOM(theme);
            set({ isDark: theme === 'dark' });
          }
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

// DOM에 테마 클래스 적용하는 함수
function applyThemeToDOM(theme: Theme) {
  if (typeof window !== 'undefined') {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}

// 시스템 테마 변경 감지 (선택사항)
export const initializeSystemThemeListener = () => {
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const { theme } = useThemeStore.getState();
      // 사용자가 수동으로 설정한 테마가 없다면 시스템 테마 따라가기
      const hasUserPreference = localStorage.getItem('theme-storage');

      if (!hasUserPreference) {
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
