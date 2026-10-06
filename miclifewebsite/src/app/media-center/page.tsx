'use client';

import MediaCenter from '../../page-components/MediaCenter';
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    // Update meta tags dynamically
    document.title = "Media Center - News & Updates | Al Mohandes Life Insurance";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Stay updated with the latest news, press releases, and announcements from Al Mohandes Life Insurance. Read our latest articles and media coverage.');
    }
  }, []);

  return (
    <>
      <MediaCenter />
    </>
  );
}


