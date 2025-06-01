import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from './ThemeProvider';
import { QueryClientProvider } from './QueryClient';

type ProviderWrapperProps = {
  children: React.ReactNode;
};
export const ProviderWrapper: React.FC<ProviderWrapperProps> = ({ children }) => (
  <QueryClientProvider>
    <NextIntlClientProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </NextIntlClientProvider>
  </QueryClientProvider>
);
