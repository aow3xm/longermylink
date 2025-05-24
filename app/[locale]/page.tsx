import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
 
export default function HomePage() {
  const t = useTranslations('HomePage');
  return (
    <div>
      <h1>{t('title')}</h1>
      <Link href="/about">{t('about')}</Link>
      <Button>OK</Button>
      <ThemeSwitcher/>
    </div>
  );
}