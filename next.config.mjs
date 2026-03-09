/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: [ '*.edgeone.site','*.edgeone.app','*.edgeone.cool'],
    },
  },
};

export default nextConfig;
