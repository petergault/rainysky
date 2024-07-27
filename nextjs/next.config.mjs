/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_AZURE_MAPS_CLIENT_ID: process.env.NEXT_PUBLIC_AZURE_MAPS_CLIENT_ID,
    AZURE_MAPS_KEY: process.env.AZURE_MAPS_KEY,
    TOMORROW_IO_API_KEY: process.env.TOMORROW_IO_API_KEY,
  },
};

export default nextConfig;