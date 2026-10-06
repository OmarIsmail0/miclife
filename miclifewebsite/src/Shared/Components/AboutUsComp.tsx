
import InsurancePlanCard from "../components/InsurancePlanCard";
import { useTranslation } from "react-i18next";

const AboutUsComp = ( { data }: { data: any }) => {
  const { i18n } = useTranslation();

  return (
    <>
    {data && (
    <div className="container mx-auto py-16 px-6 space-y-12" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <InsurancePlanCard
        title={data[0]?.block?.translations?.[i18n.language === "ar" ? 1 : 0]?.title as string}
        description={data[0]?.block?.translations?.[i18n.language === "ar" ? 1 : 0]?.description as string}
        image={data[0]?.block?.imageUrl ? `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${data[0]?.block?.imageUrl}` : undefined}
        isReversed={false}
        isLast={true}
      />
  
    </div>
  )}
  </>
  )
};

export default AboutUsComp;
