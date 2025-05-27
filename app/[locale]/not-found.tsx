import { paths } from '@/config/page';
import Image from 'next/image';
import Cat from '@/public/assets/not-found.webp';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
const NotFound: React.FC = () => {
  const t = useTranslations('NotFound');
  return (
    <section className='max-w-5xl mx-auto h-[calc(100vh-3.5rem)] border-x flex flex-col items-center justify-center'>
      <Image
        src={Cat}
        alt='not found'
        width={500}
        height={500}
      />
      <h1 className='text-xl sm:text-3xl font-bold'>{t('title')}</h1>

      <Link
        href={paths.home}
        className='text-muted-foreground'
      >
        ← {t('back')}
      </Link>
    </section>
  );
};
export default NotFound;
