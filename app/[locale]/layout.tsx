import { ProviderWrapper } from '@/components/providers/ProviderWrapper';
import { Toaster } from "@/components/ui/sonner"
import { geist } from '@/config/page';
import { routing } from '@/i18n/routing';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import type { Metadata } from 'next';
import '@/config/globals.css';
import { getTranslations } from 'next-intl/server';

export const generateMetadata = async (): Promise<Metadata> =>{
  const t = await getTranslations('HomePage.Metadata')
  return {
    title: {
      default: t('title'),
      template: `%s | ${t('title')}`,
    },
    description: t('description')
  }
}

type RootLayoutProps = {
  params: Promise<{ locale: string }>,
  children: React.ReactNode,
};
const RootLayout: React.FC<RootLayoutProps> = async ({ params, children }) => {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      suppressHydrationWarning
    >
      <body className={geist.className}>
        <ProviderWrapper>
          <Header/>
          <main>
            <Toaster position='top-right'/>
            {children}
          </main>
          <Footer/>
        </ProviderWrapper>
      </body>
    </html>
  );
}

export default RootLayout