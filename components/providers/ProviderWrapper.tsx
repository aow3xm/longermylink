import { NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from './ThemeProvider'

type ProviderWrapperProps = {
    children: React.ReactNode
}
export const ProviderWrapper: React.FC<ProviderWrapperProps> = ({ children }) => (
    <NextIntlClientProvider>
        <ThemeProvider>
            {children}
        </ThemeProvider>
    </NextIntlClientProvider>
)

