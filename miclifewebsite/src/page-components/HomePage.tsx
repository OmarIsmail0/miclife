"use client";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useState, useEffect, useContext } from "react";
import Link from "next/link";

// Components
import AboutUsComp from "../shared/components/AboutUsComp";
import FAQSection from "../shared/components/FAQSection";
import DividerComp from "../shared/components/DividerComp";
import ButtonComp from "../shared/components/ButtonComp";
import ProductDescription from "../shared/components/InsuranceDescription";
import QuoteModal from "../shared/components/QuoteModal";
import AccidentModal from "../shared/components/AccidentModal";
import RegisterModal from "../shared/components/RegisterModal";

// New extracted components
import HeroSection from "../shared/components/HeroSection";
import NewsMarquee from "../shared/components/NewsMarquee";
import ServicesSection from "../shared/components/ServicesSection";
import ContactSection from "../shared/components/ContactSection";
import InstallmentInquirySection from "../shared/components/InstallmentInquirySection";

// Constants
import colorscm from "../shared/constants/colorscm";
import LoadingComponent from "../shared/components/LoadingComponent";
import { useGetSectionsBySlugQuery } from "../lib/store/api/mainApi";
import { LineOfBusinessContext } from "../shared/context/LineOfBusinessContext";

// Social Responsibility data

// Registration CTA Section Component
interface RegistrationCTAProps {
  onRegisterModalOpen: () => void;
}

const RegistrationCTA: React.FC<RegistrationCTAProps> = ({ onRegisterModalOpen }) => {
  const { t, i18n } = useTranslation();

  return (
    <section
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
      className="flex items-center justify-center min-h-[30vh] md:min-h-[40vh] bg-cover bg-center"
      style={{
        backgroundImage: "url('/assets/miclife/background.png')",
      }}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 text-white">
        {/* Text and button */}
        <div className={`max-w-xl text-center md:text-left ${i18n.language === "ar" ? "text-right" : "text-left"}`}>
          <h2 className="text-base md:text-lg lg:text-2xl font-bold mb-2">{t("register question")}</h2>
          <p className="mb-4 text-xs md:text-sm lg:text-base">{t("register paragraph")}</p>
          <ButtonComp
            text={t("register")}
            primaryColor="white"
            style={{
              backgroundColor: "white", color: "black"
            }}
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



// Social Responsibility Section Component
const SocialResponsibilitySection: React.FC<{ sectionsData: any }> = ({ sectionsData }) => {
  const { t, i18n } = useTranslation();

  return (
    <section
      className="max-w-7xl mx-auto py-10 md:py-16 px-4 md:px-6 space-y-8 mb-24 md:space-y-12 border-b-2 border-gray-200"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      {sectionsData?.blocks.length > 0 && (
        (sectionsData?.blocks as []).filter((block: any) => {
          return block.block.displayOrder === 2;
        })?.map((block: any, index: number) => (
          <ProductDescription
            key={index}
            title={block.block.translations?.[i18n.language === "ar" ? 1 : 0]?.title as string}
            description={block.block.translations?.[i18n.language === "ar" ? 1 : 0]?.description as string}
            image={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${block.block.imageUrl}`}
          />
        ))
      )}
      
        
    </section>
  );
};

// Main HomePage Component
const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
    // Modal states
    const [isQuoteModalVisible, setQuoteModalVisible] = useState(false);
    const [isAccidentModalVisible, setAccidentModalVisible] = useState(false);
    const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);
  
    // Modal handlers
    const handleRegisterModalOpen = () => setRegisterModalVisible(true);
    const handleQuoteModalClose = () => setQuoteModalVisible(false);
    const handleAccidentModalClose = () => setAccidentModalVisible(false);
    const handleRegisterModalClose = () => setRegisterModalVisible(false);
  const {
    data: sectionsData,
    isLoading,
    isError,
  } = useGetSectionsBySlugQuery("DASHBOARD");

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
        ? "حدث خطأ أثناء تحميل بيانات الصفحة الرئيسية."
        : "Unable to load home page data.";
    return (
      <div className="max-w-7xl mx-auto py-16 px-6 text-center text-gray-700">
        {message}
      </div>
    );
  }

  return (
    <main>
      {/* Hero Section */}
      <HeroSection />
      {/* About Us Section */}
      {sectionsData?.blocks.length > 0 && (
        <>
          <AboutUsComp data={(sectionsData?.blocks as []).filter((block: any) => {
            return block.block.displayOrder === 1;
          }) ?? []} />
          <DividerComp />
        </>
      )}
      {/* News Ticker */}
      {/* <NewsMarquee /> */}
      {/* Insurance Services */}
      <ServicesSection />
      {/* Contact Section */}
      <ContactSection />
      {/* Social Responsibility Section */}
      <SocialResponsibilitySection sectionsData={sectionsData} />
      {/* Installment Inquiry Section */}
      <InstallmentInquirySection />
      {/* Divider CTA */}
      <div className=" text-gray-400 my-12 ">
        <RegistrationCTA onRegisterModalOpen={handleRegisterModalOpen} />
      </div>
      {/* Divider */}
      <DividerComp />
      {/* FAQ Section */}
      <FAQSection />
      {/* Modals */}
      <QuoteModal visible={isQuoteModalVisible} onClose={handleQuoteModalClose} />
      <AccidentModal visible={isAccidentModalVisible} onClose={handleAccidentModalClose} />
      <RegisterModal visible={isRegisterModalVisible} onClose={handleRegisterModalClose} />
    </main>
  );
};

export default HomePage;
