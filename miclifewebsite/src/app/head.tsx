export default function Head() {
    const siteName = 'Al Mohandes Insurance';
    const baseUrl = 'https://www.mohins.com';
    const title = `${siteName} | Medical, Property, Car & Engineering Insurance`;
    const description = 'Leading insurance services in Egypt: medical, property, car, engineering, transport and more. Get a quote or contact customer service 19318.';
    const ogImage = `${baseUrl}/og-default.jpg`;
  
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={baseUrl} />
  
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={baseUrl} />
        <meta property="og:image" content={ogImage} />
  
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
  
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
  
        {/* JSON-LD (Organization) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: siteName,
              url: baseUrl,
              logo: `${baseUrl}/logo.png`,
              sameAs: [
                'https://www.facebook.com/',
                'https://www.linkedin.com/company/'
              ],
              contactPoint: [{
                '@type': 'ContactPoint',
                telephone: '19318',
                contactType: 'customer service',
                areaServed: 'EG'
              }]
            }),
          }}
        />
      </>
    );
  }
  
  
  