import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Locale, defaultLocale, getBrowserLocale } from '@/i18n/config';

interface LocaleStore {
  locale: Locale;
  isInitialized: boolean;
  setLocale: (locale: Locale) => void;
  initializeLocale: () => void;
}

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set, get) => ({
      locale: defaultLocale,
      isInitialized: false,

      setLocale: (locale) => set({ locale }),

      initializeLocale: () => {
        const { isInitialized } = get();
        if (isInitialized) return;

        // Only detect browser locale if no stored preference exists
        // The persist middleware will have already loaded any stored value
        const storedState = localStorage.getItem('stackoverkill-locale');
        if (!storedState) {
          const browserLocale = getBrowserLocale();
          set({ locale: browserLocale, isInitialized: true });
        } else {
          set({ isInitialized: true });
        }
      },
    }),
    {
      name: 'stackoverkill-locale',
      partialize: (state) => ({ locale: state.locale }),
    }
  )
);
