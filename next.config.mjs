/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: [ '*.edgeone.site','*.edgeone.app'],
    },
  },
};

export default nextConfig;
