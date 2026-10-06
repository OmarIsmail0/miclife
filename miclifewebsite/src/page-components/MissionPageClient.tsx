"use client";
import { useTranslation } from "react-i18next";
import InsurancePlanCard from "../shared/components/InsurancePlanCard";

interface MissionPageClientProps {
  sectionsData: any;
}

const MissionPageClient = ({ sectionsData }: MissionPageClientProps) => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;

  if (!sectionsData) {
    const message =
      language === "ar"
        ? "حدث خطأ أثناء تحميل بيانات رسالتنا."
        : "Unable to load mission page data.";
    return (
      <div className="max-w-7xl mx-auto py-16 px-6 text-center text-gray-700">
        {message}
      </div>
    );
  }

  const sections = sectionsData?.blocks || [];

  return (
    <section className="max-w-7xl mx-auto py-16 px-6 space-y-12" dir={language === "ar" ? "rtl" : "ltr"}>
      {sections.length > 0 ? (
        sections.map((section: any, index: number) => (
          <InsurancePlanCard
            key={section.id || index}
            title={
              language === "ar"
                ? section?.block?.translations?.[1]?.name
                : section?.block?.translations?.[0]?.name
            }
            shortDescription=""
            fullDescription={
              language === "ar"
                ? section?.block?.translations?.[1]?.description
                : section?.block?.translations?.[0]?.description
            }
            image={
              section?.block?.imageUrl
                ? `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${section?.block?.imageUrl}`
                : undefined
            }
            isReversed={index % 2 !== 0}
            isLast={index === sections.length - 1}
          />
        ))
      ) : (
        <div className="text-center text-gray-700">
          {language === "ar"
            ? "لا توجد بيانات متاحة حاليًا."
            : "No data available at this time."}
        </div>
      )}
    </section>
  );
};

export default MissionPageClient;


