import { Metadata } from 'next';

export const siteConfig = {
  name: 'Al Mohandes Life Insurance',
  nameAr: 'المهندس للتأمين على الحياة',
  shortName: 'Mohandes Life',
  description: 'Leading life insurance services in Egypt. Get comprehensive coverage for you and your family with Al Mohandes Life Insurance. Contact us at 19318.',
  descriptionAr: 'خدمات التأمين على الحياة الرائدة في مصر. احصل على تغطية شاملة لك ولأسرتك مع المهندس للتأمين على الحياة. اتصل بنا على 19318.',
  url: 'https://www.mohins.com',
  ogImage: '/og-default.jpg',
  phone: '19318',
  email: 'info@mohins.com',
  address: 'Cairo, Egypt',
  twitter: '@MohandesIns',
  facebook: 'https://www.facebook.com/Mohandes/LifeInsurance',
  linkedin: 'https://www.linkedin.com/company/mohandes-life-insurance',
};

export function generatePageMetadata({
  title,
  description,
  path = '',
  image = siteConfig.ogImage,
  keywords = [],
  noIndex = false,
  type = 'website',
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
  type?: 'website' | 'article' | 'profile';
}): Metadata {
  const url = `${siteConfig.url}${path}`;
  
  const baseKeywords = [
    'life insurance',
    'life insurance Egypt',
    'Al Mohandes Insurance',
    'Mohandes Life',
    'تأمين على الحياة',
    'المهندس للتأمين',
    'insurance company Egypt',
    'Cairo insurance',
    'Alexandria insurance',
    'Egypt insurance',
    'family insurance',
    'health insurance',
    'personal insurance',
    'financial protection',
    'التأمين على الحياة في مصر',
    'شركة التأمين',
    'التأمين الصحي',
    'الحماية المالية',
  ];

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    keywords: [...baseKeywords, ...keywords],
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type,
      locale: 'ar_EG',
      alternateLocale: ['en_US'],
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: siteConfig.twitter,
      site: siteConfig.twitter,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: url,
      languages: {
        'ar-EG': url,
        'en-US': url,
      },
    },
    category: 'Insurance',
  };
}

export const defaultKeywords = [
  'mohindes life insurance',
  'موندس للتأمين على الحياة',
  'life insurance Egypt',
  'life insurance Cairo',
  'life insurance Alexandria',
  'individual insurance',
  'group insurance',
  'family insurance',
  'health insurance Egypt',
  'accident insurance',
  'savings insurance',
  'investment insurance',
  'pension insurance',
  'retirement planning',
  'financial protection',
  'insurance quotes Egypt',
  'best insurance company Egypt',
  'reliable insurance Egypt',
  'affordable insurance',
  'comprehensive coverage',
  'customer service 19318',
  'تأمين على الحياة',
  'تأمين صحي',
  'تأمين عائلي',
  'تأمين ادخار',
  'تأمين استثماري',
  'تأمين تقاعد',
  'حماية مالية',
  'أفضل شركة تأمين في مصر',
  'تأمين موثوق',
  'تأمين بأسعار معقولة',
  'تغطية شاملة',
  'خدمة العملاء 19318',
];

