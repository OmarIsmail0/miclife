
import "./globals.css";
import ReduxProvider from "../lib/providers/ReduxProvider";
import I18nProvider from "../lib/providers/I18nProvider";
import { LanguageProvider } from "../lib/contexts/LanguageContext";
import Layout from "../shared/components/Layout";
import type { Metadata, Viewport } from 'next';
import { siteConfig, defaultKeywords } from '@/src/lib/seo/metadata';

const siteName = siteConfig.name;
const baseUrl = siteConfig.url;
const title = `${siteName} | Life Insurance Egypt`;
const description = siteConfig.description;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1567A6',
  colorScheme: 'light',
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: title,
    template: `%s | ${siteName}`,
  },
  description,
  keywords: defaultKeywords,
  authors: [{ name: siteName, url: baseUrl }],
  creator: siteName,
  publisher: siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    alternateLocale: ['en_US'],
    url: baseUrl,
    title,
    description,
    siteName,
    images: [
      {
        url: `${baseUrl}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: siteName,
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [`${baseUrl}/og-default.jpg`],
    creator: siteConfig.twitter,
    site: siteConfig.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: baseUrl,
    languages: {
      'ar-EG': `${baseUrl}`,
      'en-US': `${baseUrl}`,
    },
  },
  category: 'Insurance',
  applicationName: siteName,
  appleWebApp: {
    capable: true,
    title: siteName,
    statusBarStyle: 'default',
  },
  verification: {
    google: 'verification_token', // Replace with actual token
    // yandex: 'verification_token',
    // bing: 'verification_token',
  },
  other: {
    'msapplication-TileColor': '#1567A6',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'InsuranceAgency',
    '@id': `${baseUrl}/#organization`,
    name: siteName,
    alternateName: siteConfig.nameAr,
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      '@id': `${baseUrl}/#logo`,
      url: `${baseUrl}/logo.png`,
      width: 250,
      height: 60,
      caption: siteName,
    },
    image: {
      '@type': 'ImageObject',
      '@id': `${baseUrl}/#image`,
      url: `${baseUrl}/og-default.jpg`,
      width: 1200,
      height: 630,
      caption: siteName,
    },
    description,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'EG',
      addressRegion: 'Cairo',
      addressLocality: 'Cairo',
      streetAddress: siteConfig.address,
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

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: siteName,
    description,
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    inLanguage: 'ar-EG',
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    ],
  };

  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        
        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        <ReduxProvider>
          <LanguageProvider>
            <I18nProvider>
              <Layout>
                {children}
              </Layout>
            </I18nProvider>
          </LanguageProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}