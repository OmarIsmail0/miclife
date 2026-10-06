import { useSelector } from "react-redux";
import colorscm from "../constants/colorscm";

interface NewsItem {
  ar: string;
  en: string;
}

const newsData: NewsItem[] = [
  {
    ar: `أموال الغد: أرباح " المهندس للتأمين " ترتفع بنسبة %53 خلال الربع الأول من 2023 - المصدر: للمره الاولى... المهندس للتأمين تحقق أقساط`,
    en: `Tomorrow's Money: Al Mohandes Insurance profits rise by 53% during the first quarter of 2023 - Source: For the first time... Al Mohandes Insurance achieves premiums`,
  },
  {
    ar: `أموال الغد: أرباح " المهندس للتأمين " ترتفع بنسبة %53 خلال الربع الأول من 2023 - المصدر: للمره الاولى... المهندس للتأمين تحقق أقساط`,
    en: `Tomorrow's Money: Al Mohandes Insurance profits rise by 53% during the first quarter of 2023 - Source: For the first time... Al Mohandes Insurance achieves premiums`,
  },
];

const NewsMarquee: React.FC = () => {
  const { direction } = useSelector((state: any) => state.language);

  return (
    <div
      dir={direction}
      className="text-white text-sm py-2 px-4 overflow-hidden whitespace-nowrap"
      style={{ backgroundColor: colorscm.pomonaGreen }}
      role="region"
      aria-label="Latest news"
    >
      <div className="animate-marquee inline-block">
        {newsData.map((item, index) => (
          <span className={`font-semibold ${index === newsData.length - 1 ? "px-0" : " mx-4 md:mx-60"}`} key={index}>
            {direction === "ltr" ? item.en : item.ar}
          </span>
        ))}
      </div>
    </div>
  );
};

export default NewsMarquee;
