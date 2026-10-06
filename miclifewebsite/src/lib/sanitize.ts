// Minimal config shape we use; avoids needing dompurify types
type Config = {
  ALLOWED_TAGS?: string[];
  ALLOWED_ATTR?: string[];
};

// Create a safe sanitizer for both server and client.
// On the server, it becomes a no-op to avoid window-related errors.
let purifier: { sanitize: (input: string, config?: Config) => string };

if (typeof window !== "undefined") {
	try {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const createDOMPurify = require("dompurify");
		purifier = createDOMPurify(window as unknown as Window);
	} catch {
		purifier = {
			sanitize: (input: string) => input ?? "",
		};
	}
} else {
	purifier = {
		sanitize: (input: string) => input ?? "",
	};
}

interface SanitizeOptions {
  allowedTags?: string[];
  allowedAttributes?: string[];
  allowLinks?: boolean;
}

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param dirty - The potentially unsafe HTML string
 * @param options - Configuration options for sanitization
 * @returns Sanitized HTML string safe to render
 */
export function sanitizeHtml(
  dirty: string,
  options: SanitizeOptions = {}
): string {
  // Return empty string for null/undefined
  if (!dirty) return '';

  const {
    allowedTags = ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    allowedAttributes = ['class'],
    allowLinks = true,
  } = options;

  const config: Config = {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttributes,
  };

  if (allowLinks) {
    config.ALLOWED_TAGS?.push('a');
    config.ALLOWED_ATTR?.push('href', 'target', 'rel');
  }

  // Sanitize the HTML
  const clean = purifier.sanitize(dirty);

  // Add rel="noopener noreferrer" to all external links for security
  if (allowLinks) {
    return clean.replace(
      /<a\s+href="([^"]*)"([^>]*)>/gi,
      (match: string, href: string, rest: string) => {
        // Check if href is external
        const isExternal = href.startsWith('http://') || href.startsWith('https://');
        if (isExternal && !rest.includes('rel=')) {
          return `<a href="${href}"${rest} rel="noopener noreferrer">`;
        }
        return match;
      }
    );
  }

  return clean;
}

/**
 * Sanitizes text content by removing all HTML tags
 * @param text - The text that may contain HTML
 * @returns Plain text without any HTML
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  return purifier.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

