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
import { Link, useRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth/client';
import { LoginData, loginSchema } from '@/lib/schema/auth';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { GithubIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';
const LoginPage = () => {
  const t = useTranslations('Auth.Login')
  const router = useRouter()
  const method = useForm<LoginData>({
    resolver: valibotResolver(loginSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = method;

  const signInWithGithub = async () => {
    const { toast } = await import('sonner');
    const { error } = await authClient.signIn.social({
      provider: 'github',
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    router.push(paths.home)
  };

  const handleLogin = handleSubmit(async data => {
    const { toast } = await import('sonner');
    const { error } = await authClient.signIn.email(data);
    if (error) {
      toast.error(error.message);
      return;
    }
    router.push(paths.home)
  });

  return (
    <Card className='w-xs sm:w-sm'>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...method}>
          <form
            onSubmit={handleLogin}
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
              <div className='flex justify-between'>
                <Label htmlFor='password'>{t('passwordLabel')}</Label>
                <Link href={paths.auth.forgotPassword} className='text-sm'>
                 {t('forgotPassword')}
                </Link>
              </div>

              <PasswordInput
                {...register('password')}
                id='password'
                placeholder={t('passwordPlaceholder')}
                required
                autoComplete='current-password'
              />
              {errors.password?.message && <ValidationErrorMsg msg={errors.password.message} />}
            </div>

            <div className='flex gap-1'>
              <p className='text-sm'>{t('noAccount')}</p>
              <Link className='text-sm' href={paths.auth.register}>{t('signUp')}</Link>
            </div>
            
            <>
              <SubmitButton className='w-full'>{t('signInButton')}</SubmitButton>

              <div className="relative">
                <Separator />
                <span className="absolute px-2 text-xs -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 text-muted-foreground bg-card">
                  {t('or')}
                </span>
              </div>
              
              <Button
                type='button'
                className='w-full'
                onClick={signInWithGithub}
              >
                <GithubIcon />
                {t('signInWithGithub')}
              </Button>
            </>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
