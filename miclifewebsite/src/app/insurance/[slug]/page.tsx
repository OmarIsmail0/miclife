import InsuranceBySlugClient from "./client";
import { buildTimeFetch } from "@/src/lib/buildTimeFetch";

// Generate static params for all insurance line of business at build time
export async function generateStaticParams() {
    try {
        // Use environment variable with fallback to production URL
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mohinsservice.com';
        
        const response = await buildTimeFetch(
            `${baseUrl}/ContentManage/lob/getall`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            }
        );

        if (!response.ok) {
            console.error("Failed to fetch line of business for static generation. Status:", response.status);
            return [];
        }

        const data = await response.json();
        const lineOfBusiness = data?.data || [];

        return lineOfBusiness.map((lob: any) => ({
            slug: lob.slug,
        }));
    } catch (error) {
        console.error("Error generating static params for insurance:", error);
        return [];
    }
}

export default async function InsuranceBySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <InsuranceBySlugClient slug={slug} />;
}


