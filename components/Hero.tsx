'use client';

import { GenerateLinkData, generateLinkSchema } from '@/lib/schema/personal';
import { generateRandomPath } from '@/utils';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { FormProvider, useForm } from 'react-hook-form';
import { SubmitButton } from './SubmitButton';
import { Input } from './ui/input';
import { useState } from 'react';

export const Hero: React.FC = () => {
  return (
    <div className='relative max-w-5xl h-[calc(100vh-3.5rem)] mx-auto border-x overflow-hidden antialiased flex flex-col items-center justify-center px-2'>
      <GridBackground />

      <div className='relative z-10 w-full p-4 pt-20 mx-auto max-w-7xl md:pt-0'>
        <h1 className='text-4xl font-bold text-center text-black dark:text-transparent dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-neutral-50 dark:to-neutral-400 bg-clip-text md:text-7xl'>
          Make your link <br /> longer in one click
        </h1>
      </div>

      <GenerateLinkForm/>
    </div>
  );
};

const GridBackground: React.FC = () => (
  <div className='absolute inset-0 hidden pointer-events-none select-none dark:block'>
    <svg
      className='w-full h-full'
      xmlns='http://www.w3.org/2000/svg'
    >
      <defs>
        <pattern
          id='grid'
          width='50'
          height='50'
          patternUnits='userSpaceOnUse'
        >
          <path
            d='M 50 0 L 0 0 0 50'
            fill='none'
            stroke='#171717'
            strokeWidth='1'
          />
        </pattern>
      </defs>
      <rect
        width='100%'
        height='100%'
        fill='url(#grid)'
      />
    </svg>
  </div>
);

const GenerateLinkForm: React.FC = () => {
  const method = useForm<GenerateLinkData>({resolver: valibotResolver(generateLinkSchema)});
  const [result, setResult] = useState<string>()
  const { register, setValue, handleSubmit } = method;

  const handleGenerateLink = handleSubmit(async data => {
    const { generateLink } = await import('@/actions/link');
    const { toast } = await import('sonner')
    
    const response = await generateLink(data)
    if(response?.serverError){
      toast.error(response.serverError)
      return;
    }
    if(response?.data){
      setResult(`${process.env.NEXT_PUBLIC_BASE_URL}/l/${response.data.path}`)
    }
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subDomain = generateRandomPath();
    setValue('path', subDomain);
    
    handleGenerateLink();
  };

  return (
    <FormProvider {...method}>
      <form
        onSubmit={onSubmit}
        className='z-50 space-y-2 w-xs sm:w-sm'
      >
        <Input {...register('original')} placeholder='Paste your link here' />
        <input type="hidden" {...register('path')} />
        {result && <Input defaultValue={result}/>}
        <SubmitButton className='w-full'>Make it long</SubmitButton>
      </form>
    </FormProvider>
  );
};
