'use client'

import { QueryClient, QueryClientProvider as QueryProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

type QueryClientProviderProps = {
  children: React.ReactNode;
};
export const QueryClientProvider: React.FC<QueryClientProviderProps> = ({ children }) => <QueryProvider client={queryClient}>{children}</QueryProvider>;
