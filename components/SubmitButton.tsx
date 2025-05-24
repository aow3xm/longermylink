'use client';

import { Loader } from 'lucide-react';
import { Button } from './ui/button';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';

type SubmitButtonProps = React.ComponentProps<'button'> & {
  children: React.ReactNode;
  loader?: boolean;
};

export const SubmitButton: React.FC<SubmitButtonProps> = ({ children, loader = true, className, ...props }) => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <Button
      {...props}
      className={cn('relative transition-all duration-200 ease-in-out', className)}
      type='submit'
      disabled={isSubmitting}
    >
      {loader ? (
        <div className='flex items-center justify-center w-full gap-2'>
          <div className={cn('transition-all duration-200 flex-shrink-0 overflow-hidden origin-center', isSubmitting ? 'opacity-100 w-4 h-4' : 'opacity-0 w-0 h-0')}>{isSubmitting && <Loader className='animate-spin' />}</div>
          <span className=''>{children}</span>
        </div>
      ) : (
        <>{children}</>
      )}
    </Button>
  );
};
