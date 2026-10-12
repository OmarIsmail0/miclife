import ContributorsComp from "../Shared/Components/ContributorsComp";
import QuickLinks from "../Shared/Components/QuickLinks";
import { useTranslation } from "react-i18next";



const InvestorRelationsPage = () => {
  const { t } = useTranslation();


  return (
    <div className="container mx-auto p-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 text-center underline mb-5 mt-10">
          {t("financialUpdates.shareholderStructure")}
        </h2>
        <ContributorsComp />
      </div>

      <QuickLinks />
    </div>
  );
};

export default InvestorRelationsPage;
