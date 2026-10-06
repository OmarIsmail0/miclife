"use client";

import { useContext } from "react";
import { LineOfBusinessContext } from "@/src/shared/context/LineOfBusinessContext";
import { ProductContext } from "@/src/shared/context/ProductContext";
import LifeInsuranceServiceCard from "@/src/shared/components/LifeInsuranceServiceCard";

export default function InsuranceBySlugClient({ slug }: { slug: string }) {
  const lineOfBusinessList = useContext(LineOfBusinessContext);
  const productsList = useContext(ProductContext);
  const productListByLineOfBusiness = productsList?.filter((p: any) => p.slug === slug);

  if (!slug || !lineOfBusinessList) return null;
  
  return (
    <div className="min-h-screen ">
    {/* Hero Section */}
    {/* <LifeInsuranceHero /> */}

    {/* Services Section */}
    <section className="max-w-[80vw] mx-auto py-16 px-6">
      <div className="space-y-8">
        {productListByLineOfBusiness?.map((service: any, index: number) => (
          <div key={service.id}>
            <LifeInsuranceServiceCard
              service={service}
              isReversed={index % 2 !== 0}
            />
          </div>
        ))}
      </div>
    </section>
  </div>
  );
}

