// Mock for next/navigation
export const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn()
}));

export const useSearchParams = jest.fn(() => ({
  get: jest.fn((key) => {
    if (key === 'token') return 'valid-token';
    return null;
  })
}));

export const useParams = jest.fn(() => ({}));
export const redirect = jest.fn();
export const notFound = jest.fn();
