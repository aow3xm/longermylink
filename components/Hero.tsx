'use client';

import { GenerateLinkData, generateLinkSchema } from '@/lib/schema/personal';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ShowResult } from './ShowResult';
import { SubmitButton } from './SubmitButton';
import { Input } from './ui/input';
import { ValidationErrorMsg } from './ValidationMessage';

export const Hero: React.FC = () => {
  return (
    <div className='relative max-w-5xl h-[calc(100vh-3.5rem)] mx-auto border-x overflow-hidden antialiased flex flex-col items-center justify-center px-2'>
      <GridBackground />

      <div className='relative z-10 w-full p-4 pt-20 mx-auto max-w-7xl md:pt-0'>
        <h1 className='text-4xl font-bold text-center text-black dark:text-transparent dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-neutral-50 dark:to-neutral-400 bg-clip-text md:text-7xl'>
          Short links are
          <br /> overrated <br /> Go long!
        </h1>
      </div>

      <GenerateLinkForm />
    </div>
  );
};

const GridBackground: React.FC = () => (
  <div className='absolute inset-0 hidden pointer-events-none select-none dark:block'>
    <svg
      className='w-full h-full'
      xmlns='http://www.w3.org/2000/svg'
      width='100%'
      height='100%'
      preserveAspectRatio='none'
    >
      <pattern
        id='grid'
        width='14'
        height='14'
        patternUnits='userSpaceOnUse'
        x='-1'
        y='-1'
      >
        <path
          d='M 14 0 L 0 0 0 14'
          fill='none'
          stroke='#171717'
          strokeWidth='1'
          vectorEffect='non-scaling-stroke'
        />
      </pattern>
      <rect
        width='100%'
        height='100%'
        fill='url(#grid)'
      />
    </svg>
  </div>
);

//========================================================/
const PREFIX = ['https://', 'http://'];
const GenerateLinkForm: React.FC = () => {
  const method = useForm<GenerateLinkData>({ resolver: valibotResolver(generateLinkSchema) });
  const [result, setResult] = useState<string | null>();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = method;

  const handleGenerateLink = handleSubmit(async data => {
    setResult(null);

    const isStartWithPrefix = PREFIX.some(prefix => data.original.startsWith(prefix));
    if (!isStartWithPrefix) {
      data.original = `${PREFIX[0]}${data.original}`;
    }

    const { generateLink } = await import('@/actions/link');
    const { toast } = await import('sonner');

    const response = await generateLink(data);
    if (response?.serverError) {
      toast.error(response.serverError);
      return;
    }
    if (response?.data) {
      setResult(`${process.env.NEXT_PUBLIC_BASE_URL}/l/${response.data.path}`);
      reset();
    }
  });

  return (
    <FormProvider {...method}>
      <form
        onSubmit={handleGenerateLink}
        className='z-50 space-y-2 w-xs sm:w-sm'
      >
        <Input
          {...register('original')}
          placeholder='Paste your link here'
          required
        />
        {errors.original?.message && <ValidationErrorMsg msg={errors.original.message} />}

        {result && <ShowResult result={result} />}
        <SubmitButton className='w-full'>Make it long</SubmitButton>
      </form>
    </FormProvider>
  );
};
