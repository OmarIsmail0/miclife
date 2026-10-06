"use client";
import { useGetAllBranchesQuery } from "@/src/lib/store/api/mainApi";
import { useTranslation } from "react-i18next";
import LoadingComponent from "./LoadingComponent";
import { sanitizeHtml } from "@/src/lib/sanitize";

const BranchesComp = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;

  const {
    data: branchesResponse,
    isLoading,
    isError,
  } = useGetAllBranchesQuery({
    IsActive: true,
    PageNumber: 1,
    PageSize: 50,
  });

  const branches = branchesResponse?.data ?? [];
  const mainBranch = branchesResponse?.data?.[0];
  const otherBranches = branchesResponse?.data?.slice(1) ?? [];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-6 text-center text-gray-700">
        <LoadingComponent />
      </div>
    );
  }

  if (isError || !branches.length) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-6 text-center text-gray-700">
        {language === "ar" ? "لم يتم العثور على بيانات الفروع." : "Branch data is not available."}
      </div>
    );
  }

  const resolveValue = (branch: any, key: string) => {
    if (!branch) return "";
    if (branch.translations && Array.isArray(branch.translations)) {
      const index = language === "ar" ? 1 : 0;
      const translation = branch.translations[index] ?? branch.translations[0];
      if (translation && key in translation) {
        return translation[key];
      }
    }
    return branch[key];
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-10">{t("branches.company_branches")}</h1>


      <div className="bg-white shadow-lg rounded-lg p-6 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-300 pb-3 mb-4">
          {resolveValue(mainBranch, "title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {mainBranch.descrption && (
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(mainBranch.descrption, { allowLinks: true }) }} />
          )}
          <div className="flex justify-end">
            <img src="/assets/images/branches.svg" className="object-contain w-60 h-auto" />
          </div>
        </div>
      </div>
      {/* Other Branches */}
      {otherBranches.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {otherBranches.map((branch: any, index: number) => (
            <div key={branch.id ?? index} className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {resolveValue(branch, "title")}
              </h3>
              <div className="space-y-2 text-gray-700">
                {branch.descrption && (
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(branch.descrption, { allowLinks: true }) }} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BranchesComp;
