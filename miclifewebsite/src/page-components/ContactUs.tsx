"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import DividerComp from "../shared/components/DividerComp";
import FAQSection from "../shared/components/FAQSection";
import ContactSection from "../shared/components/ContactSection";
import ButtonComp from "../shared/components/ButtonComp";
import colorscm from "../shared/constants/colorscm";
import { useRouter } from "next/navigation";
import { useGetSectionsBySlugQuery } from "../lib/store/api/mainApi";
import LoadingComponent from "../shared/components/LoadingComponent";
import { sanitizeHtml } from "../lib/sanitize";
import HelpCenter from "../shared/components/HelpCenter";
import CompanySinceComp from "../shared/components/CompanySinceComp";

interface RegistrationCTAProps {
  onRegisterModalOpen: () => void;
}

const RegistrationCTA: React.FC<RegistrationCTAProps> = ({ onRegisterModalOpen }) => {
  const { t } = useTranslation();
  const { language } = useSelector((state: any) => state.language);

  return (
    <section
      dir={language === "ar" ? "rtl" : "ltr"}
      className="flex items-center justify-center min-h-[30vh] md:min-h-[40vh] bg-cover bg-center"
      style={{
        backgroundImage: "url('/assets/miclife/background.png')",
      }}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 text-white">
        {/* Text and button */}
        <div className={`max-w-xl text-center md:text-left ${language === "ar" ? "text-right" : "text-left"}`}>
          <h2 className="text-base md:text-lg lg:text-2xl font-bold mb-2">{t("register question")}</h2>
          <p className="mb-4 text-xs md:text-sm lg:text-base">{t("register paragraph")}</p>
          <ButtonComp
            text={t("register")}
            primaryColor="white"
            style={{ color: colorscm.black, backgroundColor: colorscm.white }}
            onClick={onRegisterModalOpen}
            aria-label={t("register")}
          />
        </div>

        {/* Image */}
        <img
          src="/assets/images/join-us.png"
          alt="Join Us Illustration"
          className="w-32 md:w-40 lg:w-64"
          loading="lazy"
        />
      </div>
    </section>
  );
};

const ContactUsPage: React.FC = () => {
  const { t,i18n } = useTranslation();
  // Ensure hooks are not conditionally skipped between renders
  const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);
  const router = useRouter();
  const {
    data: sectionsData,
    isLoading,
    isError,
  } = useGetSectionsBySlugQuery("SENIOR-MANAGEMENT");

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-6 text-center text-gray-700">
        <LoadingComponent />
      </div>
    );
  }

  if (isError) {
    const message =
      i18n.language === "ar"
        ? "حدث خطأ أثناء تحميل بيانات خدمة العملاء."
        : "Unable to load customer service data.";
    return (
      <div className="max-w-7xl mx-auto py-16 px-6 text-center text-gray-700">
        {message}
      </div>
    );
  }

  const handleRegisterModalOpen = () => setRegisterModalVisible(true);
  return (
    <section className="" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <CompanySinceComp />

      {/* Customer Service Design */}
      <h2 className="text-2xl font-bold text-gray-900 text-center my-10">{t("customerService.title")}</h2>

        {/* Contact Information */}
        {sectionsData?.blocks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center justify-items-center max-w-5xl mx-auto mb-8 md:mb-10">
        <div className="text-center space-y-2 md:space-y-3">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">{sectionsData?.blocks[0]?.block?.translations?.[i18n.language === "ar" ? 1 : 0]?.title as string}</h2>
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(sectionsData?.blocks[0]?.block?.translations?.[i18n.language === "ar" ? 1 : 0]?.description as string, { allowLinks: false }) }} />
            {/* <p className="text-gray-700 text-sm md:text-md">{sectionsData[0]?.block?.translations?.[direction === "rtl" ? 1 : 0]?.description as string}</p> */}
          </div>
           {sectionsData?.blocks[0]?.block?.imageUrl && (
             <img src={ `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${sectionsData?.blocks[0]?.block?.imageUrl}`} alt={sectionsData?.blocks[0]?.block?.translations?.[i18n.language === "ar" ? 1 : 0]?.title || "Customer Service - Al Mohandes Insurance"} className="w-70 sm:w-90 md:max-w-md mx-auto h-auto" />
           )}
          
        </div>
      )}
      <DividerComp />

      {/* FAQ and Insurance Services Section */}
      <div className="mt-12 md:mt-16 lg:mt-20 px-4 md:px-10 lg:px-24" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">{t("helpCenter.faqIntro")}</h2>
          <p className="text-lg text-gray-700 mb-4">{t("helpCenter.faqDescription")}</p>
          <p className="text-lg text-gray-700 mb-8">{t("helpCenter.faqSubDescription")}</p>
        </div>

        {/* Insurance Services Section */}
        <div className="text-center mb-8 md:mb-12">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-400 mb-6 md:mb-12 underline">
            {t("helpCenter.insuranceServicesTitle")}
          </h3>

          {/* Service Cards */}
          <div className="flex flex-col md:flex-row justify-center gap-10 md:gap-16">
            {/* Corporate Insurance Card */}
            <div className="text-center">
              <div className="w-60 h-60 md:w-[320px] md:h-[320px] lg:w-[400px] lg:h-[400px] mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                {/* Placeholder for corporate insurance illustration */}
                <div className="  rounded-full flex items-center justify-center">
                  <img
                    src="/assets/miclife/illustrations/company_insurance.png"
                    alt="Corporate Insurance"
                    className="object-contain w-48 h-48 md:w-72 md:h-72 lg:w-[320px] lg:h-[320px]"
                  />
                </div>
              </div>
              <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">{t("helpCenter.corporateInsurance")}</h4>
              <a href="/corporate-insurance" className="text-blue-600 hover:text-blue-800 font-medium">
                {t("helpCenter.learnMore")}
              </a>
            </div>

            {/* Individual Insurance Card */}
            <div className="text-center">
              <div className="w-60 h-60 md:w-[320px] md:h-[320px] lg:w-[400px] lg:h-[400px] mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                {/* Placeholder for individual insurance illustration */}
                <div className=" rounded-full flex items-center justify-center ">
                  <img
                    src="/assets/miclife/illustrations/personal_insurance.png"
                    alt="Corporate Insurance"
                    className="object-contain w-48 h-48 md:w-72 md:h-72 lg:w-[320px] lg:h-[320px]"
                  />
                </div>
              </div>
              <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">{t("helpCenter.individualInsurance")}</h4>
              <a href="/individual-insurance" className="text-blue-600 hover:text-blue-800 font-medium">
                {t("helpCenter.learnMore")}
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* FAQ List */}
      <FAQSection />
      <DividerComp />

      {/* Additional Help Section */}
      <div className="mt-12 md:mt-16 lg:mt-20 px-4 md:px-10 lg:px-24 mb-[60px] md:mb-[80px] lg:mb-[100px]" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6 underline">{t("helpCenter.additionalHelpTitle")}</h2>
        <p className="text-base md:text-lg text-gray-700 mb-6 md:mb-8 mx-auto">{t("helpCenter.additionalHelpText")}</p>
        <div className="flex justify-center md:justify-end">
          <button onClick={() => router.push("/contact-us")} className="bg-green-800 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-base md:text-lg flex items-center">
            <span>{i18n.language === "ar" ? "تواصل معنا" : "Contact Us"}</span>
          </button>
        </div>
      </div>
      {/* Contact Section */}
      <ContactSection />

      <div className=" text-gray-400 my-12 ">
        <RegistrationCTA onRegisterModalOpen={handleRegisterModalOpen} />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center my-6 sm:my-10">
          {t("customerService.usefulResources.title")}
        </h2>

        <p className="text-gray-700 text-center px-6 mb-6 sm:mb-8 text-sm sm:text-base">{t("customerService.usefulResources.description")}</p>
       <div className="grid grid-cols-1 px-6 md:grid-cols-3 gap-6 md:gap-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
            <a href="/path/to/your/customer-protection-guide.pdf" target="_blank" rel="noopener noreferrer">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 text-center pb-3 sm:pb-5">
                {t("customerService.usefulResources.resource1Title")}
              </h3>
            </a>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
            <a href="/path/to/your/documents.pdf" target="_blank" rel="noopener noreferrer">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 text-center pb-3 sm:pb-5">
                {t("customerService.usefulResources.resource2Title")}
              </h3>
            </a>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
            <a href="/path/to/your/insurance-books.pdf" target="_blank" rel="noopener noreferrer">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 text-center pb-3 sm:pb-5">
                {t("customerService.usefulResources.resource3Title")}
              </h3>
            </a>
          </div>
        </div>
    </section>
  );
};

export default ContactUsPage;
