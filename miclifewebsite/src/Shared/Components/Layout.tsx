"use client";
import HomeHeaderCmp from "./HomeHeaderCmp";
import { useSelector } from "react-redux";
import FooterCmp from "./FooterCmp";
import { useGetAllContributorsQuery, useGetAllLineOfBusinessQuery, useGetAllProductsQuery } from "@/src/lib/store/api/mainApi";
import { LineOfBusinessContext } from "@/src/shared/context/LineOfBusinessContext";
import { ProductContext } from "@/src/shared/context/ProductContext";
import LoadingComponent from "./LoadingComponent";
import { ContributorContext } from "@/src/shared/context/ContributorContext";
import { Suspense } from "react";
import NavigationProgress from "./NavigationProgress";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { direction } = useSelector((state: any) => state.language) || { direction: "rtl" };
  const { data: lineOfBusiness, isLoading, isError } = useGetAllLineOfBusinessQuery(
    {
      IsActive: true,
      PageNumber: 1,
      PageSize: 10,
    }
  );
  
  const { data: products, isLoading: isLoadingProducts, isError: isErrorProducts } = useGetAllProductsQuery(
    {
      IsActive: true,
      PageNumber: 1,
      PageSize: 10,
    }
  );

  const { data: contributors, isLoading: isLoadingContributors, isError: isErrorContributors } = useGetAllContributorsQuery(
    {
      IsActive: true,
      PageNumber: 1,
      PageSize: 10,
    }
  );
  if (isLoading || isLoadingProducts || isLoadingContributors) return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingComponent />
    </div>
  );
  if (isError && isErrorProducts && isErrorContributors) return <div>Error</div>;
  return (
    <LineOfBusinessContext.Provider value={lineOfBusiness?.data ?? []}>
      <ContributorContext.Provider value={contributors?.data ?? []}>
      <ProductContext.Provider value={products?.data ?? []}>
        {/* Navigation Progress Indicator */}

      <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <div dir={direction} className="flex flex-col min-h-screen">
          {/* Header Section */}
          { <HomeHeaderCmp /> }

          {/* Main Content (Body) */}
          <main className={`pb-10 mt-20 lg:mt-28`}>{children}</main>

          {/* Footer Section - will be added later */}
          <FooterCmp />
        </div>
      </ProductContext.Provider>
      </ContributorContext.Provider>
    </LineOfBusinessContext.Provider>
  );
};

export default Layout;
