import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/app/[locale]/(auth)/login/page';
import { authClient } from '@/lib/auth/client';

// Mock các dependency của Next.js
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

jest.mock('@/components/SubmitButton', () => ({
  SubmitButton: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <button type="submit" className={className}>{children}</button>
  ),
}));

jest.mock('lucide-react', () => ({
  GithubIcon: () => <span>GithubIcon</span>,
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('@/config/page', () => ({
  paths: {
    auth: {
      forgotPassword: '/forgot-password',
      register: '/register',
    },
  },
}));

jest.mock('@/lib/auth/client', () => ({
  authClient: {
    signIn: {
      email: jest.fn(),
      social: jest.fn(),
    },
  },
}));

jest.mock('@hookform/resolvers/valibot', () => ({
  valibotResolver: () => (data: any) => ({ values: data, errors: {} }),
}));

jest.mock('sonner', () => ({
  __esModule: true,
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form inputs and buttons', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText('emailLabel')).toBeInTheDocument();
    expect(screen.getByLabelText('passwordLabel')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'signInButton' })).toBeInTheDocument();
    expect(screen.getByText('signInWithGithub')).toBeInTheDocument();
  });

  it('calls authClient.signIn.email on form submit', async () => {
    (authClient.signIn.email as jest.Mock).mockResolvedValue({ error: null });
    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText('emailPlaceholder');
    const passwordInput = screen.getByPlaceholderText('passwordPlaceholder');
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    
    const submitBtn = screen.getByRole('button', { name: 'signInButton' });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(authClient.signIn.email).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('shows error toast when authClient.signIn.email returns error', async () => {
    const error = { message: 'Invalid credentials' };
    (authClient.signIn.email as jest.Mock).mockResolvedValue({ error });
    
    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText('emailPlaceholder');
    const passwordInput = screen.getByPlaceholderText('passwordPlaceholder');
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'wrongpass');
    
    const submitBtn = screen.getByRole('button', { name: 'signInButton' });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      const { toast } = require('sonner');
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  it('calls authClient.signIn.social on GitHub button click', async () => {
    (authClient.signIn.social as jest.Mock).mockResolvedValue({ error: null });
    
    render(<LoginPage />);
    const githubBtn = screen.getByText('signInWithGithub');
    await userEvent.click(githubBtn);

    await waitFor(() => {
      expect(authClient.signIn.social).toHaveBeenCalledWith({ provider: 'github' });
    });
  });

  it('shows error toast when authClient.signIn.social returns error', async () => {
    const error = { message: 'Social login failed' };
    (authClient.signIn.social as jest.Mock).mockResolvedValue({ error });
    
    render(<LoginPage />);
    const githubBtn = screen.getByText('signInWithGithub');
    await userEvent.click(githubBtn);

    await waitFor(() => {
      const { toast } = require('sonner');
      expect(toast.error).toHaveBeenCalledWith('Social login failed');
    });
  });
});
