'use client';

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaStar, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useSelector } from "react-redux";

const reviews = [
  {
    arText: "نحن سعداء للغاية للخدمة المقدمة من شركة المهندس للتأمين ومساعدتنا في الحصول على التعويض في وقت سريع",
    enText:
      "We are very happy with the service provided by Mohandes Insurance and their assistance in obtaining compensation quickly.",
    arAuthor: "محمد مصطفى جمال الدين",
    enAuthor: "Mohamed Mostafa Gamal El-Din",
    arLocation: "القاهرة - مصر",
    enLocation: "Cairo, Egypt",
    rating: 5,
  },
  {
    arText: "خدمة ممتازة وسريعة جدًا، فريق العمل متعاون ويوفر الدعم الكامل",
    enText: "Excellent and very fast service, the team is cooperative and provides full support.",
    arAuthor: "أحمد خالد",
    enAuthor: "Ahmed Khaled",
    arLocation: "الإسكندرية - مصر",
    enLocation: "Alexandria, Egypt",
    rating: 4,
  },
  {
    arText: "أفضل تجربة تأمين، إجراءات سهلة وسرعة في التعامل",
    enText: "The best insurance experience, easy procedures, and quick processing.",
    arAuthor: "محمود علي",
    enAuthor: "Mahmoud Ali",
    arLocation: "الجيزة - مصر",
    enLocation: "Giza, Egypt",
    rating: 5,
  },
];

const ReviewsSection = () => {
  const { t } = useTranslation();
  const { language } = useSelector((state: any) => state.language) || { language: "ar" };
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
  };

  return (
    <section className="max-w-7xl mx-auto py-12 px-6 bg-white p-9 rounded-xl shadow-lg">
      <div className="grid grid-cols-2 gap-2 text-lg text-gray-700">
        <div>
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 relative right-10 top-10">
            {t("Customer reviews")}
          </h2>
          <div className="flex justify-center items-center">
            <img src="/assets/images/reviewImage.png" className="" />
          </div>
          <div className="flex justify-center items-center gap-4 mt-6" dir="ltr">
            <button
              onClick={prevReview}
              className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition shadow-md"
            >
              <FaArrowLeft className="text-gray-800 text-xl" />
            </button>
            <button
              onClick={nextReview}
              className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition shadow-md"
            >
              <FaArrowRight className="text-gray-800 text-xl" />
            </button>
          </div>
        </div>
        <div className=" flex flex-col md:flex-row items-center gap-6">
          {/* Review Content */}
          <div className="flex-1 text-center">
            <p className="text-lg text-gray-700 leading-relaxed">{reviews[currentIndex][`${language}Text` as keyof typeof reviews[0]]}</p>
            <div className="mt-4 flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-xl ${i < reviews[currentIndex].rating ? "text-yellow-500" : "text-gray-300"}`}
                />
              ))}
            </div>
            <p className="mt-2 font-semibold text-blue-600">
              {reviews[currentIndex][`${language}Author` as keyof typeof reviews[0]]} - {reviews[currentIndex][`${language}Location` as keyof typeof reviews[0]]}
            </p>

            {/* Dots Navigation */}
            <div className="flex justify-center mt-4 space-x-2">
              {reviews.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-3 h-3 rounded-full cursor-pointer ${
                    i === currentIndex ? "bg-gray-800" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Buttons */}
    </section>
  );
};

export default ReviewsSection;
