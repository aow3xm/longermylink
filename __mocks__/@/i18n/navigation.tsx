// Mock for i18n/navigation.ts
import React from 'react';

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  refresh: jest.fn(),
  forward: jest.fn(),
};

const Link = ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: any }) => (
  <a href={href} {...props}>
    {children}
  </a>
);

const redirect = jest.fn();
const usePathname = jest.fn(() => '/');
const useRouter = jest.fn(() => mockRouter);
const getPathname = jest.fn();

export { Link, redirect, usePathname, useRouter, getPathname, mockRouter };
