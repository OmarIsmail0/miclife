import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiter (use Redis in production for distributed systems)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Max requests per interval
}

const configs: Record<string, RateLimitConfig> = {
  '/api/ticketmanagement/': { interval: 60 * 60 * 1000, maxRequests: 5 }, // 5 per hour
  '/api/ContentManage/': { interval: 60 * 1000, maxRequests: 100 }, // 100 per minute
  default: { interval: 60 * 1000, maxRequests: 60 }, // 60 per minute
};

function getRateLimitConfig(pathname: string): RateLimitConfig {
  for (const [path, config] of Object.entries(configs)) {
    if (pathname.startsWith(path)) {
      return config;
    }
  }
  return configs.default;
}

function getRateLimitKey(request: NextRequest): string {
  // Use IP address as identifier
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  return `${ip}:${request.nextUrl.pathname}`;
}

export function proxy(request: NextRequest) {
  // Apply rate limiting to API routes only
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const key = getRateLimitKey(request);
    const config = getRateLimitConfig(request.nextUrl.pathname);
    const now = Date.now();

    // Get or create rate limit entry
    let limitData = rateLimitMap.get(key);

    if (!limitData || now > limitData.resetTime) {
      // Create new or reset expired entry
      limitData = {
        count: 1,
        resetTime: now + config.interval,
      };
      rateLimitMap.set(key, limitData);
    } else {
      limitData.count++;
    }

    // Check if limit exceeded
    if (limitData.count > config.maxRequests) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((limitData.resetTime - now) / 1000)),
            'X-RateLimit-Limit': String(config.maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(limitData.resetTime),
          },
        }
      );
    }

    // Add rate limit headers to response
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', String(config.maxRequests));
    response.headers.set('X-RateLimit-Remaining', String(config.maxRequests - limitData.count));
    response.headers.set('X-RateLimit-Reset', String(limitData.resetTime));
    
    return response;
  }

  // Add security headers to all responses
  const response = NextResponse.next();
  
  // Remove server information
  response.headers.delete('x-powered-by');
  response.headers.delete('server');

  return response;
}

// Clean up expired entries periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, data] of rateLimitMap.entries()) {
      if (now > data.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 60 * 1000); // Clean up every minute
}

export const config = {
  matcher: [
    // Only apply to internal API routes, not external requests
    '/api/:path*',
  ],
};

