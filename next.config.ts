import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['mongodb'],
  async rewrites() {
    return [
      { source: '/services/shifting', destination: '/services/movers' },
      { source: '/services/tiffin', destination: '/services/food' },
      { source: '/services/ro-water', destination: '/services/water' },
    ];
  },
};

export default nextConfig;
