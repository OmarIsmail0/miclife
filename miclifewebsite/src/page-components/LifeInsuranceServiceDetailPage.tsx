import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import InstallmentInquirySection from "../shared/components/InstallmentInquirySection";

const LifeInsuranceServiceDetailPage: React.FC<any> = ({ product }) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serviceData, setServiceData] = useState<any>(null);

  // Get service data from state

  // If service data not found, show loading or redirect
  // if (!product) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <h1 className="text-2xl font-bold text-gray-800 mb-4">{t("serviceDetail.serviceNotFound")}</h1>
  //         <p className="text-gray-600">{t("serviceDetail.serviceNotFoundMessage")}</p>
  //       </div>
  //     </div>
  //   );
  // }

  const title =  product?.translations[i18n.language === "ar" ? 1 : 0]?.name;
  const description = product?.translations[i18n.language === "ar" ? 1 : 0]?.shortDescription;
  const details = product?.translations[i18n.language === "ar" ? 1 : 0]?.fullDescription;

  return (
    <div className="min-h-screen" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      {/* Hero Section with Image and Title */}
      <section className="max-w-7xl mx-auto py-16 px-6">
        <div
          className={`flex flex-col ${i18n.language === "ar" ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-8 lg:gap-12`}
        >
          {/* Text Content */}
          <div className="flex-1 space-y-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">{title}</h1>
            {description && <p className="text-xl text-gray-600">{description}</p>}
          </div>

          {/* Image */}
          {product?.imageUrl && <div className="flex-1 flex justify-center">
            <img src={`${process.env.NEXT_PUBLIC_API_URL}${product?.imageUrl}`} alt={title} className="w-full max-w-md h-auto" />
          </div>}
        </div>
      </section>

      {/* Details and Form Section */}
      <section className="max-w-7xl mx-auto py-16 px-6 bg-white">
        <div className="space-y-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 text-center">
            {t("serviceDetail.programDetails")}
          </h2>

          {/* Program Details */}
          <div className="prose prose-lg max-w-none text-gray-700">
            <div
              className="text-lg leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{
                __html: details,
              }}
            />
          </div>

          {/* Form Section */}
          <div className="mt-16">
            <div className="bg-gray-50 rounded-lg p-8">
              <InstallmentInquirySection direction={i18n.language === "ar" ? "rtl" : "ltr"} displayImage={false} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LifeInsuranceServiceDetailPage;
