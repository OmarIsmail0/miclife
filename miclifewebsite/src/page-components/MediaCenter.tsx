"use client";
import { useState } from "react";
import {
  FaNewspaper,
  FaImages,
  FaVideo,
  FaPlay,
  FaAward,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import colorscm from "../shared/constants/colorscm";
import "../shared/styles/FooterCmp.css";
import { useGetAllMediaAlbumQuery } from "../lib/store/api/mainApi";
import LoadingComponent from "../shared/components/LoadingComponent";
import { sanitizeHtml } from "../lib/sanitize";

const mediaTabs = [
  { key: "news", icon: <FaNewspaper />, index: 0 },
  { key: "images", icon: <FaImages />, index: 1 },
  { key: "videos", icon: <FaVideo />, index: 2 },
  { key: "awards", icon: <FaAward />, index: 3 },
];



const MediaCenter = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { t, i18n } = useTranslation();

  const { data: mediaAlbum, isLoading, isError } = useGetAllMediaAlbumQuery({});

  const mediaImages: { src: string; alt: string }[] = [];
  mediaAlbum?.filter((item: any) => item.type === 1)?.forEach((item: any) => {
    if (item.images.length > 0) {
      item.images.forEach((image: any) => {
        mediaImages.push({
          src: `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${image.filePath}`,
          alt: image.fileName,
        });
      });
    }
  });

  const mediaVideos: { src: string; alt: string }[] = [];
  mediaAlbum?.filter((item: any) => item.type === 2)?.forEach((item: any) => {
    if (item.images.length > 0) {
      item.images.forEach((video: any) => {
        mediaVideos.push({
          src: `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${video.filePath}`,
          alt: video.fileName,
        });
      });
    }
  });

  const mediaAwards: { src: string; alt: string }[] = [];
  mediaAlbum?.filter((item: any) => item.type === 3)?.forEach((item: any) => {
    if (item.images.length > 0) {
      item.images.forEach((image: any) => {
        mediaAwards.push({
          src: `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${image.filePath}`,
          alt: image.fileName,
        });
      });
    }
  });

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handlePrevImage = (mediaImages: any[]) => {
    setSelectedImage((prev) => (prev === 0 ? mediaImages.length - 1 : (prev || 0) - 1));
  };

  const handleNextImage = (mediaImages: any[]) => {
    setSelectedImage((prev) => (prev === mediaImages.length - 1 ? 0 : (prev || 0) + 1));
  };

  const handleCarouselPrev = (mediaImages: any[]) => {
    setCurrentImageIndex((prev) => (prev === 0 ? mediaImages.length - 1 : prev - 1));
  };

  const handleCarouselNext = (mediaImages: any[]) => {
    setCurrentImageIndex((prev) => (prev === mediaImages.length - 1 ? 0 : prev + 1));
  };
  if (isLoading) 
    return (
      <div className="max-w-7xl mx-auto py-16 px-6 text-center text-gray-700">
        <LoadingComponent />
      </div>
    );
  if (isError) return (
    <div className="max-w-7xl mx-auto py-16 px-6 text-center text-gray-700">
      <p>Error loading media album</p>
    </div>
  );
  return (
    <section className="max-w-6xl mx-auto py-12 px-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">{t("mediaCenter.title")}</h2>
      <p className="text-center text-gray-600 mb-6">{t("mediaCenter.description")}</p>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6 px-4">
        {mediaTabs.map((tab) => (
          <button
            key={tab.key}
            style={{ "--primary-color": "#0B572A", "--secondary-color": colorscm.secondary } as React.CSSProperties}
            onClick={() => setActiveTab(tab.index)}
            className={`flex items-center gap-1 md:gap-2 md:px-4 rounded-full dynamicBtn-hover text-sm md:text-base ${activeTab === tab.index && "active"
              } transition`}
          >
            {/* Mobile: Circular icon button */}
            <div className="md:hidden w-16 h-16 rounded-full flex items-center justify-center">
              <div className="text-xl ">{tab.icon}</div>
            </div>

            {/* Desktop: Original design */}
            <div className="hidden md:flex items-center gap-2">
              {tab.icon} {t(`mediaCenter.tabs.${tab.key}`)}
            </div>
          </button>
        ))}
      </div>

      {/* News Section */}
      {activeTab === mediaTabs[0].index && (
        <>
          {mediaAlbum?.filter((item: any) => item.type === activeTab).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mediaAlbum?.filter((item: any) => item.type === activeTab).map((news: any, index: number) => (
                <div key={index} className="bg-white p-4 shadow-md rounded-lg hover:shadow-lg transition">
                  <div className="w-full h-40 bg-gray-200 rounded-md overflow-hidden">
                    <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${news?.images[0]?.filePath}`} alt={news?.translations[i18n.language === 'ar' ? 1 : 0]?.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-lg font-semibold mt-3 text-gray-800">{news?.translations[i18n.language === 'ar' ? 1 : 0]?.name}</h3>
                  <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: sanitizeHtml(news?.translations[i18n.language === 'ar' ? 1 : 0]?.description) }}></p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t("mediaCenter.emptyStates.news")}</p>
            </div>
          )}
        </>
      )}

      {/* Images Section */}
      {activeTab === 1 && (
        <>
          {mediaImages.length > 0 ? (
            <div className="space-y-6">
              {/* Main Carousel */}
              <div className="relative">
                <div className="relative h-[500px] rounded-lg overflow-hidden">
                  {mediaImages[currentImageIndex] && (
                    <img
                      src={mediaImages[currentImageIndex].src}
                      alt={mediaImages[currentImageIndex].alt}
                      className="w-full h-full object-contain bg-gray-100"
                    />
                  )}
                  <button
                    onClick={() => handleCarouselPrev(mediaImages)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all"
                  >
                    <FaChevronLeft className="text-2xl" />
                  </button>
                  <button
                    onClick={() => handleCarouselNext(mediaImages)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all"
                  >
                    <FaChevronRight className="text-2xl" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
                  {currentImageIndex + 1} / {mediaImages.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {mediaImages.map((image: { src: string; alt: string }, index: number) => (
                  <div
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden cursor-pointer transition-all ${currentImageIndex === index ? "ring-4 ring-green-500" : "hover:opacity-80"
                      }`}
                  >
                    <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t("mediaCenter.emptyStates.images")}</p>
            </div>
          )}
        </>
      )}

      {/* Video Section */}
      {activeTab === 2 && (
        <>
          {mediaVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaVideos.map((video, index) => (
                <div key={index} className="relative w-full cursor-pointer">
                  <video
                    className="w-full rounded-lg shadow-md"
                    controls
                    poster="/assets/images/media/video-thumbnail.jpg"
                  >
                    <source
                      src={`${video.src}`}
                      type="video/mp4"
                    />
                  </video>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t("mediaCenter.emptyStates.videos")}</p>
            </div>
          )}
        </>
      )}

      {/* Awards Section */}
      {activeTab === 3 && (
        <>
          {mediaAwards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaAwards.map((award, index) => (
                <div key={index} className="bg-white p-4 shadow-md rounded-lg hover:shadow-lg transition">
                  <div className="w-full h-64 bg-gray-200 rounded-md overflow-hidden">
                    <img
                      src={award.src}
                      alt={award.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* <h3 className="text-lg font-semibold mt-3 text-gray-800">{award.alt}</h3> */}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t("mediaCenter.emptyStates.awards")}</p>
            </div>
          )}
        </>
      )}

      {/* Image Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <button
            onClick={handleCloseModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <FaTimes className="text-3xl" />
          </button>
          <button
            onClick={() => handlePrevImage(mediaImages)}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors"
          >
            <FaChevronLeft className="text-4xl" />
          </button>
          <button
            onClick={() => handleNextImage(mediaImages)}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors"
          >
            <FaChevronRight className="text-4xl" />
          </button>
          <div className="max-w-4xl max-h-[90vh] mx-auto">
            <img
              src={mediaImages[selectedImage].src}
              alt={mediaImages[selectedImage].alt}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
            {selectedImage + 1} / {mediaImages.length}
          </div>
        </div>
      )}
    </section>
  );
};

export default MediaCenter;
