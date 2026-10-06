"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import ProductDescription from "../shared/components/InsuranceDescription";
import DividerComp from "../shared/components/DividerComp";
import { useGetSectionsBySlugQuery } from "../lib/store/api/mainApi";
import LoadingComponent from "../shared/components/LoadingComponent";
import { sanitizeHtml } from "../lib/sanitize";

const SocialResponsibilityPage = () => {
  const { language } = useSelector((state: any) => state.language);
  

const {
  data: sectionsData,
  isLoading,
  isError,
} = useGetSectionsBySlugQuery("SOCIAL-RESPONSIBILITY");

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-6 text-center text-gray-700">
        <LoadingComponent />
      </div>
    );
  }

  if (isError) {
    const message =
      language === "ar"
        ? "حدث خطأ أثناء تحميل بيانات المسؤولية المجتمعية."
        : "Unable to load social responsibility data.";
    return (
      <div className="max-w-7xl mx-auto py-16 px-6 text-center text-gray-700">
        {message}
      </div>
    );
  }

  return  (
    <>
    {sectionsData?.blocks.length > 0 && (
     <section className="max-w-7xl mx-auto py-16 px-6 space-y-12" dir={language === "ar" ? "rtl" : "ltr"}>
     
     {sectionsData?.blocks.length > 0 && (
        (sectionsData?.blocks as []).filter((block: any) => {
          return block.block.displayOrder === 1;
        })?.map((block: any, index: number) => (
          <ProductDescription
            key={index}
            title={block.block.translations?.[language === "ar" ? 1 : 0]?.title as string}
            description={block.block.translations?.[language === "ar" ? 1 : 0]?.description as string}
            image={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${block.block.imageUrl}`}
          />
        ))
      )}
     

     <DividerComp />

     {/* Key Sections */}
     {sectionsData?.blocks.length > 0 && (
      (sectionsData?.blocks as []).filter((block: any) => {
        return block.block.displayOrder > 1 && block.block.displayOrder <= 4;
      })?.map((block: any, index: number) => (
        
     <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
     <div>
       {sectionsData?.blocks?.filter((block: any) => {
         return block.block.displayOrder > 1 && block.block.displayOrder <= 4;
       })?.map((block: any, index: number) => (
         <div key={index} className="p-6 rounded-lg mb-10 shadow-md text-center">
           <h3 className="text-xl font-semibold text-gray-800 mb-2">{block.block.translations?.[language === "ar" ? 1 : 0]?.title as string}</h3>
           <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.block.translations?.[language === "ar" ? 1 : 0]?.description as string, { allowLinks: false }) }} />
         </div>
       ))}
     </div>
     <div className="flex justify-center">
       <img src={"/assets/images/social-section.svg"} alt={"section"} className="object-contain" />
     </div>
   </div>
      ))
     )}

     {/* Impact Areas */}
    {sectionsData?.blocks.length > 4 && (
      <>
      <DividerComp />
       <div className="mt-16 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
       <div>
         {sectionsData?.blocks?.filter((block: any) => {
           return block.block.displayOrder > 4 && block.block.displayOrder <= 7;
         })?.map((block: any, index: number) => (
           <div key={index} className="flex items-center mb-10 bg-white shadow-md rounded-lg p-6">
             <div className="flex-1">
               <h3 className="text-2xl font-semibold mb-2">{block.block.translations?.[language === "ar" ? 1 : 0]?.title as string}</h3>
               <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.block.translations?.[language === "ar" ? 1 : 0]?.description as string, { allowLinks: false }) }} />
             </div>
           </div>
         ))}
       </div>
       <div className="flex justify-center">
         <img src={"/assets/images/social-area.svg"} alt={"area"} className="object-contain" />
       </div>
     </div>
     </>
    )}
   </section>
    )}
    </>
  );
};

export default SocialResponsibilityPage;
