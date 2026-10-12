import { lazy, Suspense, useEffect, type ReactNode } from "react";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
import Layout from "./Shared/Components/Layout";
import LoadingComponent from "./Shared/Components/LoadingComponent";
import PageMeta from "./components/seo/PageMeta";

const HomePage = lazy(() => import("./page-components/HomePage"));
const AboutUsPage = lazy(() => import("./page-components/AboutUsPage"));
const BoardDirectorsPage = lazy(() => import("./page-components/BoardDirectorsPage"));
const BoardDirectorDetailsContent = lazy(() => import("./Shared/Components/BoardDirectorDetailsContent"));
const BranchesPage = lazy(() => import("./page-components/BranchesPage"));
const ChairmanMessage = lazy(() => import("./page-components/ChairmanMessage"));
const ContactUs = lazy(() => import("./page-components/ContactUs"));
const ContributorsPage = lazy(() => import("./page-components/ContributorsPage"));
const CustomerServicePage = lazy(() => import("./page-components/CustomerServicePage"));
const InsuranceBySlugPage = lazy(() => import("./page-components/InsuranceBySlugPage"));
const InsuranceDetailBySlugPage = lazy(() => import("./page-components/InsuranceDetailBySlugPage"));
const InvestorRelationsPage = lazy(() => import("./page-components/InvestorRelationsPage"));
const MediaCenter = lazy(() => import("./page-components/MediaCenter"));
const JobOpportunities = lazy(() => import("./page-components/JobOpportunities"));
const SocialResponsibilityPage = lazy(() => import("./page-components/SocialResponsibilityPage"));
const IframeViewComp = lazy(() => import("./Shared/Components/IframeViewComp"));
const NotFound = lazy(() => import("./page-components/NotFound"));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function withMeta(title: string, description: string, element: ReactNode) {
  return (
    <PageMeta title={title} description={description}>
      {element}
    </PageMeta>
  );
}

function BoardDirectorDetailsRoute() {
  const { id } = useParams<{ id: string }>();
  return <BoardDirectorDetailsContent id={id ?? ""} />;
}

export default function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Suspense fallback={<LoadingComponent />}>
        <Routes>
          <Route
            path="/"
            element={withMeta(
              "Al Mohandes Life Insurance | Leading Life Insurance in Egypt",
              "Al Mohandes Life Insurance - Egypt's trusted life insurance provider for over 45 years. Get comprehensive coverage, competitive rates, and excellent customer service. Call 19318 for a quote!",
              <HomePage />
            )}
          />
          <Route
            path="/aboutus"
            element={withMeta(
              "About Us - Our Mission & Vision | Al Mohandes Life Insurance",
              "Learn about Al Mohandes Insurance Company mission, vision, and values. Leading insurance provider in Egypt with 45+ years of excellence.",
              <AboutUsPage />
            )}
          />
          <Route
            path="/board"
            element={withMeta(
              "Board of Directors | Al Mohandes Life Insurance",
              "Meet the experienced board of directors leading Al Mohandes Life Insurance towards excellence in providing life insurance services across Egypt.",
              <BoardDirectorsPage />
            )}
          />
          <Route path="/board-directors-details/:id" element={<BoardDirectorDetailsRoute />} />
          <Route
            path="/branches"
            element={withMeta(
              "Our Branches Across Egypt | Al Mohandes Life Insurance",
              "Find Al Mohandes Life Insurance branches near you. We serve customers across Cairo, Alexandria, and major cities throughout Egypt.",
              <BranchesPage />
            )}
          />
          <Route
            path="/chairman"
            element={withMeta(
              "Chairman's Message | Al Mohandes Life Insurance",
              "Read the message from our Chairman about Al Mohandes Life Insurance's commitment to excellence and customer satisfaction in Egypt's insurance sector.",
              <ChairmanMessage />
            )}
          />
          <Route
            path="/contact-us"
            element={withMeta(
              "Contact Us - Get in Touch | Al Mohandes Life Insurance",
              "Contact Al Mohandes Life Insurance for inquiries, quotes, or support. Call us at 19318 or visit our offices in Egypt. We're here to help!",
              <ContactUs />
            )}
          />
          <Route
            path="/contributors"
            element={withMeta(
              "Our Contributors & Partners | Al Mohandes Life Insurance",
              "Learn about our valued contributors and partners who help Al Mohandes Life Insurance serve customers across Egypt with excellence.",
              <ContributorsPage />
            )}
          />
          <Route
            path="/customer-service"
            element={withMeta(
              "Customer Service & Support | Al Mohandes Life Insurance",
              "Get excellent customer service from Al Mohandes Life Insurance. Call 19318 for insurance inquiries, claims, policy updates, and support services.",
              <CustomerServicePage />
            )}
          />
          <Route path="/insurance/:slug" element={<InsuranceBySlugPage />} />
          <Route path="/insurance-detail/:slug" element={<InsuranceDetailBySlugPage />} />
          <Route
            path="/investor-relations"
            element={withMeta(
              "Investor Relations | Al Mohandes Life Insurance",
              "Access financial reports, annual statements, and investor information for Al Mohandes Life Insurance. Stay informed about our company performance.",
              <InvestorRelationsPage />
            )}
          />
          <Route
            path="/media-center"
            element={withMeta(
              "Media Center - News & Updates | Al Mohandes Life Insurance",
              "Stay updated with the latest news, press releases, and announcements from Al Mohandes Life Insurance. Read our latest articles and media coverage.",
              <MediaCenter />
            )}
          />
          <Route
            path="/social-responsibility"
            element={withMeta(
              "Social Responsibility & Community Programs | Al Mohandes Life Insurance",
              "Learn about Al Mohandes Life Insurance's commitment to social responsibility, community programs, and sustainable initiatives across Egypt.",
              <SocialResponsibilityPage />
            )}
          />
          <Route
            path="/job-opportunities"
            element={withMeta(
              "Job Opportunities | Al Mohandes Life Insurance",
              "Explore career opportunities at Al Mohandes Life Insurance.",
              <JobOpportunities />
            )}
          />
          <Route path="/viewer" element={<IframeViewComp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
