'use client';

import { useLanguage } from '@/contexts/LanguageContext';

const languages = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
] as const;

export function LanguageSwitcher() {
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <div className='flex items-center gap-2'>
      <select
        value={currentLanguage}
        onChange={(e) => setLanguage(e.target.value as 'fr' | 'en' | 'es')}
        className='px-3 py-1 rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
