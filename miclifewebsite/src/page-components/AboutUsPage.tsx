import { useGetSectionsBySlugQuery } from "@/src/lib/store/api/mainApi";
import LoadingComponent from "../Shared/Components/LoadingComponent";
import MissionPageClient from "./MissionPageClient";

const AboutUsPage = () => {
  const { data: sectionsData, isLoading } = useGetSectionsBySlugQuery("ABOUT-US");

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-6 text-center text-gray-700">
        <LoadingComponent />
      </div>
    );
  }

  return <MissionPageClient sectionsData={sectionsData} />;
};

export default AboutUsPage;
