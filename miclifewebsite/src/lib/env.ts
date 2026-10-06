import { z } from 'zod';

const envSchema = z.object({
  // Public variables (accessible in browser)
  NEXT_PUBLIC_BASE_URL: z.string().url().min(1),
  NEXT_PUBLIC_BASE_IMAGE_URL: z.string().url().min(1),
  
  // Server-only variables
  BASE_URL: z.string().url().optional(),
  MOHINS_URL: z.string().url().optional(),
  
  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

function validateEnv() {
  try {
    const env = envSchema.parse({
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      NEXT_PUBLIC_BASE_IMAGE_URL: process.env.NEXT_PUBLIC_BASE_IMAGE_URL,
      BASE_URL: process.env.BASE_URL,
      MOHINS_URL: process.env.MOHINS_URL,
      NODE_ENV: process.env.NODE_ENV,
    });
    
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      (error as any)?.errors?.forEach((err: any) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    }
    
    // In development, just warn instead of throwing
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️  Environment validation failed, but continuing in development mode');
      return {
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'https://mohinsservice.com/',
        NEXT_PUBLIC_BASE_IMAGE_URL: process.env.NEXT_PUBLIC_BASE_IMAGE_URL || 'https://mohinsservice.com/',
        BASE_URL: process.env.BASE_URL,
        MOHINS_URL: process.env.MOHINS_URL,
        NODE_ENV: process.env.NODE_ENV || 'development',
      };
    }
    
    throw new Error('Invalid environment configuration');
  }
}

export const env = validateEnv();

// Type-safe environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

