import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const LifeInsuranceHero: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useSelector((state: any) => state.language);

  return (
    <section className="py-16" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-[80vw]  mx-auto flex justify-center items-center">
        {/* Text Content */}
        <h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight tracking-wide "
          style={{
            lineHeight: "2",
          }}
        >
          {t("lifeInsurance.heroTitle")}
        </h1>
      </div>
    </section>
  );
};

export default LifeInsuranceHero;
