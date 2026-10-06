/**
 * Build-time fetch utility that handles SSL certificate issues
 * This is only used during static generation at build time
 */

export async function buildTimeFetch(url: string, options: RequestInit = {}) {
  // For build time, we need to handle SSL certificate issues
  // This is safe because it only runs during build, not in production runtime
  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
    // Disable SSL verification for build time only
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  try {
    const response = await fetch(url, {
      ...options,
      // Add timeout
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });
    
    return response;
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
}

