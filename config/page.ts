import localFont from 'next/font/local';

export const paths = {
  home: '/',
  profile: '/profile',
  auth: {
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
  },
};

export const geist = localFont({
  src: [
    {
      path: './fonts/Geist-Regular.ttf',
      weight: '400',
    },
    {
      path: './fonts/Geist-Bold.ttf',
      weight: '700',
    },
  ],
});