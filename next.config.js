/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-popover',
      '@radix-ui/react-dialog'
    ]
  }
}

module.exports = nextConfig



