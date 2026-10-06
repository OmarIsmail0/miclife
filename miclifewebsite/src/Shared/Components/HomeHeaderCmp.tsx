"use client";
import { useContext, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog, DialogPanel, Popover, PopoverButton, PopoverGroup, PopoverPanel } from "@headlessui/react";
import {
  UsersIcon,
  PresentationChartLineIcon,
  InformationCircleIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { TfiAnnouncement } from "react-icons/tfi";

import { ChevronDownIcon } from "@heroicons/react/20/solid";
// import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { LangAr, LangEng } from "../../lib/features/languageSlice";
import { language } from "../constants/language";
import colorscm from "../constants/colorscm";
import { useTranslation } from "react-i18next";

import "../Styles/HeaderCmp.css";
import { LineOfBusinessContext } from "@/src/shared/context/LineOfBusinessContext";

const menuItems = [
  {
    name: "About Us",
    path: "/about",
    dropdownMenu: [
      {
        name: "Dashboard",
        path: "/",
        icon: (
          <HomeIcon
            aria-hidden="true"
            className="size-6 text-gray-600 group-hover:text-orange-500 active:text-orange-400"
          />
        ),
      },
      {
        name: "Our Story",
        path: "/aboutus",
        icon: (
          <InformationCircleIcon
            aria-hidden="true"
            className="size-6 text-gray-600 group-hover:text-orange-500 active:text-orange-400"
          />
        ),
      },

      {
        name: "Contributors",
        path: "/contributors",
        icon: (
          <PresentationChartLineIcon
            aria-hidden="true"
            className="size-6 text-gray-600 group-hover:text-orange-500 active:text-orange-400"
          />
        ),
      },
      {
        name: "Board of Directors",
        path: "/board",
        icon: (
          <UsersIcon
            aria-hidden="true"
            className="size-6 text-gray-600 group-hover:text-orange-500 active:text-orange-400"
          />
        ),
      },
      {
        name: "Chairman's Speech",
        path: "/chairman",
        icon: (
          <TfiAnnouncement
            aria-hidden="true"
            className="size-6 text-gray-600 group-hover:text-orange-500 active:text-orange-400"
          />
        ),
      },
    ],
  },
  {
    name: "Products",
    path: "/products",
    dropdownMenu: [
      // {
      //   name: "Medical insurance",
      //   path: "/insurance/medical",
      //   icon: (
      //     <HeartIcon
      //       aria-hidden="true"
      //       className="size-6 text-gray-600 group-hover:text-orange-500 active:text-orange-400"
      //     />
      //   ),
      // },
      // {
      //   name: "Property insurance",
      //   path: "/insurance/property",
      //   icon: (
      //     <HomeIcon
      //       aria-hidden="true"
      //       className="size-6 text-gray-600 group-hover:text-orange-500 active:text-orange-400"
      //     />
      //   ),
      // },
      // {
      //   name: "Car insurance",
      //   path: "/insurance/car",
      //   icon: (
      //     <TruckIcon
      //       aria-hidden="true"
      //       className="size-6 text-gray-600 group-hover:text-orange-500 active:text-orange-400"
      //     />
      //   ),
      // },
      // {
      //   name: "Personal accident insurance",
      //   path: "/insurance/personal-accident",
      //   icon: (
      //     <ExclamationTriangleIcon
      //       aria-hidden="true"
      //       className="size-6 text-gray-600 group-hover:text-orange-500 active:text-orange-400"
      //     />
      //   ),
      // },
      // {
      //   name: "Land and sea transport and ship hulls",
      //   path: "/insurance/transport",
      //   icon: (
      //     <PaperAirplaneIcon
      //       aria-hidden="true"
      //       className="size-6 text-gray-600 group-hover:text-orange-500 active:text-orange-400"
      //     />
      //   ),
      // },
      // {
      //   name: "Engineering Insurance",
      //   path: "/insurance/engineering",
      //   icon: (
      //     <WrenchScrewdriverIcon
      //       aria-hidden="true"
      //       className="size-6 text-gray-600 group-hover:text-orange-500 active:text-orange-400"
      //     />
      //   ),
      // },
    ],
  },
  { name: "Investor Relations", path: "/investor-relations" },
  { name: "Our social responsibility", path: "/social-responsibility" },
  { name: "Media Center", path: "/media-center" },
  { name: "contactUs", path: "/contact-us" },
  { name: "Contact Senior Management", path: "/customer-service" },
  // { name: "Payment", path: "/payment" },
];

// const callsToAction = [
//   { name: "Watch demo", path: "/demo", icon: PlayCircleIcon },
//   { name: "Contact sales", path: "/contact", icon: PhoneIcon },
// ];

export default function HomeHeaderCmp() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language: lang, direction } = useSelector((state: any) => state.language) || { language: "ar", direction: "rtl" };
  const dispatch = useDispatch();
  const pathname = usePathname();
  const lineOfBusinessList = useContext(LineOfBusinessContext);
menuItems.find(item => item.name === "Products")!.dropdownMenu = lineOfBusinessList?.map((item: any) => ({
  name: lang === "ar" ? item.translations[1].name : item.translations[0].name,
  path: `/insurance/${item.slug}`,
  
}));
  return (
    <header className="bg-white shadow fixed top-0 left-0 right-0 z-30">
      <nav aria-label="Global" className="mx-auto flex items-center justify-between p-4 md:p-6 ">
        {/* Logo Section */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">MIC</span>
            <img alt="Logo" src="/assets/miclife/miclife.svg" className="h-12 md:h-16 w-auto" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>

        {/* Desktop Navigation */}
        <PopoverGroup className="hidden lg:flex lg:gap-x-10 ">
          {menuItems.map((item) =>
            item.dropdownMenu ? (
              <Popover key={item.name} className="relative">
                <PopoverButton
                  className={`flex items-center ${
                    direction === "rtl" ? "flex-row-reverse" : ""
                  } gap-x-1 text-base lg:text-lg font-semibold transition-colors duration-300 nav-link hover hover:text-orange-500 ${
                    item.dropdownMenu.some((e) => e.path == pathname) && "active"
                  } `}
                >
                  {t(`meunItems.${item.name}`)}
                  <ChevronDownIcon aria-hidden="true" className="size-4 lg:size-5 flex-none text-gray-400" />
                </PopoverButton>
                <PopoverPanel
                  className={`absolute top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white ring-1 shadow-lg ring-gray-900/5 transition-transform ${
                    direction == "rtl" ? "right-0 left-auto" : "left-0"
                  }`}
                >
                  <div className="p-4">
                    {item.dropdownMenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.path}
                        className={`nav-link hover group relative flex items-center ${
                          direction === "rtl" ? "flex-row-reverse" : ""
                        } gap-x-4 lg:gap-x-6 rounded-lg p-3 lg:p-5 text-sm lg:text-md hover:bg-gray-50 hover:text-orange-500 transition-colors duration-300 ${
                          pathname == subItem.path && "active"
                        } `}
                      >
                        {/* <div className="flex size-9 lg:size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                          {subItem.icon}
                        </div> */}
                        <div className="flex-auto">
                          <span
                            className={`nav-link hover text-gray-600 ${
                              pathname == subItem.path && "active"
                            } text-base lg:text-lg font-semibold transition-colors duration-300`}
                            style={{
                              "--hover-color": "#FE5A00",
                              "--active-color": "#000",
                            } as React.CSSProperties}
                          >
                            {item.name === "Products" ? subItem.name : t(`meunItems.${subItem.name}`)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </PopoverPanel>
              </Popover>
            ) : (
              <Link
                key={item.name}
                href={item.path}
                className={`nav-link hover hover:text-orange-500 text-gray-600 ${
                  pathname == item.path && "active"
                } text-base lg:text-lg font-semibold transition-colors duration-300`}
                style={{
                  "--hover-color": "#FE5A00",
                  "--active-color": "#000",
                } as React.CSSProperties}
              >
                {t(`meunItems.${item.name}`)}
              </Link>
            )
          )}
        </PopoverGroup>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link
            href="#"
            onClick={() => {
              dispatch(lang == "ar" ? LangEng() : LangAr());
            }}
            className="text-base lg:text-lg font-semibold drop-shadow-2xl"
          >
            <div
              className="flex items-center gap-x-1 dynamic-hover"
              style={{ "--secondary-color": colorscm.secondary } as React.CSSProperties}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 lg:size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                />
              </svg>
              {language[lang as keyof typeof language]}
            </div>
          </Link>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <DialogPanel
          dir={direction}
          className="fixed inset-y-0 right-0 z-40 w-full overflow-y-auto bg-white px-4 py-6 sm:max-w-sm sm:px-6"
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img alt="Logo" src="/assets/miclife/miclife.svg" className="h-10 sm:h-12 w-auto" />
            </Link>

            {/* Language Switcher */}
            <Link
              href="#"
              onClick={() => {
                dispatch(lang === "ar" ? LangEng() : LangAr());
              }}
              className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
            >
              <div className="flex items-center gap-x-1 dynamic-hover">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5 sm:size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                  />
                </svg>
                {language[lang as keyof typeof language]}
              </div>
            </Link>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>

          {/* Mobile Menu List */}
          <div className="mt-6">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {menuItems.map((item) =>
                  item.dropdownMenu ? (
                    <Popover key={item.name} className="relative w-full">
                      <PopoverButton className="flex justify-between w-full px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50 hover:text-orange-500 rounded-lg transition-colors">
                        {t(`meunItems.${item.name}`)}
                        <ChevronDownIcon className="size-5 text-gray-500 transition-transform duration-300 ease-in-out" />
                      </PopoverButton>

                      <PopoverPanel className="w-full bg-white rounded-lg shadow-lg ring-1 ring-gray-900/5 mt-2 p-2">
                        <div className="space-y-2">
                          {item.dropdownMenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.path}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center gap-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-orange-500 rounded-md transition-colors"
                            >
                              
                              {item.name === "Products" ? subItem.name : t(`meunItems.${subItem.name}`)}
                            </Link>
                          ))}
                        </div>
                      </PopoverPanel>
                    </Popover>
                  ) : (
                    <Link
                      key={item.name}
                      onClick={() => setMobileMenuOpen(false)}
                      href={item.path}
                      className="block px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50 hover:text-orange-500 rounded-lg transition-colors"
                    >
                      {t(`meunItems.${item.name}`)}
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
