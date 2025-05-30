// Mock for next-intl/navigation
import React from 'react';

export const createNavigation = jest.fn(() => ({
  Link: ({ children, href, ...props }) => <a href={href} {...props}>{children}</a>,
  redirect: jest.fn(),
  usePathname: jest.fn(() => '/'),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn()
  })),
  getPathname: jest.fn()
}));

export const Link = ({ children, href, ...props }) => (
  <a href={href} {...props}>
    {children}
  </a>
);

// Add other navigation exports that might be used
export const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn()
}));

export const usePathname = jest.fn(() => '/');
export const getPathname = jest.fn();
export const redirect = jest.fn();
