'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dialog, DialogPanel, Popover, PopoverButton, PopoverGroup, PopoverPanel } from "@headlessui/react";
import {
  UsersIcon,
  PresentationChartLineIcon,
  InformationCircleIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
  HomeIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { TfiAnnouncement } from "react-icons/tfi";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useDispatch, useSelector } from "react-redux";
import { LangAr, LangEng } from "../language/LanSlice";
import { language } from "../constants/language";
import colorscm from "../constants/colorscm";
import { useTranslation } from "react-i18next";

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

  { name: "individual insurance", path: "/individual-insurance" },
  { name: "corporate insurance", path: "/corporate-insurance" },
  // { name: "Insurance services", path: "/insurance-services" },
  // { name: "Investor Relations", path: "/investor-relations" },
  { name: "Our social responsibility", path: "/social-responsibility" },
  { name: "Contact Senior Management", path: "/contact-senior-management" },
  // { name: "Media Center", path: "/media-center" },
  { name: "Customer Service", path: "/customer-service" },
  // { name: "contactUs", path: "/contact-us" },
  { name: "Job opportunities", path: "/job-opportunities" },
  // { name: "Payment", path: "/payment" },
];


export default function HeaderCmp() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { langauge } = useSelector((state: any) => state.language);
  const dispatch = useDispatch();
  const router = useRouter();
  const location = usePathname();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results: any[] = [];
    const searchLower = query.toLowerCase();

    // Search through menu items and their dropdowns
    menuItems.forEach((item) => {
      const itemName = t(`meunItems.${item.name}`).toLowerCase();
      if (itemName.includes(searchLower)) {
        results.push({
          name: t(`meunItems.${item.name}`),
          path: item.path,
        });
      }

      if (item.dropdownMenu) {
        item.dropdownMenu.forEach((subItem) => {
          const subItemName = t(`meunItems.${subItem.name}`).toLowerCase();
          if (subItemName.includes(searchLower)) {
            results.push({
              name: t(`meunItems.${subItem.name}`),
              path: subItem.path,
            });
          }
        });
      }
    });

    setSearchResults(results);
  };

  const handleResultClick = (path: string) => {
    router.push(path);
    setSearchQuery("");
  };

  const options = searchResults.map((result) => ({
    value: result.path,
    label: result.name,
  }));

  return (
    <header className="bg-white shadow fixed top-0 left-0 right-0 z-30">
      <nav aria-label="Global" className="mx-auto flex items-center justify-between p-4 md:p-6 xl:px-8">
        {/* Logo Section */}
        <div className="flex xl:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">MIC</span>
            <img alt="Logo" src="/assets/miclife/miclife.svg" className="h-12 md:h-16 w-auto mx-4 md:mx-0 lg:mx-0" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex xl:hidden">
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
        <PopoverGroup className="hidden xl:flex xl:gap-x-12 ">
          {menuItems.map((item) =>
            item.dropdownMenu ? (
              <Popover key={item.name} className="relative">
                <PopoverButton
                  className={`flex items-center ${
                    langauge === "ar" ? "flex-row-reverse" : ""
                  } gap-x-1 text-base lg:text-lg font-semibold transition-colors duration-300 nav-link hover ${
                    item.dropdownMenu.some((e) => e.path == location as string) && "active"
                  } `}
                >
                  {t(`meunItems.${item.name}`)}
                  <ChevronDownIcon aria-hidden="true" className="size-4 lg:size-5 flex-none text-gray-400" />
                </PopoverButton>
                <PopoverPanel
                  className={`absolute top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white ring-1 shadow-lg ring-gray-900/5 transition-transform ${
                    langauge == "ar" ? "right-0 left-auto" : "left-0"
                  }`}
                >
                  <div className="p-4">
                    {item.dropdownMenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.path}
                        className={`nav-link hover group relative flex items-center ${
                          langauge === "ar" ? "flex-row-reverse" : ""
                        } gap-x-4 lg:gap-x-6 rounded-lg p-3 lg:p-4 text-sm lg:text-md hover:bg-gray-50 transition-colors duration-300 ${
                          (location as string) == subItem.path && "active"
                        } `}
                      >
                        <div className="flex size-9 lg:size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                          {subItem.icon}
                        </div>
                        <div className="flex-auto">
                          <span
                            className={`nav-link hover text-gray-600 ${
                              (location as string) == subItem.path && "active"
                            } text-base lg:text-lg font-semibold transition-colors duration-300`}
                          >
                            {t(`meunItems.${subItem.name}`)}
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
                className={`nav-link hover text-gray-600 ${
                  (location as string) == item.path && "active"
                } text-base lg:text-lg font-semibold transition-colors duration-300`}
              >
                {t(`meunItems.${item.name}`)}
              </Link>
            )
          )}
        </PopoverGroup>

        <div className="hidden xl:flex xl:flex-1 xl:justify-end">
          <Link
            href="#"
            onClick={() => {
              dispatch(langauge == "ar" ? LangEng() : LangAr());
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
              {language[langauge as keyof typeof language] || "AR"}
            </div>
          </Link>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="xl:hidden">
        <DialogPanel
          dir={langauge}
          className="fixed inset-y-0 right-0 z-40 w-full overflow-y-auto bg-white px-4 py-6 sm:max-w-sm sm:px-6"
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            {/* <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img alt="Logo" src="/assets/miclife/miclife.svg" className="h-10 sm:h-12 w-auto" />
            </Link> */}

            {/* Language Switcher */}
            <Link
              href="#"
              onClick={() => {
                dispatch(langauge === "ar" ? LangEng() : LangAr());
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
                {language[langauge as keyof typeof language] || "AR"}
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
                      <PopoverButton className="flex justify-between w-full px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
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
                              className="flex items-center gap-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            >
                              <div className="flex size-8 flex-none items-center justify-center rounded-lg bg-gray-50">
                                {subItem.icon}
                              </div>
                              {t(`meunItems.${subItem.name}`)}
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
                      className="block px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
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
