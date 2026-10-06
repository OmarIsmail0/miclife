"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import colorscm from "../constants/colorscm";

interface Service {
  title: string;
  image: string;
  link: string;
}

const servicesData: Service[] = [
  {
    title: "individualInsurance",
    image: "/assets/miclife/insurance-sections/individuals.svg",
    link: "/individual-insurance",
  },
  {
    title: "corporateInsurance",
    image: "/assets/miclife/insurance-sections/corporate.svg",
    link: "/corporate-insurance",
  },
];

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { t } = useTranslation();
  
  // Get translation directly - handle both keys
  const getTranslatedTitle = () => {
    if (service.title === "individualInsurance") {
      return t("life.individual insurance");
    }
    if (service.title === "corporateInsurance") {
      return t("life.corporate insurance");
    }
    return service.title;
  };
  
  const translatedTitle = getTranslatedTitle();

  return (
    <Link href={service.link} className="block group">
      <div
        className="bg-white shadow-lg rounded-full w-64 h-64 md:w-80 md:h-80 flex flex-col items-center justify-center text-center p-6 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-xl"
        style={{ backgroundColor: colorscm.lightGray }}
        role="button"
        tabIndex={0}
        aria-label={`Learn more about ${translatedTitle}`}
      >
        <div className="mb-4">
          <img
            src={service.image}
            alt={`${service.title} icon`}
            className="mx-auto h-32 md:h-40 w-32 md:w-40 object-contain"
            loading="lazy"
          />
        </div>
        <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-3 px-2">{translatedTitle}</h3>
        <span
          className="text-white font-medium px-4 py-2 rounded-full transition-colors duration-200 group-hover:opacity-90"
          style={{ color: colorscm.primary }}
        >
          {t("learn more")}
        </span>
      </div>
    </Link>
  );
};

const ServicesSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="flex-1 container mx-auto px-4 sm:px-6 lg:px-16 py-8 md:py-10">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-800 mb-6 md:mb-8 underline">
        {t("life.Insurance services")}
      </h2>

      <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-80">
        {servicesData.map((service, index) => (
          <ServiceCard key={index} service={service} />
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
