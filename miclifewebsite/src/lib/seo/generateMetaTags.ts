import { siteConfig } from './metadata';

interface MetaTagsOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export function generateMetaTags({
  title,
  description,
  path = '',
  image = '/og-default.jpg',
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
}: MetaTagsOptions) {
  const url = `${siteConfig.url}${path}`;
  const fullImageUrl = image.startsWith('http') ? image : `${siteConfig.url}${image}`;

  const metaTags = [
    // Basic Meta Tags
    { name: 'description', content: description },
    { name: 'author', content: author || siteConfig.name },
    
    // Open Graph Meta Tags
    { property: 'og:type', content: type },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: fullImageUrl },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: title },
    { property: 'og:site_name', content: siteConfig.name },
    { property: 'og:locale', content: 'ar_EG' },
    { property: 'og:locale:alternate', content: 'en_US' },
    
    // Twitter Card Meta Tags
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: siteConfig.twitter },
    { name: 'twitter:creator', content: siteConfig.twitter },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: fullImageUrl },
    { name: 'twitter:image:alt', content: title },
    
    // Additional Meta Tags
    { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
    { name: 'googlebot', content: 'index, follow' },
    { name: 'bingbot', content: 'index, follow' },
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    { name: 'apple-mobile-web-app-title', content: siteConfig.shortName },
  ];

  // Article-specific meta tags
  if (type === 'article') {
    if (publishedTime) {
      metaTags.push({ property: 'article:published_time', content: publishedTime });
    }
    if (modifiedTime) {
      metaTags.push({ property: 'article:modified_time', content: modifiedTime });
    }
    if (author) {
      metaTags.push({ property: 'article:author', content: author });
    }
    if (section) {
      metaTags.push({ property: 'article:section', content: section });
    }
    tags.forEach(tag => {
      metaTags.push({ property: 'article:tag', content: tag });
    });
  }

  return metaTags;
}

export function generateCanonicalUrl(path: string = '') {
  return `${siteConfig.url}${path}`;
}

export function generateAlternateLinks(path: string = '') {
  return [
    { rel: 'canonical', href: `${siteConfig.url}${path}` },
    { rel: 'alternate', hreflang: 'ar-EG', href: `${siteConfig.url}${path}` },
    { rel: 'alternate', hreflang: 'en-US', href: `${siteConfig.url}${path}` },
    { rel: 'alternate', hreflang: 'x-default', href: `${siteConfig.url}${path}` },
  ];
}

