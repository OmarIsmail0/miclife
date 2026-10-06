"use client";

import HomePage from "../page-components/HomePage";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    // Update meta tags dynamically for home page
    document.title = "Al Mohandes Life Insurance | Leading Life Insurance in Egypt";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Al Mohandes Life Insurance - Egypt\'s trusted life insurance provider for over 45 years. Get comprehensive coverage, competitive rates, and excellent customer service. Call 19318 for a quote!');
    }
  }, []);

  return <HomePage />;
}
