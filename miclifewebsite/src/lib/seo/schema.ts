import { siteConfig } from './metadata';

export type SchemaType = 'Organization' | 'WebPage' | 'BreadcrumbList' | 'Article' | 'FAQPage' | 'Person' | 'InsuranceAgency' | 'Service' | 'ContactPage';

// Base Organization Schema
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'InsuranceAgency',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    alternateName: siteConfig.nameAr,
    url: siteConfig.url,
    logo: {
      '@type': 'ImageObject',
      '@id': `${siteConfig.url}/#logo`,
      url: `${siteConfig.url}/logo.png`,
      width: 250,
      height: 60,
      caption: siteConfig.name,
    },
    image: {
      '@type': 'ImageObject',
      '@id': `${siteConfig.url}/#image`,
      url: `${siteConfig.url}/og-default.jpg`,
      width: 1200,
      height: 630,
      caption: siteConfig.name,
    },
    description: siteConfig.description,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'EG',
      addressRegion: 'Cairo',
      addressLocality: 'Cairo',
      streetAddress: 'Cairo, Egypt',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 30.0444,
      longitude: 31.2357,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Egypt',
    },
    sameAs: [
      siteConfig.facebook,
      siteConfig.linkedin,
      `https://twitter.com/${siteConfig.twitter.replace('@', '')}`,
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: siteConfig.phone,
        contactType: 'customer service',
        areaServed: 'EG',
        availableLanguage: ['Arabic', 'English'],
        contactOption: 'TollFree',
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '09:00',
          closes: '17:00',
        },
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '500',
    },
    foundingDate: '1980',
    slogan: 'Your trusted partner in life insurance',
  };
}

// WebPage Schema
export function getWebPageSchema(pageTitle: string, pageDescription: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}/#webpage`,
    url,
    name: pageTitle,
    description: pageDescription,
    isPartOf: {
      '@id': `${siteConfig.url}/#website`,
    },
    about: {
      '@id': `${siteConfig.url}/#organization`,
    },
    primaryImageOfPage: {
      '@id': `${url}/#primaryimage`,
    },
    inLanguage: 'ar-EG',
    potentialAction: [
      {
        '@type': 'ReadAction',
        target: [url],
      },
    ],
  };
}

// WebSite Schema
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: {
      '@id': `${siteConfig.url}/#organization`,
    },
    inLanguage: 'ar-EG',
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    ],
  };
}

// Breadcrumb Schema
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Article Schema
export function getArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  url,
}: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: [image],
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: authorName,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

// FAQ Schema
export interface FAQItem {
  question: string;
  answer: string;
}

export function getFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Person Schema (for Board Members, Chairman)
export function getPersonSchema({
  name,
  jobTitle,
  image,
  description,
  url,
}: {
  name: string;
  jobTitle: string;
  image: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle,
    image,
    description,
    url,
    worksFor: {
      '@id': `${siteConfig.url}/#organization`,
    },
  };
}

// Service Schema
export function getServiceSchema({
  name,
  description,
  provider,
  areaServed = 'Egypt',
  serviceType = 'Life Insurance',
}: {
  name: string;
  description: string;
  provider?: string;
  areaServed?: string;
  serviceType?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType,
    name,
    description,
    provider: {
      '@id': `${siteConfig.url}/#organization`,
    },
    areaServed: {
      '@type': 'Country',
      name: areaServed,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Insurance Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name,
            description,
          },
        },
      ],
    },
  };
}

// Contact Page Schema
export function getContactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Us',
    description: 'Get in touch with Al Mohandes Life Insurance',
    url: `${siteConfig.url}/contact-us`,
    mainEntity: {
      '@id': `${siteConfig.url}/#organization`,
    },
  };
}

// Local Business Schema
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteConfig.url}/#localbusiness`,
    name: siteConfig.name,
    image: `${siteConfig.url}/og-default.jpg`,
    // '@id': siteConfig.url,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Cairo',
      addressLocality: 'Cairo',
      addressRegion: 'Cairo',
      postalCode: '11511',
      addressCountry: 'EG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 30.0444,
      longitude: 31.2357,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '17:00',
      },
    ],
  };
}

