'use client';

import { GenerateLinkData, generateLinkSchema } from '@/lib/schema/personal';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { SubmitButton } from '../SubmitButton';
import { Input } from '../ui/input';
import { ValidationErrorMsg } from '../ValidationMessage';
import { useTranslations } from 'next-intl';
import { ShowResult } from './ShowResult';
export const Hero: React.FC = () => {
  const t = useTranslations('HomePage.Hero')
  return (
    <div className='relative max-w-5xl h-[calc(100vh-3.5rem)] mx-auto border-x overflow-hidden antialiased flex flex-col items-center justify-center px-2'>
      <GridBackground />

      <div className='relative z-10 w-full p-4 pt-20 mx-auto max-w-7xl md:pt-0'>
        <h1 className='block max-w-3xl mx-auto text-3xl font-bold text-center text-black md:text-5xl dark:text-white lg:text-6xl xl:text-7xl'>
          {/* Short links are
          <br /> overrated <br /> Go long! */}
          {t.rich('heading', {
            br: () => <br />,
            del: (chunks) => <span className="text-white line-through">{chunks}</span>
          })}
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
  const t = useTranslations('HomePage.Hero')
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
          placeholder={t('linkPlaceholder')}
          required
        />
        {errors.original?.message && <ValidationErrorMsg msg={errors.original.message} />}

        {result && <ShowResult result={result} />}
        <SubmitButton className='w-full'>{t('submit')}</SubmitButton>
      </form>
    </FormProvider>
  );
};
