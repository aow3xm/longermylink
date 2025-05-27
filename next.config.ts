import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {};
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(withBundleAnalyzer(withNextIntl(nextConfig)));
