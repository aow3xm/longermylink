'use client';

import { SubmitButton } from '@/components/SubmitButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ValidationErrorMsg } from '@/components/ValidationMessage';
import { paths } from '@/config/page';
import { Link } from '@/i18n/navigation';
import { ForgotPasswordData, forgotPasswordSchema } from '@/lib/schema/auth';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';
const LoginPage = () => {
  const t = useTranslations('Auth.ForgotPassword')
  const method = useForm<ForgotPasswordData>({
    resolver: valibotResolver(forgotPasswordSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = method;

  const handleFotgotPassword = handleSubmit(async data=>{
    const {toast} = await import('sonner')
    const { authClient } = await import('@/lib/auth/client')
    const {error} = await authClient.forgetPassword({...data, redirectTo: paths.auth.resetPassword})
    if(error){
      toast.error(error.message)
      return
    }
    toast.success(t('toast'))
  })
  return (
    <Card className='w-xs sm:w-sm'>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...method}>
          <form
            onSubmit={handleFotgotPassword}
            className='space-y-4'
          >
            <div className='space-y-2'>
              <Label htmlFor='email'>{t('emailLabel')}</Label>
              <Input
                {...register('email')}
                id='email'
                type='email'
                placeholder={t('emailPlaceholder')}
                required
                autoComplete='email'
              />
              {errors.email?.message && <ValidationErrorMsg msg={errors.email.message} />}
            </div>

            <p className='text-sm'>
                {t('rememberPassword')}{' '}
                <Link href={paths.auth.login}>{t('login')}</Link>
            </p>
            <SubmitButton className='w-full'>{t('resetPasswordButton')}</SubmitButton>

          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
