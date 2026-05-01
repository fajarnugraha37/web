import type {NextConfig} from 'next';

const isWriteMode = process.env.NEXT_PUBLIC_APP_MODE === 'write';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fajarnugraha37.github.io';
const nodeEnv = process.env.NODE_ENV || 'production';
const disableHmr = process.env.DISABLE_HMR === 'true';
console.log('-------------- Next.js Configuration --------------');
console.log(` App Mode: ${process.env.NEXT_PUBLIC_APP_MODE}`);
console.log(` Base URL: ${baseUrl}`);
console.log(` Node Environment: ${nodeEnv}`);
console.log(` Disable HMR: ${disableHmr}`);
console.log('---------------------------------------------------');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: isWriteMode ? 'standalone' : 'export',
  trailingSlash: true,
  productionBrowserSourceMaps: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: ['motion'],
  headers: async () => [
    {
      // source: '/labs/ffmpeg/:path*',
      source: '/(.*)', // Apply to all routes
      headers: [
        {
          key: 'Cross-Origin-Embedder-Policy',
          value: 'require-corp',
        },
        {
          key: 'Cross-Origin-Opener-Policy',
          value: 'same-origin',
        },
      ],
    },
  ],
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modifyâ€”file watching is disabled to prevent flickering during agent edits.
    if (dev && disableHmr) {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
