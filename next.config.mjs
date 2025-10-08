import nextMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import rehypePrism from '@mapbox/rehype-prism'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx'],
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Deaktiviere ESLint während Development
    ignoreDuringBuilds: true,
  },
  experimental: {
    newNextLinkBehavior: true,
    scrollRestoration: true,
  },
  webpack: (config, { isServer }) => {
    // Exclude server-only modules from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        dns: false,
        tls: false,
        fs: false,
        redis: false,
        pg: false,
        'pg-native': false
      };
    }
    return config;
  },
  async redirects() {
    return [
      // Redirects entfernt - / zeigt jetzt direkt auf index.jsx
    ]
  },
}

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrism],
  },
})

export default withMDX(nextConfig)
