import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export const generateMetadata = async (): Promise<Metadata> =>{
  const t = await getTranslations('Auth.ForgotPassword.Metadata'); 

  return {
    title: t('title'),
    description: t('description')
  }
}
const ForgotPasswordPage = () => {
  return (
    <ForgotPasswordForm/>
  )
}

export default ForgotPasswordPage