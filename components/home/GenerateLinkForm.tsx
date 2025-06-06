'use client';

import { paths } from '@/config/page';
import { GenerateLinkData, generateLinkSchema } from '@/lib/schema/personal';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { SubmitButton } from '../SubmitButton';
import { Input } from '../ui/input';
import { ValidationErrorMsg } from '../ValidationMessage';
import { ShowResult } from './ShowResult';

const PREFIX = ['https://', 'http://'];
export const GenerateLinkForm: React.FC = () => {
  const t = useTranslations('HomePage.Hero');
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
      setResult(`${process.env.NEXT_PUBLIC_BASE_URL}${paths.l}/${response.data.path}`);
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
