import { AvatarSelect } from '@/components/AvatarSelect';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
 
export default function HomePage() {
  const t = useTranslations('HomePage');
  return (
    <div>
      <h1>{t('title')}</h1>
      <Link href="/about">{t('about')}</Link>
      <ThemeSwitcher/>
      <AvatarSelect/>
    </div>
  );
}