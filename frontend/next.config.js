const nextConfig = {
  images: {
    domains: ['localhost', 'api.yourdomain.com', 'pravatar.cc'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  reactStrictMode: true,
}

module.exports = nextConfig
