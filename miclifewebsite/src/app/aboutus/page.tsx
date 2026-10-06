import { getSectionsBySlug } from "@/src/lib/serverDataFetchers";
import type { Metadata } from 'next';
import MissionPageClient from "../../page-components/MissionPageClient";

export const metadata: Metadata = {
  title: 'About Us - Our Mission & Vision',
  description: 'Learn about Al Mohandes Insurance Company mission, vision, and values. Leading insurance provider in Egypt with 45+ years of excellence.',
  alternates: {
    canonical: 'https://www.mohins.com/aboutus',
  },
  openGraph: {
    title: 'About Al Mohandes Insurance',
    description: 'Learn about our mission, vision, and values. 45+ years of insurance excellence in Egypt.',
    url: 'https://www.mohins.com/aboutus',
  },
};

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

export default async function Page() {
  // Fetch data at build time
  const sectionsData = await getSectionsBySlug("ABOUT-US");
  
  return <MissionPageClient sectionsData={sectionsData} />;
}