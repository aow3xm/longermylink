import { AvatarSelect } from '@/components/AvatarSelect';
import { Hero } from '@/components/Hero';
import { useTranslations } from 'next-intl';
export default function HomePage() {
  const t = useTranslations('HomePage');
  return (
    <div>
      <AvatarSelect/>
      <Hero/>
    </div>
  );
}