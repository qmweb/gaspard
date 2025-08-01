import { User } from 'lucide-react';

import { useTranslation } from '@/hooks/useTranslation';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from '@/utils/lib/better-auth/auth-client';
import { useTheme } from '@/utils/providers/ThemeProvider';

export default function AccountPage() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const user = session?.user;
  const userName = user?.name || '';

  const { currentLanguage, setLanguage, translations, isLoading } =
    useLanguage();

  const { setTheme } = useTheme();

  return (
    <section className='flex flex-col gap-4 p-4'>
      <h2 className='flex items-center gap-2 text-xl font-semibold text-neutral-800 dark:text-neutral-50'>
        <User size={22} /> {t('navigation.account')}
      </h2>
      <h1 className='text-2xl font-bold text-neutral-800 dark:text-neutral-50'>
        Paramètres du compte de {userName}
      </h1>
      <div className='flex flex-row gap-4'>
        <div className='rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 flex flex-col gap-2 w-1/3'>
          <p className='text-neutral-600 dark:text-neutral-400'>
            Paramètres de langue
          </p>
          <Select value={currentLanguage} onValueChange={setLanguage}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder={t('common.selectLanguage')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='en'>English</SelectItem>
                <SelectItem value='es'>Español</SelectItem>
                <SelectItem value='fr'>Français</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className='rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 flex flex-col gap-2 w-1/3'>
          <p className='text-neutral-600 dark:text-neutral-400'>
            Paramètres de thème
          </p>
          <Select onValueChange={setTheme}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder={t('common.selectTheme')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='light'>{t('common.lightMode')}</SelectItem>
                <SelectItem value='dark'>{t('common.darkMode')}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
