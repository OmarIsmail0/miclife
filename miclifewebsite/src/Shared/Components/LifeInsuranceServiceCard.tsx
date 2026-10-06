import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Link from "next/link";


const LifeInsuranceServiceCard: React.FC<any> = ({
  service,
  isReversed,
}) => {
  const { t, i18n } = useTranslation();
  // console.log("qwdqwd", service);
  const title =  service?.translations[i18n.language === "ar" ? 1 : 0]?.name;
  const description = service?.translations[i18n.language === "ar" ? 1 : 0]?.shortDescription;
  const columnAlign = isReversed ? "items-end" : "items-start";
  const textAlign = i18n.language === "ar" ? "text-right" : isReversed ? "text-right" : "text-left";


  return (
    <div
      className={`flex flex-col ${
        isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
      } items-center gap-8 lg:gap-12 py-8 border-b-2 border-gray-200`}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      {/* Text Content */}
      <div className={`flex flex-col flex-1 space-y-10 ${columnAlign} ${textAlign}`}>
        <h3 className={"text-2xl lg:text-3xl font-bold text-gray-800"}>{title}</h3>
        {description && <p className="text-gray-600 text-lg">{description}</p>}
        <Link
          href={`/insurance-detail/${service.slug}`}
          
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-lg transition-colors"
        >
          {t("lifeInsurance.learnMore")}
          <svg
            className={`w-5 h-5 ${i18n.language === "ar" ? "mr-2 rotate-180" : "ml-2"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Image */}
      <div className={`flex-1 flex ${isReversed ? "justify-start" : "justify-end"}`}>
        <img src={service.image} alt={title} className="w-full max-w-sm h-auto" />
      </div>
    </div>
  );
};

export default LifeInsuranceServiceCard;
