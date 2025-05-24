import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, 'type'>
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(({ className, ...props }, ref) => {
  const [reveal, setReveal] = useState<boolean>(false);

  const toggleReveal = () => {
    setReveal(!reveal);
  };

  return (
    <div className='relative'>
      <Input
        ref={ref}
        type={reveal ? 'text' : 'password'}
        className={className}
        {...props}
      />
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className='absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent'
        onClick={toggleReveal}
        aria-label={reveal ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
      >
        {reveal ? <EyeOff className='text-muted-foreground' /> : <Eye className='text-muted-foreground' />}
      </Button>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';
