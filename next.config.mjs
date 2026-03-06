/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: [ '*.edgeone.cool'],
    },
  },
};

export default nextConfig;
