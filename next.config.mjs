/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['zaporka-backend.onrender.com'],
  },
  serverExternalPackages: [], // <--- сюда перенесено
};

export default nextConfig;
