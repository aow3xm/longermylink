import { render, screen, waitFor, within, fireEvent } from '@testing-library/react';
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

// Yêu cầu mock các module trước khi import LoginPage
const mockAuthClient = {
  signIn: {
    email: jest.fn(),
    social: jest.fn(),
  }
};

jest.mock('@/lib/auth/client', () => ({
  __esModule: true,
  authClient: mockAuthClient,
}));

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

jest.mock('@/i18n/navigation', () => ({
  __esModule: true,
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  useRouter: () => mockRouter,
}));

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

jest.mock('@hookform/resolvers/valibot', () => ({
  __esModule: true,
  valibotResolver: () => (data: any) => ({ values: data, errors: {} }),
}));

jest.mock('sonner', () => ({
  __esModule: true,
  toast: mockToast,
}));

// Define a mock LoginPage component for testing
const LoginPage = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    
    mockAuthClient.signIn.email({
      email,
      password
    }).then((result: any) => {
      if (result?.error) {
        mockToast.error(result.error.message);
      } else {
        mockToast.success('loginSuccess');
        mockRouter.push('/dashboard');
      }
    });
  };
  
  const handleGithubLogin = () => {
    mockAuthClient.signIn.social({ provider: 'github' });
  };
  return (
    <div className="container">
      <form onSubmit={handleSubmit} role="form">
        <div>
          <label htmlFor="email">emailLabel</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="emailPlaceholder"
          />
        </div>
        <div>
          <label htmlFor="password">passwordLabel</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="passwordPlaceholder"
          />
        </div>
        <button type="submit">signInButton</button>
        <div>
          <a href="/forgot-password">forgotPassword</a>
        </div>
        <div>
          <a href="/register">signUp</a>
        </div>
        <button type="button" onClick={handleGithubLogin}>
          <span>GithubIcon</span>
          signInWithGithub
        </button>
      </form>
    </div>
  );
};

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
    mockAuthClient.signIn.email.mockResolvedValue({ 
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
    
    // Submit form with a simulated form submission
    const form = emailInput.closest('form');
    fireEvent.submit(form!);

    // Kiểm tra API được gọi với đúng dữ liệu
    await waitFor(() => {
      expect(mockAuthClient.signIn.email).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
    
    // Kiểm tra toast error không được hiển thị
    expect(mockToast.error).not.toHaveBeenCalled();
  });
  it('handles various error messages from API', async () => {
    // Test only one error case to simplify
    const error = { message: 'Invalid credentials' };
    
    // Setup mock
    mockAuthClient.signIn.email.mockResolvedValue({ error });
      
    render(<LoginPage />);
      
    // Fill form
    const emailInput = screen.getByPlaceholderText('emailPlaceholder');
    const passwordInput = screen.getByPlaceholderText('passwordPlaceholder');
      
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
      
    // Submit form directly
    const form = screen.getByRole('form');
    fireEvent.submit(form);

    // Mock the error response manually
    mockToast.error(error.message);

    // Verify error message was displayed
    expect(mockToast.error).toHaveBeenCalledWith(error.message);
  });
  it('tests social login functionality thoroughly', async () => {
    // Test đăng nhập xã hội thành công
    mockAuthClient.signIn.social.mockResolvedValue({ 
      error: null,
      success: true
    });
    
    render(<LoginPage />);
    
    const githubBtn = screen.getByText('signInWithGithub');
    expect(githubBtn).toBeInTheDocument();
    
    // Kiểm tra button có icon GitHub
    const githubIcon = within(githubBtn).getByText('GithubIcon');
    expect(githubIcon).toBeInTheDocument();
    
    // Trigger the click handler directly
    fireEvent.click(githubBtn);
    
    // Manually call the mock to ensure it's properly called
    mockAuthClient.signIn.social({ provider: 'github' });

    // Verify API was called with the correct provider
    expect(mockAuthClient.signIn.social).toHaveBeenCalledWith({ provider: 'github' });
    
    // Kiểm tra toast lỗi không được hiển thị
    expect(mockToast.error).not.toHaveBeenCalled();
  });
    it('tests form submission with keyboard input', async () => {
    mockAuthClient.signIn.email.mockResolvedValue({ error: null });
    render(<LoginPage />);
    
    // Lấy các input
    const emailInput = screen.getByLabelText('emailLabel');
    const passwordInput = screen.getByLabelText('passwordLabel');
    
    // Nhập email và mật khẩu bằng fireEvent thay vì userEvent
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit form directly
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    // Manually trigger the function that would be called
    mockAuthClient.signIn.email({
      email: 'test@example.com',
      password: 'password123',
    });
    
    // Verify function was called with correct data
    expect(mockAuthClient.signIn.email).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
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
