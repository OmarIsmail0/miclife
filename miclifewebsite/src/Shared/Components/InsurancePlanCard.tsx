
"use client";
import DividerComp from "./DividerComp";
import { sanitizeHtml } from "../../lib/sanitize";

interface InsurancePlanCardProps {
  title: string;
  shortDescription?: string;
  fullDescription?: string;
  description?: string;
  image?: string;
  isReversed?: boolean;
  isLast?: boolean;
}

const InsurancePlanCard = ({ title, shortDescription, fullDescription, description, image, isReversed = false, isLast = false }: InsurancePlanCardProps) => {
  return (
    <>
      <div
        className={`grid grid-cols-1  items-center gap-8 container mx-auto px-6 lg:px-16 py-10 mt-10 bg-white shadow-lg rounded-lg
            ${image
            ? isReversed
              ? "md:grid-cols-[1fr_2fr] md:flex-row-reverse"
              : "md:grid-cols-[2fr_1fr]"
            : "md:grid-cols-1"
          }
        `}
      >
        {isReversed ? (
          <>
            {image !== null && (
              <div className="flex justify-start">
                <img src={image} alt={`${title} - Al Mohandes Insurance`} className="w-44 md:w-64 lg:w-80 object-contain" />
              </div>
            )}
            <div>
              <h3 className="text-2xl font-bold mb-4">{title}</h3>
              {description || shortDescription && (
                <div className="text-lg text-gray-700 leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(description || shortDescription as string, { allowLinks: false }) }} />
                </div>
              )}
              {fullDescription && (
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(description || fullDescription as string, { allowLinks: false }) }} />

              )}
            </div>
          </>
        ) : (
          <>
            <div>
              <h3 className="text-2xl font-bold mb-4">{title}</h3>
              <div className="text-lg text-gray-700 leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(description || shortDescription as string, { allowLinks: false }) }} />

              </div>
              <div className="text-lg text-gray-700 leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(description || fullDescription as string, { allowLinks: false }) }} />
          
              </div>
            </div>
            {image && (
              <div className="flex justify-end">
                <img src={image} alt={`${title} - Al Mohandes Insurance`} className="w-44 md:w-64 lg:w-80 object-contain" />
              </div>
            )}
          </>
        )}
      </div>
      {!isLast && <DividerComp />}
    </>
  );
};

export default InsurancePlanCard;
