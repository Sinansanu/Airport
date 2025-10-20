/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // Proxy API calls to FastAPI (strip the /api prefix)
        destination: 'http://localhost:8000/:path*',
      },
    ]
  },
}

export default nextConfig
