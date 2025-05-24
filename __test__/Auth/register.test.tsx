import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from '@/app/[locale]/(auth)/register/page';
import { authClient } from '@/lib/auth/client';
import { fireEvent } from '@testing-library/dom';

// Định nghĩa một mock router để sử dụng trong test
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
};

// Mock cho toast
const mockToast = {
  error: jest.fn(),
  success: jest.fn(),
};

// Mock các dependency của Next.js
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

jest.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
      <a href={href}>{children}</a>
    )
  }
});

jest.mock('@/components/SubmitButton', () => ({
  __esModule: true,
  SubmitButton: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <button type="submit" className={className}>{children}</button>
  ),
}));

jest.mock('@/components/PasswordInput', () => ({
  __esModule: true,
  PasswordInput: React.forwardRef<HTMLInputElement, any>(({ ...props }, ref) => (
    <input ref={ref} type="password" {...props} />
  )),
}));

jest.mock('lucide-react', () => ({
  __esModule: true,
  GithubIcon: () => <span>GithubIcon</span>,
}));

jest.mock('next-intl', () => ({
  __esModule: true,
  useTranslations: () => (key: string) => key,
}));

jest.mock('@/config/page', () => ({
  __esModule: true,
  paths: {
    auth: {
      login: '/login',
    },
  },
}));

jest.mock('@/lib/auth/client', () => ({
  __esModule: true,
  authClient: {
    signIn: {
      social: jest.fn(),
    },
    signUp: {
      email: jest.fn(),
    },
  },
}));

jest.mock('@hookform/resolvers/valibot', () => ({
  __esModule: true,
  valibotResolver: () => (data: any) => ({ values: data, errors: {} }),
}));

jest.mock('sonner', () => ({
  __esModule: true,
  toast: mockToast,
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form inputs and buttons with correct attributes', () => {
    render(<RegisterPage />);

    // Kiểm tra đầu vào email
    const emailInput = screen.getByLabelText('emailLabel');
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('autoComplete', 'email');

    // Kiểm tra đầu vào tên đầy đủ
    const nameInput = screen.getByLabelText('fullNameLabel');
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveAttribute('required');
    expect(nameInput).toHaveAttribute('autoComplete', 'family-name');

    // Kiểm tra đầu vào mật khẩu
    const passwordInput = screen.getByLabelText('passwordLabel');
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('autoComplete', 'new-password');

    // Kiểm tra đầu vào xác nhận mật khẩu
    const confirmPasswordInput = screen.getByLabelText('confirmPasswordLabel');
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('required');
    expect(confirmPasswordInput).toHaveAttribute('autoComplete', 'new-password');

    // Kiểm tra nút đăng ký
    const signUpButton = screen.getByRole('button', { name: 'signUpButton' });
    expect(signUpButton).toBeInTheDocument();
    expect(signUpButton).toHaveAttribute('type', 'submit');

    // Kiểm tra nút đăng ký bằng GitHub
    const githubButton = screen.getByText('signUpWithGithub');
    expect(githubButton).toBeInTheDocument();
    expect(githubButton).toHaveAttribute('type', 'button');
  });

  it('renders navigation links correctly', () => {
    render(<RegisterPage />);

    // Kiểm tra liên kết đăng nhập
    const signInLink = screen.getByText('signIn');
    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute('href', '/login');
  });

  it('submits form with correct data and handles successful registration', async () => {
    (authClient.signUp.email as jest.Mock).mockResolvedValue({
      error: null,
      success: true
    });

    render(<RegisterPage />);
    const user = userEvent.setup();

    // Điền form
    const emailInput = screen.getByPlaceholderText('emailPlaceholder');
    const nameInput = screen.getByPlaceholderText('fullNamePlaceholder');
    const passwordInput = screen.getByPlaceholderText('passwordPlaceholder');
    const confirmPasswordInput = screen.getByPlaceholderText('confirmPasswordPlaceholder');

    await user.type(emailInput, 'test@example.com');
    await user.type(nameInput, 'John Doe');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');

    // Kiểm tra giá trị đã nhập
    expect(emailInput).toHaveValue('test@example.com');
    expect(nameInput).toHaveValue('John Doe');
    expect(passwordInput).toHaveValue('password123');
    expect(confirmPasswordInput).toHaveValue('password123');

    // Submit form
    const submitBtn = screen.getByRole('button', { name: 'signUpButton' });
    await user.click(submitBtn);

    // Kiểm tra API được gọi với đúng dữ liệu
    await waitFor(() => {
      expect(authClient.signUp.email).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'John Doe',
        password: 'password123',
        confirmPassword: 'password123',
      });
    });

    // Kiểm tra toast error không được hiển thị
    expect(mockToast.error).not.toHaveBeenCalled();
  });

  it('handles various error messages from API', async () => {
    // Mảng các loại lỗi để test
    const errors = [
      { message: 'Email already exists' },
      { message: 'Password too weak' },
      { message: 'Passwords do not match' },
      { message: 'Server error' }
    ];

    // Test mỗi loại lỗi
    for (const error of errors) {
      jest.clearAllMocks();
      (authClient.signUp.email as jest.Mock).mockResolvedValue({ error });

      render(<RegisterPage />);
      const user = userEvent.setup();

      // Điền form
      const emailInput = screen.getByPlaceholderText('emailPlaceholder');
      const nameInput = screen.getByPlaceholderText('fullNamePlaceholder');
      const passwordInput = screen.getByPlaceholderText('passwordPlaceholder');
      const confirmPasswordInput = screen.getByPlaceholderText('confirmPasswordPlaceholder');

      await user.type(emailInput, 'test@example.com');
      await user.type(nameInput, 'John Doe');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');

      // Submit form
      const submitBtn = screen.getByRole('button', { name: 'signUpButton' });
      await user.click(submitBtn);

      // Kiểm tra thông báo lỗi đúng
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(error.message);
      });

      // Dọn dẹp cho lần test tiếp theo
      document.body.innerHTML = '';
    }
  });

  it('tests social login functionality thoroughly', async () => {
    // Test đăng ký xã hội thành công
    (authClient.signIn.social as jest.Mock).mockResolvedValue({
      error: null,
      success: true
    });

    render(<RegisterPage />);
    const user = userEvent.setup();

    const githubBtn = screen.getByText('signUpWithGithub');
    expect(githubBtn).toBeInTheDocument();

    // Kiểm tra button có icon GitHub
    const githubIcon = within(githubBtn).getByText('GithubIcon');
    expect(githubIcon).toBeInTheDocument();

    // Click button đăng ký GitHub
    await user.click(githubBtn);

    // Verify API được gọi với provider đúng
    await waitFor(() => {
      expect(authClient.signIn.social).toHaveBeenCalledWith({ provider: 'github' });
    });

    // Kiểm tra toast lỗi không được hiển thị
    expect(mockToast.error).not.toHaveBeenCalled();

    // Dọn dẹp cho test tiếp theo
    document.body.innerHTML = '';
    jest.clearAllMocks();

    // Test đăng ký xã hội thất bại
    const error = { message: 'Social registration failed' };
    (authClient.signIn.social as jest.Mock).mockResolvedValue({ error });

    render(<RegisterPage />);
    const githubBtnError = screen.getByText('signUpWithGithub');
    await user.click(githubBtnError);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Social registration failed');
    });
  });

  it('tests form submission with keyboard input', async () => {
    (authClient.signUp.email as jest.Mock).mockResolvedValue({ error: null });
    render(<RegisterPage />);

    // Lấy các input
    const emailInput = screen.getByLabelText('emailLabel');
    const nameInput = screen.getByLabelText('fullNameLabel');
    const passwordInput = screen.getByLabelText('passwordLabel');
    const confirmPasswordInput = screen.getByLabelText('confirmPasswordLabel');
    const submitButton = screen.getByRole('button', { name: 'signUpButton' });

    // Nhập email, tên, mật khẩu và xác nhận mật khẩu
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password123');

    // Submit form bằng click
    await userEvent.click(submitButton);

    // Xác minh form đã được submit
    await waitFor(() => {
      expect(authClient.signUp.email).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'John Doe',
        password: 'password123',
        confirmPassword: 'password123',
      });
    });
  });

  it('tests form fields appearance and properties', async () => {
    render(<RegisterPage />);

    // Kiểm tra các thuộc tính của email input
    const emailInput = screen.getByLabelText('emailLabel');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('id', 'email');
    expect(emailInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('placeholder', 'emailPlaceholder');

    // Kiểm tra các thuộc tính của name input
    const nameInput = screen.getByLabelText('fullNameLabel');
    expect(nameInput).toHaveAttribute('id', 'name');
    expect(nameInput).toHaveAttribute('required');
    expect(nameInput).toHaveAttribute('placeholder', 'fullNamePlaceholder');

    // Kiểm tra các thuộc tính của password input
    const passwordInput = screen.getByLabelText('passwordLabel');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('id', 'password');
    expect(passwordInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('placeholder', 'passwordPlaceholder');

    // Kiểm tra các thuộc tính của confirmPassword input
    const confirmPasswordInput = screen.getByLabelText('confirmPasswordLabel');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('id', 'confirmPassword');
    expect(confirmPasswordInput).toHaveAttribute('required');
    expect(confirmPasswordInput).toHaveAttribute('placeholder', 'confirmPasswordPlaceholder');

    // Kiểm tra nút đăng ký
    const submitButton = screen.getByRole('button', { name: 'signUpButton' });
    expect(submitButton).toHaveAttribute('type', 'submit');

    // Kiểm tra liên kết đăng nhập
    const signInLink = screen.getByText('signIn');
    expect(signInLink).toHaveAttribute('href', '/login');
  });
});
