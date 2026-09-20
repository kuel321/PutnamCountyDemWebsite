import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)
import { redirects } from './redirects'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

const nextConfig: NextConfig = {
  // ✅ Add this
  allowedDevOrigins: [
    'davidedwardsforputnam.chasingachance.com',
    'localhost',
    '192.168.7.237',
  ],

  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        pathname: '/media/**',
      },
    ],
    qualities: [75],
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', '') as 'http' | 'https',
        }
      }),
    ],
  },

  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },

  sassOptions: {
    includePaths: [path.join(dirname, 'node_modules/@payloadcms/ui/dist/scss')],
  },

  reactStrictMode: true,
  redirects,

  // Deliberately not adding a Content-Security-Policy here yet — this app
  // pulls in the Leaflet tile server, the Census/Photon geocoders, Payload
  // admin's own inline styles/scripts, and (once configured) Google
  // reCAPTCHA, and a CSP written blind without testing every page against
  // it risks silently breaking one of those rather than actually being
  // more secure. The headers below are safe regardless of what the page
  // loads.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // SAMEORIGIN (not DENY) — Payload admin's own Live Preview embeds
          // this site's frontend in an iframe from the same origin.
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Browsers only honor this over an actual HTTPS connection, so
          // it's harmless to always send even though nginx (not this app)
          // terminates TLS.
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
        ],
      },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })