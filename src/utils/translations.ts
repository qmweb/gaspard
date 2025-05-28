type TranslationSection =
  | 'common'
  | 'navigation'
  | 'navigationGroups'
  | 'auth'
  | 'dashboard';

export interface TranslationsType {
  common?: Record<string, string>;
  navigation?: Record<string, string>;
  navigationGroups?: Record<string, string>;
  auth?: Record<string, string>;
  dashboard?: Record<string, string>;
}

export async function getTranslations(
  lang: string,
): Promise<TranslationsType | null> {
  try {
    return (await import(`@/locales/${lang}/common.json`)).default;
  } catch (error) {
    console.error(`Failed to load translations for ${lang}`, error);
    return null;
  }
}

export function getTranslation(
  translations: TranslationsType | null,
  key: string,
): string {
  const [section, translationKey] = key.split('.') as [
    TranslationSection,
    string,
  ];
  return translations?.[section]?.[translationKey] || key;
}

export const defaultLocale = 'fr';
export const locales = ['fr', 'en', 'es'] as const;
