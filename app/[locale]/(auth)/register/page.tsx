import { RegisterForm } from '@/components/auth/RegisterForm'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'


export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('Auth.Register.Metadata');

  return {
    title: t('title'),
    description: t('description'),
  }
}
const RegisterPage = () => {
  return (
    <RegisterForm/>
  )
}

export default RegisterPage