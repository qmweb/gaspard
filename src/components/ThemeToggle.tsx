'use client';

import { Monitor, Moon, Sun } from 'lucide-react';

import { useTranslation } from '@/utils/hooks/useTranslation';
import { useTheme } from '@/utils/providers/ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className='w-4 h-4' />;
      case 'dark':
        return <Moon className='w-4 h-4' />;
      case 'system':
        return <Monitor className='w-4 h-4' />;
      default:
        return <Sun className='w-4 h-4' />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return t('common.lightMode');
      case 'dark':
        return t('common.darkMode');
      case 'system':
        return t('common.systemMode');
      default:
        return t('common.lightMode');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className='flex items-center gap-2 px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
      title={`${t('common.currentTheme')}: ${getLabel()}`}
    >
      {getIcon()}
      <span className='text-sm'>{getLabel()}</span>
    </button>
  );
}
