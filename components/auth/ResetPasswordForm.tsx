'use client';

import { PasswordInput } from '@/components/PasswordInput';
import { SubmitButton } from '@/components/SubmitButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ValidationErrorMsg } from '@/components/ValidationMessage';
import { paths } from '@/config/page';
import { useRouter } from '@/i18n/navigation';
import { ResetPasswordData, resetPasswordSchema } from '@/lib/schema/auth';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';

export const ResetPasswordForm: React.FC = () => {
  const t = useTranslations('Auth.ResetPassword');
  const router = useRouter()
  const token = useSearchParams().get('token');
  const method = useForm<ResetPasswordData>({ resolver: valibotResolver(resetPasswordSchema), defaultValues: {token: token ?? ''} });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = method;

  if (!token) return <InvalidToken />;

  const handleResetPassword = handleSubmit(async data => {
    const { toast } = await import('sonner');
    const { authClient } = await import('@/lib/auth/client');
    const { error } = await authClient.resetPassword(data);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(t('toast'));
    router.push(paths.auth.login)
  });

  return (
    <Card className='w-xs lg:w-sm'>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>

      <CardContent>
        <FormProvider {...method}>

          <form className='space-y-4' onSubmit={handleResetPassword}>
            <div className='space-y-2'>
              <Label htmlFor='newPassword'>{t('newPasswordLabel')}</Label>
              <PasswordInput
                {...register('newPassword')}
                id='newPassword'
                placeholder={t('newPasswordPlaceholder')}
              />
              {errors.newPassword?.message && <ValidationErrorMsg msg={errors.newPassword.message} />}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>{t('confirmPasswordLabel')}</Label>
              <PasswordInput
                {...register('confirmPassword')}
                id='confirmPassword'
                placeholder={t('confirmPasswordPlaceholder')}
              />
              {errors.confirmPassword?.message && <ValidationErrorMsg msg={errors.confirmPassword.message} />}
            </div>

            <SubmitButton className='w-full'>{t('resetPasswordButton')}</SubmitButton>
          </form>

        </FormProvider>
      </CardContent>
    </Card>
  );
};

const InvalidToken: React.FC = () => {
  const t = useTranslations('Auth.ResetPassword');
  return (
    <div className='border w-xs sm:w-sm rounded-lg p-5'>
      <p className='text-destructive'>{t('invalidToken')}</p>
    </div>
  );
};