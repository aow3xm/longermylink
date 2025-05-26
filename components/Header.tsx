'use client';

import { paths } from '@/config/page';
import { authClient } from '@/lib/auth/client';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User } from 'better-auth';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import dynamic from 'next/dynamic';
import { LocaleSwitcher } from './LocaleSwitcher';
const ThemeSwitcher = dynamic(() => import('@/components/ThemeSwitcher').then(m => m.ThemeSwitcher), { ssr: false, loading: () => <Skeleton className='rounded-none size-14' /> });

export const Header: React.FC = () => {
  const { data, isPending } = authClient.useSession();
  const t = useTranslations('Header')
  const user = data?.user;
  return (
    <header className='sticky w-full border-b h-14 border-border'>
      <div className='flex items-center justify-between max-w-5xl mx-auto overflow-hidden border-x'>
        <Button variant='ghost' asChild className='rounded-none flex items-center justify-center sm:border-r w-[10.5rem] h-14'>
            <Link href={paths.home}>Longmylink</Link>
        </Button>

        <nav className='flex'>
          {isPending && <Skeleton className='rounded-none size-14' />}
          {!isPending && user && <UserAvatar user={user} />}
          {!isPending && !user && (
            <Button
              asChild
              variant='ghost'
              className='rounded-none h-14 w-28 border-l'
            >
              <Link href={paths.auth.login}>{t('login')}</Link>
            </Button>
          )}
          <LocaleSwitcher  className='border-l rounded-none size-14 border-x border-border'/>
          <ThemeSwitcher className='rounded-none size-14' />
        </nav>
      </div>
    </header>
  );
};

type UserAvatarProps = {
  user: User;
};
const UserAvatar: React.FC<UserAvatarProps> = ({ user }) => {
  const t = useTranslations('Header.Popover')
  const router = useRouter()
  const handleSignOut = async () => {
    await authClient.signOut();
    router.push(paths.home)
  }
  return (
    <Popover>
      <PopoverTrigger>
       <div className='flex items-center justify-center border-l size-14'>
         <Avatar className='rounded-full'>
          <AvatarImage src={user.image ?? ''} />
          <AvatarFallback>{user.name.charAt(0).toLocaleUpperCase()}</AvatarFallback>
        </Avatar>
       </div>
      </PopoverTrigger>

      <PopoverContent className='flex flex-col p-0 -mt-1 border-t-0 border-r-0 ml-28 w-42 bg-background rounded-xs'>
        <Button
          variant='ghost'
          asChild
          className='w-full border-b rounded-none h-14'
        >
          <Link href={paths.profile}>{t('profile')}</Link>
        </Button>

        <Button
          onClick={handleSignOut}
          className='w-full text-white rounded-none h-14 bg-destructive hover:bg-destructive/80'
        >
          <LogOut />
          {t('logout')}
        </Button>
      </PopoverContent>
    </Popover>
  );
};
