"use client";

import { useContext } from "react";
import { ProductContext } from "@/src/shared/context/ProductContext";
import LifeInsuranceServiceDetailPage from "../../../page-components/LifeInsuranceServiceDetailPage";

export default function InsuranceDetailBySlugClient({ slug }: { slug: string }) {
  const productsList = useContext(ProductContext);
  const productByLineOfBusiness = productsList.find((p: any) => p.slug === slug) ?? null;

  return (
    <>
      <LifeInsuranceServiceDetailPage product={productByLineOfBusiness}/>
    </>
  );
}

