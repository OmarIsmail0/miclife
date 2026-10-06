"use client";
import { useTranslation } from "react-i18next";
import colorscm from "../constants/colorscm";
import { useState, useEffect } from "react";


const ContactSection = () => {
  const { t, i18n } = useTranslation();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  return (
    <div className="text-center" dir="rtl">
        <div
          style={{
            backgroundImage: isDesktop ? `url(assets/miclife/contactus-bg.png)` : 'none',
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            objectFit: "none",
          }}
          className="flex flex-col lg:flex-row min-h-[80vh] lg:bg-white bg-[#156931] lg:bg-cover lg:bg-center"
        >
          <div className="w-full p-4 md:p-6 mt-10 lg:p-8 flex flex-col lg:mb-16 items-center lg:items-start">
            <h2 className="text-2xl md:text-3xl lg:text-3xl text-white font-bold mb-6 md:mb-8 lg:mb-10 text-center lg:pr-16">
              {t("customerService.title")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 max-w-6xl " dir={i18n.language === "ar" ? "rtl" : "ltr"}>
              {/* Phone Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 md:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group md:col-span-2 lg:col-span-2">
                <div className="flex flex-col items-center space-y-3">
                  <div className="bg-white/20 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="text-center w-full">
                    <p className="text-white/90 text-sm md:text-base mb-2">{t("contact us on the number")}</p>
                    <a 
                      href="tel:19318"
                      className="text-white font-bold text-xl md:text-2xl lg:text-3xl hover:text-yellow-300 transition-colors duration-300 block"
                    >
                      19318
                    </a>
                  </div>
                </div>
              </div>

              {/* WhatsApp Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 md:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="flex flex-col items-center space-y-3">
                  <div className="bg-white/20 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div className="text-center w-full">
                    <p className="text-white/90 text-sm md:text-base mb-2">{t("contact us on the whatsapp")}</p>
                    <a
                      href="https://wa.me/201034343048"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white font-bold text-xl md:text-2xl lg:text-3xl hover:text-green-300 transition-colors duration-300 block"
                      dir="ltr"
                    >
                      010 3434 3048
                    </a>
                  </div>
                </div>
              </div>

              {/* Email Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 md:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="flex flex-col items-center space-y-3">
                  <div className="bg-white/20 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-center w-full">
                    <p className="text-white/90 text-sm md:text-base mb-2">{t("contact us on the email")}</p>
                    <a 
                      href="mailto:info@mohins.com"
                      className="text-white font-bold text-lg md:text-xl lg:text-2xl hover:text-blue-300 transition-colors duration-300 block break-all"
                    >
                      info@mohins.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left Section (Image + Icons) */}
          
          {/* <div className="w-full lg:w-1/2 p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center">
            <div className="w-full max-w-sm lg:max-w-none">
              {/* Contact Items Grid 
              <div className="grid gap-3 md:gap-4 lg:gap-6">
                {/* Email 
                <div className="flex justify-center  items-center gap-3 md:gap-4">
                  <span className="text-xs md:text-sm lg:text-sm text-black font-medium">E-MAIL ADDRESS</span>
                  <div className="bg-[#207bbf] p-2 md:p-2 lg:p-2 rounded-full">
                    <a href="mailto:info@mohins.com">
                      <img
                        src="/assets/images/email.svg"
                        alt="email"
                        className="w-5 h-5 md:w-6 md:h-6 lg:w-6 lg:h-6 cursor-pointer"
                        onClick={() => (window.location.href = "mailto:info@example.com")}
                      />
                    </a>
                  </div>
                </div>

                {/* Phone 
                <div className="flex justify-center items-center gap-3 md:gap-4">
                  <span className="text-xs md:text-sm lg:text-sm text-black font-medium">PHONE NUMBER</span>
                  <div className="bg-[#207bbf] p-2 md:p-2 lg:p-2 rounded-full">
                    <a href="tel:01016497055">
                      <img
                        src="/assets/images/phone.svg"
                        alt="phone"
                        className="w-5 h-5 md:w-6 md:h-6 lg:w-6 lg:h-6 cursor-pointer"
                        onClick={() => (window.location.href = "tel:01016497055")}
                      />
                    </a>
                  </div>
                </div>

                {/* Location 
                <div className="flex justify-center pr-10 items-center gap-3 md:gap-4">
                  <span className="text-xs md:text-sm lg:text-sm text-black font-medium">LOCATION</span>
                  <div className="bg-[#207bbf] p-2 md:p-2 lg:p-2 rounded-full">
                    <a href="https://www.google.com/maps?q=30.0444,31.2357" target="_blank" rel="noopener noreferrer">
                      <img
                        src="/assets/images/location.svg"
                        alt="location"
                        className="w-5 h-5 md:w-6 md:h-6 lg:w-6 lg:h-6 cursor-pointer"
                        onClick={() => window.open("https://www.google.com/maps?q=30.0444,31.2357", "_blank")}
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div> 
          */}
        </div>
      </div>
  );
};

export default ContactSection;
