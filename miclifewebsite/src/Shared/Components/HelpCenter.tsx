 
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import DividerComp from "./DividerComp";
import FAQSection from "./FAQSection";
import Link from "next/link";
import { useContext } from "react";
import { LineOfBusinessContext } from "../context/LineOfBusinessContext";
import { sanitizeHtml } from "../../lib/sanitize";



const HelpCenter = ({ data }: { data: any }) => {
  const { direction } = useSelector((state: any) => state.language);
  const lineOfBusiness = useContext(LineOfBusinessContext);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12" dir={direction}>
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center mb-8 md:mb-10">
      <div className="text-center md:text-left space-y-2 md:space-y-3">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">{data[0]?.block?.translations?.[direction === "rtl" ? 1 : 0]?.title as string}</h2>
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(data[0]?.block?.translations?.[direction === "rtl" ? 1 : 0]?.description as string, { allowLinks: false }) }} />
          {/* <p className="text-gray-700 text-sm md:text-md">{data[0]?.block?.translations?.[direction === "rtl" ? 1 : 0]?.description as string}</p> */}
        </div>
         {data[0]?.block?.imageUrl && (
           <img src={ `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${data[0].block.imageUrl}`} alt={data[0]?.block?.translations?.[direction === "rtl" ? 1 : 0]?.title || "Customer Service - Al Mohandes Insurance"} className="w-70 sm:w-90 md:max-w-md mx-auto h-auto" />
         )}
        
      </div>

      <DividerComp />

      {/* Insurance Services */}
      <div className="flex justify-center flex-wrap gap-4 sm:gap-6 my-6 md:my-8">
        {lineOfBusiness?.map((service: any, idx: number) => (
          <Link key={idx} href={`/insurance/${service.slug}`} className="w-24 sm:w-28 md:w-36 text-center transition-transform hover:scale-105">
            { service.iconUrl && (
             <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${service.iconUrl}`} alt={service.translations?.[direction === "rtl" ? 1 : 0]?.name as string} className="mx-auto h-12 md:h-16 mb-1 md:mb-2" />
            )}
            <p className="text-xs sm:text-sm text-gray-800 font-medium">{service.translations?.[direction === "rtl" ? 1 : 0]?.name as string}</p>
          </Link>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="my-6 md:my-8">
        <FAQSection />
      </div>

      <DividerComp />

      {/* Final CTA */}
    </section>
  );
};

export default HelpCenter;
