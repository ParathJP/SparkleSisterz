/** @type {import('next').NextConfig} */

// Product images come from Cloudinary in production, and from the backend's
// /uploads folder in local development. Derive the backend host from the API URL
// so a new deployment doesn't need this file edited.
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function backendPattern() {
  try {
    const { protocol, hostname, port } = new URL(apiUrl);
    return [
      {
        protocol: protocol.replace(':', ''),
        hostname,
        ...(port ? { port } : {}),
        pathname: '/uploads/**',
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      ...backendPattern(),
    ],
  },
};

export default nextConfig;
