import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z.string().url(),
  NEXT_PUBLIC_BASE_IMAGE_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_GA_ID: z.string(),
});

// Preserve existing public variable names without exposing server credentials.
const baseUrl = import.meta.env.NEXT_PUBLIC_BASE_URL || "https://mohinsservice.com/";

export const env = envSchema.parse({
  NEXT_PUBLIC_BASE_URL: baseUrl,
  NEXT_PUBLIC_BASE_IMAGE_URL: import.meta.env.NEXT_PUBLIC_BASE_IMAGE_URL || baseUrl,
  NEXT_PUBLIC_API_URL: import.meta.env.NEXT_PUBLIC_API_URL || import.meta.env.NEXT_PUBLIC_BASE_IMAGE_URL || baseUrl,
  NEXT_PUBLIC_GA_ID: import.meta.env.NEXT_PUBLIC_GA_ID || "",
});
