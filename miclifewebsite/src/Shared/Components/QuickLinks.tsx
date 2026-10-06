

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useGetAllInvestorsQuery } from "@/src/lib/store/api/mainApi";
import LoadingComponent from "./LoadingComponent";

const QuickLinks = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { data: investors, isLoading, isError } = useGetAllInvestorsQuery({});
  // const links = [
  //   {
  //     enName: "Stock Overview",
  //     arName: "نظرة عامة عن السهم",
  //     url: `https://ir.egidegypt.com/${language}/stockoverview/7-tepwdJytBe0rvfaygq7r11hfCxF4_Ep-RvzLRL7Xw!`,
  //   },
  //   {
  //     enName: "Advertisements",
  //     arName: "الإعلانات",
  //     url: `https://ir.egidegypt.com/${language}/announcements/7-tepwdJytBe0rvfaygq7r11hfCxF4_Ep-RvzLRL7Xw!`,
  //   },
  //   {
  //     enName: "News",
  //     arName: "الأخبار",
  //     url: `https://ir.egidegypt.com/${language}/news/7-tepwdJytBe0rvfaygq7r11hfCxF4_Ep-RvzLRL7Xw!`,
  //   },
  //   {
  //     enName: "Board of Directors",
  //     arName: "مجلس الإدارة",
  //     url: `https://ir.egidegypt.com/${language}/boardofdirectors/7-tepwdJytBe0rvfaygq7r11hfCxF4_Ep-RvzLRL7Xw!`,
  //   },
  //   {
  //     enName: "Corporate Procedures",
  //     arName: "إجراءات الشركات",
  //     url: `https://ir.egidegypt.com/${language}/corporateactions/7-tepwdJytBe0rvfaygq7r11hfCxF4_Ep-RvzLRL7Xw!`,
  //   },
  //   {
  //     enName: "Disclosures",
  //     arName: "الإفصاحات",
  //     url: `https://ir.egidegypt.com/${language}/disclosures/7-tepwdJytBe0rvfaygq7r11hfCxF4_Ep-RvzLRL7Xw!`,
  //   },
  //   {
  //     enName: "Governance",
  //     arName: "الحوكمة",
  //     url: `https://ir.egidegypt.com/${language}/governance/7-tepwdJytBe0rvfaygq7r11hfCxF4_Ep-RvzLRL7Xw!`,
  //   },
  //   {
  //     enName: "Calculator",
  //     arName: "الحاسبة",
  //     url: `https://ir.egidegypt.com/${language}/calculator/7-tepwdJytBe0rvfaygq7r11hfCxF4_Ep-RvzLRL7Xw!`,
  //   },
  //   {
  //     enName: "About the company",
  //     arName: "نبذة عن الشركة",
  //     url: `https://ir.egidegypt.com/${language}/companyprofile/7-tepwdJytBe0rvfaygq7r11hfCxF4_Ep-RvzLRL7Xw!`,
  //   },
  //   {
  //     enName: "Internal transactions",
  //     arName: "المعاملات الداخلية",
  //     url: `https://ir.egidegypt.com/${language}/insidertransactions/7-tepwdJytBe0rvfaygq7r11hfCxF4_Ep-RvzLRL7Xw!`,
  //   },
  //   {
  //     enName: "Investor Relations Contacts",
  //     arName: "جهات اتصال علاقات المستثمرين",
  //     url: `https://ir.egidegypt.com/${language}/ircontacts/7-tepwdJytBe0rvfaygq7r11hfCxF4_Ep-RvzLRL7Xw!`,
  //   },
  //   {
  //     enName: "Financial statements",
  //     arName: "القوائم المالية",
  //     url: `https://ir.egidegypt.com/${language}/financialstatement/7-tepwdJytBe0rvfaygq7r11hfCxF4_Ep-RvzLRL7Xw!`,
  //   },
  // ];

  const handleClick = (url: string) => {
    router.push(`/viewer?url=${encodeURIComponent(url)}`);
  };

  if (isLoading) 
    return (
    <div className="max-w-7xl mx-auto py-16 px-6 text-center text-gray-700">
      <LoadingComponent />
    </div>
  );
  if (isError) 
    return (
      <div className="max-w-7xl mx-auto py-16 px-6 text-center text-gray-700">
        <p>Error loading investors</p>
      </div>);
  if (investors?.data?.length === 0) 
    return 
    <div className="max-w-7xl mx-auto py-16 px-6 text-center text-gray-700">
      <p>No investors found</p>
    </div>;

  return (
    <div className="mt-10" dir={i18n?.language === "ar" ? "rtl" : "ltr"}>
      <h2 className="text-2xl font-bold text-center mb-5 underline">{t("Company Information Hub")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {investors?.data?.map((link: any, index: number) => (
          <button
            key={index}
            onClick={() => handleClick(i18n?.language === "ar" ? link.urlFrmAr : link.urlFrm)}
            className="block w-full bg-gray-50 shadow-md p-6 rounded-lg text-center text-lg font-medium transition transform hover:-translate-y-1 hover:shadow-lg border border-gray-200"
          >
            {i18n?.language === "ar" ? link.titleAr : link.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;
