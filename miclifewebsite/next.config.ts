import type { NextConfig } from "next";

// Helper function to extract hostname from URL
function getHostnameFromUrl(url?: string): string {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
}

const nextConfig: NextConfig = {
  // Remove X-Powered-By header for security
  poweredByHeader: false,

  // Compress responses
  compress: true,

  // Enable React strict mode for better development
  reactStrictMode: true,

  // Security headers
  async headers() {
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const imageUrl = process.env.NEXT_PUBLIC_BASE_IMAGE_URL || '';
    
    return [
      {
        source: '/:path*',
        headers: [
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Note: Remove unsafe-* in production for better security
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              `connect-src 'self' ${apiUrl} ${imageUrl} http://localhost:* ws://localhost:*`, // Allow API calls
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Force HTTPS
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Referrer policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // XSS Protection (deprecated but still useful for older browsers)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      // Cache static assets
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache images
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: getHostnameFromUrl(process.env.NEXT_PUBLIC_BASE_IMAGE_URL),
      },
      {
        protocol: 'https',
        hostname: '**.mic.org', // Allow all subdomains
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Trailing slash
  trailingSlash: false,

  // Output configuration - Using standalone to support both SSG and dynamic routes
  // If you want a fully static export (no server needed), change to 'export'
  // However, 'export' doesn't support dynamic routes without generateStaticParams
  output: 'export',

  // Optimize builds
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },

  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@heroicons/react', 'react-icons'],
  },

  // Skip static optimization for pages that use Redux
  // This prevents Next.js from trying to prerender components from src/pages
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // Exclude src/pages from route discovery
  // Since we're using App Router, src/pages should not be treated as routes
  typescript: {
    ignoreBuildErrors: false,
  },
};
module.exports = nextConfig
export default nextConfig;
