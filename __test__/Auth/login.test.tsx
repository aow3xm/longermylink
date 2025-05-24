import LoginPage from '@/app/[locale]/(auth)/login/page';
import { authClient } from '@/lib/auth/client';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

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
      forgotPassword: '/forgot-password',
      register: '/register',
    },
  },
}));

jest.mock('@/lib/auth/client', () => ({
  __esModule: true,
  authClient: {
    signIn: {
      email: jest.fn(),
      social: jest.fn(),
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

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form inputs and buttons with correct attributes', () => {
    render(<LoginPage />);
    
    // Kiểm tra đầu vào email
    const emailInput = screen.getByLabelText('emailLabel');
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('autoComplete', 'email');
      // Kiểm tra đầu vào mật khẩu
    const passwordInput = screen.getByLabelText('passwordLabel');
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('autoComplete', 'current-password');
    
    // Kiểm tra nút đăng nhập
    const signInButton = screen.getByRole('button', { name: 'signInButton' });
    expect(signInButton).toBeInTheDocument();
    expect(signInButton).toHaveAttribute('type', 'submit');
    
    // Kiểm tra nút đăng nhập bằng GitHub
    const githubButton = screen.getByText('signInWithGithub');
    expect(githubButton).toBeInTheDocument();
    expect(githubButton).toHaveAttribute('type', 'button');
  });
  
  it('renders navigation links correctly', () => {
    render(<LoginPage />);
    
    // Kiểm tra liên kết quên mật khẩu
    const forgotPasswordLink = screen.getByText('forgotPassword');
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');
    
    // Kiểm tra liên kết đăng ký
    const signUpLink = screen.getByText('signUp');
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute('href', '/register');
  });

  it('submits form with correct data and handles successful login', async () => {
    (authClient.signIn.email as jest.Mock).mockResolvedValue({ 
      error: null, 
      success: true 
    });
    
    render(<LoginPage />);
    const user = userEvent.setup();
    
    // Điền form
    const emailInput = screen.getByPlaceholderText('emailPlaceholder');
    const passwordInput = screen.getByPlaceholderText('passwordPlaceholder');
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    // Kiểm tra giá trị đã nhập
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
    
    // Submit form
    const submitBtn = screen.getByRole('button', { name: 'signInButton' });
    await user.click(submitBtn);

    // Kiểm tra API được gọi với đúng dữ liệu
    await waitFor(() => {
      expect(authClient.signIn.email).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
    
    // Kiểm tra toast error không được hiển thị
    expect(mockToast.error).not.toHaveBeenCalled();
  });

  it('handles various error messages from API', async () => {
    // Mảng các loại lỗi để test
    const errors = [
      { message: 'Invalid credentials' },
      { message: 'Account locked' },
      { message: 'Too many attempts' },
      { message: 'Server error' }
    ];
    
    // Test mỗi loại lỗi
    for (const error of errors) {
      jest.clearAllMocks();
      (authClient.signIn.email as jest.Mock).mockResolvedValue({ error });
      
      render(<LoginPage />);
      const user = userEvent.setup();
      
      // Điền form
      const emailInput = screen.getByPlaceholderText('emailPlaceholder');
      const passwordInput = screen.getByPlaceholderText('passwordPlaceholder');
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpass');
      
      // Submit form
      const submitBtn = screen.getByRole('button', { name: 'signInButton' });
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
    // Test đăng nhập xã hội thành công
    (authClient.signIn.social as jest.Mock).mockResolvedValue({ 
      error: null,
      success: true
    });
    
    render(<LoginPage />);
    const user = userEvent.setup();
    
    const githubBtn = screen.getByText('signInWithGithub');
    expect(githubBtn).toBeInTheDocument();
    
    // Kiểm tra button có icon GitHub
    const githubIcon = within(githubBtn).getByText('GithubIcon');
    expect(githubIcon).toBeInTheDocument();
    
    // Click button đăng nhập GitHub
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
    
    // Test đăng nhập xã hội thất bại
    const error = { message: 'Social login failed' };
    (authClient.signIn.social as jest.Mock).mockResolvedValue({ error });
    
    render(<LoginPage />);
    const githubBtnError = screen.getByText('signInWithGithub');
    await user.click(githubBtnError);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Social login failed');
    });
  });
  
  it('tests form submission with keyboard input', async () => {
    (authClient.signIn.email as jest.Mock).mockResolvedValue({ error: null });
    render(<LoginPage />);
    
    // Lấy các input
    const emailInput = screen.getByLabelText('emailLabel');
    const passwordInput = screen.getByLabelText('passwordLabel');
    const submitButton = screen.getByRole('button', { name: 'signInButton' });
    
    // Nhập email và mật khẩu
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    
    // Submit form bằng click
    await userEvent.click(submitButton);
    
    // Xác minh form đã được submit
    await waitFor(() => {
      expect(authClient.signIn.email).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
  
  it('tests form fields appearance and properties', async () => {
    render(<LoginPage />);
    
    // Kiểm tra các thuộc tính của email input
    const emailInput = screen.getByLabelText('emailLabel');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('id', 'email');
    expect(emailInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('placeholder', 'emailPlaceholder');
    
    // Kiểm tra các thuộc tính của password input
    const passwordInput = screen.getByLabelText('passwordLabel');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('id', 'password');
    expect(passwordInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('placeholder', 'passwordPlaceholder');
    
    // Kiểm tra nút đăng nhập
    const submitButton = screen.getByRole('button', { name: 'signInButton' });
    expect(submitButton).toHaveAttribute('type', 'submit');
    
    // Kiểm tra liên kết quên mật khẩu
    const forgotPasswordLink = screen.getByText('forgotPassword');
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');
    
    // Kiểm tra liên kết đăng ký
    const signUpLink = screen.getByText('signUp');
    expect(signUpLink).toHaveAttribute('href', '/register');
  });
});
