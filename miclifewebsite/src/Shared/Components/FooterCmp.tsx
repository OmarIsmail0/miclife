'use client';
import "../styles/FooterCmp.css";
import colorscm from "../constants/colorscm";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Service {
  title: string;
  link: string;
}

interface SocialItem {
  title: string;
  link: string;
}

interface AboutItem {
  title: string;
  link: string;
  btn: boolean;
}

const services: Service[] = [
  {
    title: "individual insurance",
    link: "/individual-insurance",
  },
  {
    title: "corporate insurance",
    link: "/corporate-insurance",
  },
];

const social: SocialItem[] = [
  {
    title: "News",
    link: "/media-center",
  },
  {
    title: "Awards",
    link: "/media-center",
  },
  {
    title: "Images",
    link: "/media-center",
  },
  {
    title: "Videos",
    link: "/media-center",
  },
];

const FooterCmp = () => {
  const { t } = useTranslation();
  const { direction, language } = useSelector((state: any) => state.language) || { direction: "rtl", language: "ar" };
  const router = useRouter();
  
  const handleClick = (url: string) => {
    router.push(`/viewer?url=${encodeURIComponent(url)}`);
  };

  const aboutus: AboutItem[] = [
    {
      title: "About Us",
      link: "/aboutus",
      btn: false,
    },
    {
      title: "Board of Directors",
      link: "/board",
      btn: false,
    },
    {
      title: "Contributors",
      link: "/contributors",
      btn: false,
    },
    {
      title: "Governance",
      link: `https://ir.egidegypt.com/${language}/governance/7-tepwdJytBe0rvfaygq7r11hfCxF4_Ep-RvzLRL7Xw!`,
      btn: true,
    },
    {
      title: "Financial Reports",
      link: `https://ir.egidegypt.com/${language}/financialstatement/7-tepwdJytBe0rvfaygq7r11hfCxF4_Ep-RvzLRL7Xw!`,
      btn: true,
    },
  ];

  return (
    <>
      <footer dir="rtl" className="text-white px-6 lg:px-16 py-10" style={{ backgroundColor: colorscm.primaryLight }}>
        <div
          className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 text-sm"
          style={{
            "--primary-color": "white",
            "--secondary-color": colorscm.secondary,
          } as React.CSSProperties}
          dir={direction}
        >
          {/* Column 1 - Company Summary */}
          <div
            className={`text-sm 
            ${direction === "rtl" ? "border-l" : "border-r"} 
            border-white pr-4`}
          >
            <h3 className="text-lg font-semibold text-white mb-2">{t("Company")}</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-white">{t("meunItems.Company purpose")}</span>
              </li>
              <li>
                <span className="text-white">{t("meunItems.Company term")}</span>
              </li>
              <li>
                <span className="text-white">{t("meunItems.Law governing")}</span>
              </li>
            </ul>
          </div>

          {/* Column 2 - About */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{t(`meunItems.Our Company`)}</h3>
            <ul className="space-y-2">
              {aboutus.map((e, index) => (
                <li key={index}>
                  {e.btn ? (
                    <button onClick={() => handleClick(e.link)} className="dynamic-hover cursor-pointer text-white">
                      {t(`meunItems.${e.title}`)}
                    </button>
                  ) : (
                    <Link href={e.link} className="dynamic-hover text-white">
                      {t(`meunItems.${e.title}`)}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Insurance Programs */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{t("meunItems.Mohandes Insurance Programs")}</h3>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <Link href={service.link} className="dynamic-hover text-white">
                    {t(`meunItems.${service.title}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Media Center */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{t("meunItems.Media Center")}</h3>
            <ul className="space-y-2">
              {social.map((e, index) => (
                <li key={index}>
                  <Link href={e.link} className="dynamic-hover text-white">
                    {t(`meunItems.${e.title}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5 - Jobs */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{t("meunItems.Jobs")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/job-opportunities" className="dynamic-hover text-white">
                  {t("meunItems.Job opportunities")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
      {/* Footer Bottom Bar */}
      <div
        dir={direction}
        className="border-t border-gray-300 px-6 lg:px-16 py-4"
        style={{ backgroundColor: colorscm.white } as React.CSSProperties}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Right Side - Social Icons and "تابعنا" */}
          <div className="flex items-center gap-4">
            <span className="text-gray-800 font-medium">{t("footer.follow")}</span>
            <div className="flex gap-3">
              <div
                className="flex space-x-4 "
                style={{
                  "--primary-color": colorscm.primary,
                  "--secondary-color": colorscm.secondary,
                } as React.CSSProperties}
              >
                <a
                  href="https://www.facebook.com/share/1EWqGYyfy9/?mibextid=wwXIfr"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/assets/images/social-media/facebook.svg" alt="facebook" width={40} />
                </a>
                <a
                  href="https://www.instagram.com/mohandes_insurance_co?igsh=MTkwZmR4bHJ6bGg5dg=="
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/assets/images/social-media/instagram.svg" alt="instagram" width={40} />
                </a>
                <a href="#" aria-label="YouTube">
                  <img src="/assets/images/social-media/youtube.svg" alt="youtube" width={40} />
                </a>
                <a
                  href="https://www.linkedin.com/company/mohandes-insurance/?viewAsMember=true"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/assets/images/social-media/linkedin.svg" alt="linkedin" width={40} />
                </a>
                <a aria-label="Whatsapp" href="https://wa.me/201013333627" target="_blank" rel="noopener noreferrer">
                  <img src="/assets/images/social-media/whatsapp.svg" alt="whatsapp" width={40} />
                </a>
              </div>
            </div>
          </div>

          {/* Center Links */}
          <div className="flex flex-wrap gap-6 text-gray-700 text-sm">
            <Link href="/branches" className="hover:underline">
              {t("footer.location")}
            </Link>
            <Link href="#" className="hover:underline">
              {t("footer.customer guide")}
            </Link>
          </div>

          {/* Chat Button */}
          <div>
            <a href="https://wa.me/201013333627" target="_blank" rel="noopener noreferrer">
              <button className="bg-orange-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-orange-700 transition">
                {t("footer.chat")}
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default FooterCmp;
