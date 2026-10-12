import { useContext } from "react";
import { useParams } from "react-router-dom";
import { ProductContext } from "@/src/Shared/context/ProductContext";
import LifeInsuranceServiceDetailPage from "./LifeInsuranceServiceDetailPage";

export default function InsuranceDetailBySlugPage() {
  const { slug } = useParams<{ slug: string }>();
  const productsList = useContext(ProductContext);
  const productByLineOfBusiness = productsList.find((p: any) => p.slug === slug) ?? null;

  return (
    <>
      <LifeInsuranceServiceDetailPage product={productByLineOfBusiness}/>
    </>
  );
}
