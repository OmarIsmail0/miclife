import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative">
      <div
        className="relative h-[30vh] flex items-center justify-center bg-cover bg-center "
        style={{
          backgroundImage: `url(/assets/miclife/back.png)`,
        }}
        role="banner"
        aria-label={t("hero.banner")}
      ></div>
    </section>
  );
};

export default HeroSection;
