import InsuranceDetailBySlugClient from "./client";
import { buildTimeFetch } from "@/src/lib/buildTimeFetch";

// Generate static params for all insurance products at build time
export async function generateStaticParams() {
    try {
        // Use environment variable with fallback to production URL
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mohinsservice.com';
        
        const response = await buildTimeFetch(
            `${baseUrl}/ContentManage/product/getall`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            }
        );

        if (!response.ok) {
            console.error("Failed to fetch products for static generation. Status:", response.status);
            return [];
        }

        const data = await response.json();
        const products = data?.data || [];

        return products.map((product: any) => ({
            slug: product.slug,
        }));
    } catch (error) {
        console.error("Error generating static params for insurance details:", error);
        return [];
    }
}

export default async function InsuranceDetailBySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <InsuranceDetailBySlugClient slug={slug} />;
}




