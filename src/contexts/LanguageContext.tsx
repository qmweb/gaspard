'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  defaultLocale,
  getTranslations,
  locales,
  TranslationsType,
} from '@/utils/translations';

type Language = (typeof locales)[number];

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  translations: TranslationsType | null;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [currentLanguage, setCurrentLanguage] =
    useState<Language>(defaultLocale);
  const [translations, setTranslations] = useState<TranslationsType | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  // Only run on client side
  useEffect(() => {
    setMounted(true);
    const savedLanguage = localStorage.getItem('preferredLanguage') as Language;
    if (savedLanguage && locales.includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const loadTranslations = async () => {
      setIsLoading(true);
      const newTranslations = await getTranslations(currentLanguage);
      setTranslations(newTranslations);
      setIsLoading(false);
      localStorage.setItem('preferredLanguage', currentLanguage);
    };

    loadTranslations();
  }, [currentLanguage, mounted]);

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
  };

  // Use default translations for initial SSR render
  if (!mounted) {
    return (
      <LanguageContext.Provider
        value={{
          currentLanguage: defaultLocale,
          setLanguage,
          translations: null,
          isLoading: true,
        }}
      >
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider
      value={{ currentLanguage, setLanguage, translations, isLoading }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
