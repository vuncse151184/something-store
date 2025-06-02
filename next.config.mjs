import createNextIntlPlugin from 'next-intl/plugin';
import createBundleAnalyzer from '@next/bundle-analyzer';

const withNextIntl = createNextIntlPlugin();

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withNextIntl(
  withBundleAnalyzer(nextConfig)
);