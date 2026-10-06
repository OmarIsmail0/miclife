'use client';

import React from "react";
import { useLanguage } from "../../lib/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import colorscm from "../constants/colorscm";

interface QuarterData {
  quarter: string;
  links: string[];
}

interface ReportData {
  documentId: string;
  nameArabic?: string;
  nameEnglish?: string;
  quarters: {
    [key: string]: QuarterData[];
  };
}

interface TableCompProps {
  headers: string[];
  data: ReportData[];
}

const TableComp = ({ headers = [], data }: TableCompProps) => {
  const { language } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
      <table className="w-full table-fixed bg-white divide-y divide-gray-200">
        {headers.length > 0 && (
          <thead className="bg-gray-100">
            <tr className="text-gray-700 text-md text-center">
              {headers.map((header, index) => (
                <th key={index} className="p-4">
                  {t(header)}
                </th>
              ))}
            </tr>
          </thead>
        )}

        <tbody>
          {data.map((report) => (
            <React.Fragment key={report.documentId}>
              {/* Year Header Row */}
              {report.nameArabic && (
                <tr className="w-full">
                  <td colSpan={headers.length} className="text-center font-bold text-xl text-gray-600 p-4">
                    {language === "ar" ? report.nameArabic : report.nameEnglish}
                  </td>
                </tr>
              )}

              {report.quarters[language].map((quarter, index) => (
                <tr key={index} className={`text-gray-800 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                  <td className="p-4 text-center font-semibold text-blue-900">{quarter.quarter}</td>
                  {quarter.links.map((link) => (
                    <td key={link} className="p-4 text-center">
                      <a
                        target="_blank"
                        href={link}
                        className="dynamic-hover hover:underline transition duration-200"
                        style={{ "--primary-color": "#2563EB", "--secondary-color": colorscm.secondary } as React.CSSProperties}
                        rel="noopener noreferrer"
                      >
                        {t("download")}
                      </a>
                    </td>
                  ))}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComp;
