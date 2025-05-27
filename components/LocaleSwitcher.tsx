'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Button, ButtonProps } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Languages } from 'lucide-react';

const locales = [
  { code: 'en', label: 'English', flag: '🇪🇳' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
];
export const LocaleSwitcher: React.FC<ButtonProps> = ({ ...props }) => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChangeLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          {...props}
        >
          <Languages />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='rounded-none -mt-1 ml-14 shadow-none p-0 w-28 border-t-0 border-r-0 bg-background'>
        <DropdownMenuGroup>
          {locales.map(l => (
            <DropdownMenuItem
              onClick={() => handleChangeLocale(l.code)}
              key={l.code}
              className='rounded-none h-14 not-last:border-b'
            >
              <p className='flex gap-2 justify-center size-full items-center'>
                <span>{l.flag}</span>
                {l.label}
              </p>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
