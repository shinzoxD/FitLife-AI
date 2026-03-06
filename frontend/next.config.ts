import type { NextConfig } from 'next';

const publicApiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
const internalApiHostport = process.env.INTERNAL_API_HOSTPORT?.trim();
const internalApiUrl = internalApiHostport ? `http://${internalApiHostport}` : '';
const backendUrl = publicApiUrl || internalApiUrl || 'http://localhost:5000';

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    if (publicApiUrl) {
      return [];
    }
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
