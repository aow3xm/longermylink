'use client';

import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { MoonIcon, SunIcon } from 'lucide-react';

type ThemeSwitcherProps = React.ComponentProps<'button'>;
export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className, ...props }) => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      {...props}
      className={className}
      variant='ghost'
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
};
