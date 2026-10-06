import BoardDirectorDetailsContent from "@/src/shared/components/BoardDirectorDetailsContent";
import { buildTimeFetch } from "@/src/lib/buildTimeFetch";

// Generate static params for all board directors at build time
export async function generateStaticParams() {
    try {
        // Use environment variable with fallback to production URL
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mohinsservice.com';
        
        
        const response = await buildTimeFetch(
            `${baseUrl}/ContentManage/boardmember/getall`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            }
        );

        if (!response.ok) {
            console.error("Failed to fetch board directors for static generation. Status:", response.status);
            return [];
        }

        const data = await response.json();
        const directors = data?.data || [];

        return directors.map((director: any) => ({
            id: String(director.id),
        }));
    } catch (error) {
        console.error("Error generating static params for board directors:", error);
        return [];
    }
}

export default async function BoardDirectorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <BoardDirectorDetailsContent id={id ?? ""} />;
}
