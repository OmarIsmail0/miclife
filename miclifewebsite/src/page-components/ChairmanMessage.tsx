"use client";
import { useGetSectionsBySlugQuery } from "../lib/store/api/mainApi";
import { useTranslation } from "react-i18next";
import LoadingComponent from "../shared/components/LoadingComponent";
import { sanitizeHtml } from "../lib/sanitize";
const ChairmanMessage = () => {
  const { data: sectionsData, isLoading, isError } = useGetSectionsBySlugQuery("CHAIRMAN-MESSAGE");
  const {t, i18n} = useTranslation();
  const message = sectionsData?.blocks[0]?.block;
  if (isLoading) {
    return (
      <section className="flex-1 container mx-auto px-6 lg:px-16 py-10 mt-10 shadow-md rounded-lg" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
        <LoadingComponent />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="flex-1 container mx-auto px-6 lg:px-16 py-10 mt-10 shadow-md rounded-lg" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
        <p className="text-center text-lg text-gray-700">
          {i18n.language === "ar" ? "حدث خطأ أثناء تحميل تفاصيل عضو مجلس الإدارة." : "Unable to load board member details."}
        </p>
      </section>
    );
  }

  if (!message) {
    return (
      <section className="flex-1 container mx-auto px-6 lg:px-16 py-10 mt-10 shadow-md rounded-lg" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
        <p className="text-center text-lg text-gray-700">
          {i18n.language === "ar" ? "لم يتم العثور على معلومات الرئيس." : "Chairman message not available."}
        </p>
      </section>
    );
  }

  return (
    <section
      className="flex-1 container mx-auto px-6 lg:px-16 py-10 mt-10 shadow-md rounded-lg"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="prose max-w-none leading-relaxed text-justify whitespace-normal break-words">
        {/* 🖼️ Image floats inside text area */}
        <img
          src={message.imageUrl ? `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${message.imageUrl}` : ''}
          alt={"Chairman"}
          className={`${
            i18n.language === "ar" ? "float-left mr-6" : "float-right ml-6"
          } mb-4 w-64 h-64 rounded-full object-cover shadow-lg`}
        />

        {/* 📝 Text flows around image */}
        <div
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(message.translations[i18n.language === "ar" ? 1 : 0].description || '', { allowLinks: false })
          }}
        />

        {/* Ensures layout below clears the float */}
        <div className="clear-both" />
      </div>
    </section>
  );
};

export default ChairmanMessage;
