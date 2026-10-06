"use client";

import { useMemo } from "react";
import { useGetBoardDirectorByIdQuery } from "@/src/lib/store/api/mainApi";
import { useTranslation } from "react-i18next";
import LoadingComponent from "./LoadingComponent";
import { sanitizeHtml } from "@/src/lib/sanitize";

const fallbackImage = "/assets/images/board-of-directors.png";

interface BoardDirectorDetailsContentProps {
  id: string;
}

const BoardDirectorDetailsContent = ({ id }: BoardDirectorDetailsContentProps) => {
  const { i18n } = useTranslation();
  const {
    data: boardDirector,
    isLoading,
    isError,
  } = useGetBoardDirectorByIdQuery(id);
  const localized = useMemo(() => {
    if (!boardDirector) return {} as any;
    const selectedMember = boardDirector;
    const translations = selectedMember.translations;
    if (Array.isArray(translations) && translations.length > 0) {
      const index = i18n?.language === "ar" ? 1 : 0;
      const translation = translations[index] ?? translations[0];
      return {
        name: translation?.name ?? selectedMember.name,
        title: translation?.title ?? selectedMember.title,
        description: translation?.description ?? selectedMember.description,
      };
    }

    return {
      name: selectedMember.name,
      title: selectedMember.title,
      description: selectedMember.description,
    };
  }, [boardDirector, i18n?.language]);

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

  if (!boardDirector) {
    return (
      <section className="flex-1 container mx-auto px-6 lg:px-16 py-10 mt-10 shadow-md rounded-lg" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
        <p className="text-center text-lg text-gray-700">
          {i18n.language === "ar" ? "لم يتم العثور على معلومات العضو." : "Board member details not available."}
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
          src={boardDirector.imageUrl ? `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${boardDirector.imageUrl}` : fallbackImage}
          alt={localized.name ?? boardDirector.name ?? "Board Member"}
          className={`${
            i18n.language === "ar" ? "float-left mr-6" : "float-right ml-6"
          } mb-4 w-64 h-64 rounded-full object-cover shadow-lg`}
        />

        {/* 📝 Text flows around image */}
        <div
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(boardDirector.description || '', { allowLinks: false })
          }}
        />

        {/* Ensures layout below clears the float */}
        <div className="clear-both" />
      </div>
    </section>
  );
};

export default BoardDirectorDetailsContent;
