'use client';

import { paths } from '@/config/page';
import { authClient } from '@/lib/auth/client';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User } from 'better-auth';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';

export const Header: React.FC = () => {
  const { data, isPending } = authClient.useSession();
  const user = data?.user;
  return (
    <header className='sticky w-full border-b h-14 border-border'>
      <div className='flex items-center justify-between max-w-5xl p-2 mx-auto border-x size-full'>
        <div>
          <h1 className='font-bold'>
            <Link href={paths.home}>Longmylink</Link>
          </h1>
        </div>

        <nav className='flex gap-2'>
          {isPending && <Skeleton className='rounded-full size-9' />}
          {!isPending && user && <UserAvatar user={user} />}
          {!isPending && !user && (
            <Button
              asChild
              size='sm'
            >
              <Link href={paths.auth.login}>Login</Link>
            </Button>
          )}
          <ThemeSwitcher />
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
        <Avatar className='p-1 border-1'>
          <AvatarImage src={user.image ?? ''} />
          <AvatarFallback>{user.name.charAt(0).toLocaleUpperCase()}</AvatarFallback>
        </Avatar>
      </PopoverTrigger>

      <PopoverContent className='space-y-2 w-34'>
        <Button asChild size='sm' className='w-full'>
          <Link href={paths.profile}>{t('profile')}</Link>
        </Button>

        <Button onClick={handleSignOut} className='w-full text-white' variant='destructive' size='sm'>
          <LogOut/>
          {t('logout')}
        </Button>
      </PopoverContent>
    </Popover>
  );
};
