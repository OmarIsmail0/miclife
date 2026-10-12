import HomeHeaderCmp from "./HomeHeaderCmp";
import { useSelector } from "react-redux";
import FooterCmp from "./FooterCmp";
import { useGetAllContributorsQuery, useGetAllLineOfBusinessQuery, useGetAllProductsQuery } from "@/src/lib/store/api/mainApi";
import { LineOfBusinessContext } from "@/src/Shared/context/LineOfBusinessContext";
import { ProductContext } from "@/src/Shared/context/ProductContext";
import { ContributorContext } from "@/src/Shared/context/ContributorContext";
import { Suspense } from "react";
import NavigationProgress from "./NavigationProgress";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { direction } = useSelector((state: any) => state.language) || { direction: "rtl" };
  const { data: lineOfBusiness } = useGetAllLineOfBusinessQuery(
    {
      IsActive: true,
      PageNumber: 1,
      PageSize: 10,
    }
  );
  
  const { data: products } = useGetAllProductsQuery(
    {
      IsActive: true,
      PageNumber: 1,
      PageSize: 10,
    }
  );

  const { data: contributors } = useGetAllContributorsQuery(
    {
      IsActive: true,
      PageNumber: 1,
      PageSize: 10,
    }
  );
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
