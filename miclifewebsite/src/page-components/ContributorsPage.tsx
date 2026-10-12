import { env } from "@/src/lib/env";
import ContributorsComp from "../Shared/Components/ContributorsComp";
import DividerComp from "../Shared/Components/DividerComp";
import InsurancePlanCard from "../Shared/Components/InsurancePlanCard";

import { useContext } from "react";
import { ContributorContext } from "../Shared/context/ContributorContext";
import { useTranslation } from "react-i18next";
const ContributorsPage = () => {
  const contributorsData = useContext(ContributorContext);
  return (
    <div className="max-w-7xl mx-auto py-16 px-6 space-y-12">
      <ContributorsComp />



      {contributorsData?.map((contributor: any, index: number) => (
        <div key={index}>
          <DividerComp />
          <InsurancePlanCard
            key={index}
            title={contributor.title}
            description={contributor.descrption}
            image={contributor.imageUrl ? `${env.NEXT_PUBLIC_BASE_IMAGE_URL}${contributor.imageUrl}` : undefined}
            isReversed={index % 2 !== 0}
            isLast={index == contributor?.length - 1}
          />
        </div>
      ))}
    </div>
  );
};

export default ContributorsPage;
