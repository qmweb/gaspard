'use client';

import { useLanguage } from '@/utils/contexts/LanguageContext';
import { getTranslation } from '@/utils/translations';

export function useTranslation() {
  const { translations, isLoading } = useLanguage();

  const t = (key: string) => {
    if (!translations) return key;
    return getTranslation(translations, key);
  };

  return { t, isLoading };
}
