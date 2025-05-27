import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['fr', 'en', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale = 'fr';

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`../locales/${locale}/common.json`)).default,
    locale: locale as string,
  };
});
