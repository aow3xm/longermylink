import { LoginForm } from '@/components/auth/LoginForm'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'


export const generateMetadata = async (): Promise<Metadata> =>{
  const t = await getTranslations('Auth.Login.Metadata')
  return {
    title: t('title'),
    description: t('description')
  }
}
const LoginPage = () => {
  return <LoginForm/>
}

export default LoginPage