"use client";
import { useTranslation } from "react-i18next";
import { useGetAllBoardDirectorsQuery } from "@/src/lib/store/api/mainApi";
import Link from "next/link";
import LoadingComponent from "../shared/components/LoadingComponent";

const BoardDirectorsPage = () => {
  const { t, i18n } = useTranslation();
  const {
    data: boardDirectors,
    isLoading,
    isError,
  } = useGetAllBoardDirectorsQuery({});
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-6 text-center text-gray-700">
        <LoadingComponent />
      </div>
    );
  }

  if (isError || !boardDirectors?.data?.length) {
    const message =
      i18n.language === "ar"
        ? "حدث خطأ أثناء تحميل بيانات أعضاء مجلس الإدارة."
        : "Unable to load board directors data.";
    return (
      <div className="max-w-7xl mx-auto py-16 px-6 text-center text-gray-700">
        {message}
      </div>
    );
  }

  return (
    <section className=" text-center">
      <div
        style={{
          backgroundImage: `url(/assets/images/board-background.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          objectFit: "cover",
        }}
        className="contain-content h-[35vh] mb-10 mt-2"
      />
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-7"> {t("Board Members")} </h2>
        {/* Board Members */}
        {/* <div className="grid-cols-1 sm:grid-cols-3 gap-8 mb-8 flex justify-center ">
          {boardMembers.slice(0, 2).map((member, index) => (
            <Link
              key={index}
              href={member.link || "#"}
              className="dynamic-hover text-white flex flex-col w-[50%] items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <img
                src={member.image}
                alt={member[`${language}Name` as keyof typeof member]}
                className="w-40 h-40 object-fit rounded-lg shadow-md"
              />
              <h3 className="text-lg font-semibold mt-4 text-gray-800">{member[`${language}Name` as keyof typeof member]}</h3>
              <p className="text-sm text-blue-600 font-medium mt-1">{member[`${language}Role` as keyof typeof member]}</p>
            </Link>
          ))}
        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {boardDirectors?.data?.map((member: any, index: number) => (
            <Link
              key={index}
              href={`/board-directors-details/${member.id}`}
              className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${member.iconUrl}`}
                alt={member.name}
                className="w-40 h-40 object-fit rounded-lg shadow-md"
              />
              <h3 className="text-lg font-semibold mt-4 text-gray-800">{member.name}</h3>
              <p className="text-sm text-blue-600 font-medium mt-1">{member.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BoardDirectorsPage;
