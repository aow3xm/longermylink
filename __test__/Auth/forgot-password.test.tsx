// __test__/Auth/forgot-password.test.tsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Use jest.mock instead of jest.doMock for consistent mocking
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock('@/i18n/navigation', () => ({
  __esModule: true,
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.doMock('@/components/SubmitButton', () => ({
  __esModule: true,
  SubmitButton: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <button type="submit" className={className}>{children}</button>
  ),
}));

jest.doMock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'Auth.forgotPassword.emailLabel': 'Email',
      'Auth.forgotPassword.resetPasswordButton': 'Reset Password',
      'Auth.forgotPassword.login': 'Login',
      'Auth.forgotPassword.successToast': 'Reset instructions sent',
      'toast': 'Reset instructions sent',
    };
    return translations[key] || key;
  },
}));

jest.doMock('@/config/page', () => ({
  __esModule: true,
  paths: {
    auth: {
      login: '/login',
      resetPassword: '/reset-password',
    },
  },
}));

// Mock toast object
const mockToast = {
  error: jest.fn(),
  success: jest.fn(),
};

jest.doMock('sonner', () => ({
  __esModule: true,
  toast: mockToast,
}));

// Mock auth client
const mockForgetPassword = jest.fn();

jest.doMock('@/lib/auth/client', () => ({
  __esModule: true,
  authClient: {
    forgetPassword: mockForgetPassword,
  },
}));

jest.doMock('@hookform/resolvers/valibot', () => ({
  __esModule: true,
  valibotResolver: () => (data: any) => ({ values: data, errors: {} }),
}));

// Import ForgotPasswordPage after all mocks are set up
const ForgotPasswordPage = require('@/app/[locale]/(auth)/forgot-password/page').default;

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form inputs and button with correct attributes', () => {
    render(<ForgotPasswordPage />);
    
    const emailInput = screen.getByLabelText('emailLabel');
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('autoComplete', 'email');
    
    const submitButton = screen.getByRole('button', { name: 'resetPasswordButton' });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('renders navigation link to login correctly', () => {
    render(<ForgotPasswordPage />);

    const loginLink = screen.getByText((content, element) => {
        return element?.tagName === 'A' && content === 'login';
    });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('submits form with correct email and handles successful request', async () => {
    mockForgetPassword.mockResolvedValue({ error: null });

    render(<ForgotPasswordPage />);
    const user = userEvent.setup();

    const emailInput = screen.getByPlaceholderText('emailPlaceholder');
    await user.type(emailInput, 'test@example.com');
    expect(emailInput).toHaveValue('test@example.com');

    const submitButton = screen.getByRole('button', { name: 'resetPasswordButton' });
    await user.click(submitButton);

    await waitFor(() => {
        expect(mockForgetPassword).toHaveBeenCalledWith({
            email: 'test@example.com',
            redirectTo: '/reset-password',
        });
    });

    await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith('Reset instructions sent');
    });
    expect(mockToast.error).not.toHaveBeenCalled();
  });

  it('shows error toast if API returns an error', async () => {
    const errorMessage = 'User not found';
    mockForgetPassword.mockResolvedValue({ error: { message: errorMessage } });
    
    render(<ForgotPasswordPage />);
    const user = userEvent.setup();
    
    const emailInput = screen.getByPlaceholderText('emailPlaceholder');
    await user.type(emailInput, 'nonexistent@example.com');
    
    const submitButton = screen.getByRole('button', { name: 'resetPasswordButton' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockForgetPassword).toHaveBeenCalledWith({
        email: 'nonexistent@example.com',
        redirectTo: '/reset-password',
      });
    });
    
    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(errorMessage);
    });
    expect(mockToast.success).not.toHaveBeenCalled();
  });
});
