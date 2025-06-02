'use client';

import { PasswordInput } from '@/components/PasswordInput';
import { SubmitButton } from '@/components/SubmitButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ValidationErrorMsg } from '@/components/ValidationMessage';
import { paths } from '@/config/page';
import { Link } from '@/i18n/navigation';
import { RegisterData, registerSchema } from '@/lib/schema/auth';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { GithubIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';

export const RegisterForm = () => {
  const t = useTranslations('Auth.Register');
  const method = useForm<RegisterData>({
    resolver: valibotResolver(registerSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = method;

  const signUpWithGithub = async () => {
    const { toast } = await import('sonner');
    const { authClient } = await import('@/lib/auth/client')
    const { error } = await authClient.signIn.social({
      provider: 'github',
    });
    if (error) {
      toast.error(error.message);
      return;
    }
  };

  const handleRegister = handleSubmit(async data => {
    const { toast } = await import('sonner');
    const { authClient } = await import('@/lib/auth/client')
    const { error } = await authClient.signUp.email(data);
    if (error) {
      toast.error(error.message);
      return;
    }
  });

  return (
    <Card className='w-xs lg:w-sm'>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...method}>
          <form
            onSubmit={handleRegister}
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

            <div className='space-y-2'>
              <Label htmlFor='name'>{t('fullNameLabel')}</Label>
              <Input
                {...register('name')}
                id='name'
                placeholder={t('fullNamePlaceholder')}
                required
                autoComplete='family-name'
              />
              {errors.name?.message && <ValidationErrorMsg msg={errors.name.message} />}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>{t('passwordLabel')}</Label>
              <PasswordInput
                {...register('password')}
                id='password'
                placeholder={t('passwordPlaceholder')}
                required
                autoComplete='new-password'
              />
              {errors.password?.message && <ValidationErrorMsg msg={errors.password.message} />}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>{t('confirmPasswordLabel')}</Label>
              <PasswordInput
                {...register('confirmPassword')}
                id='confirmPassword'
                placeholder={t('confirmPasswordPlaceholder')}
                required
                autoComplete='new-password'
              />
              {errors.confirmPassword?.message && <ValidationErrorMsg msg={errors.confirmPassword.message} />}
            </div>

            <div className='flex gap-1'>
              <p className='text-sm'>{t('hasAccount')}</p>
              <Link
                className='text-sm'
                href={paths.auth.login}
              >
                {t('signIn')}
              </Link>
            </div>

            <>
              <SubmitButton className='w-full'>{t('signUpButton')}</SubmitButton>

              <div className='relative'>
                <Separator />
                <span className='absolute px-2 text-xs -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 text-muted-foreground bg-card'>{t('or')}</span>
              </div>

              <Button
                type='button'
                className='w-full'
                onClick={signUpWithGithub}
              >
                <GithubIcon />
                {t('signUpWithGithub')}
              </Button>
            </>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};