"use client";
import { useTranslation } from "react-i18next";
import FAQSection from "../shared/components/FAQSection";
import DividerComp from "../shared/components/DividerComp";
import CompanySinceComp from "../shared/components/CompanySinceComp";
import { useGetSectionsBySlugQuery } from "../lib/store/api/mainApi";
import FormComp from "../shared/components/FormComp";
import LoadingComponent from "../shared/components/LoadingComponent";
import { sanitizeHtml } from "../lib/sanitize";
const CustomerServicePage = () => {
  const { t, i18n } = useTranslation();

  const {
    data: sectionsData,
    isLoading,
    isError,
  } = useGetSectionsBySlugQuery("SENIOR-MANAGEMENT");

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-6 text-center text-gray-700">
        <LoadingComponent />
      </div>
    );
  }

  if (isError) {
    const message =
      i18n.language === "ar"
        ? "حدث خطأ أثناء تحميل بيانات خدمة العملاء."
        : "Unable to load customer service data.";
    return (
      <div className="max-w-7xl mx-auto py-16 px-6 text-center text-gray-700">
        {message}
      </div>
    );
  }

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   const target = e.target as HTMLFormElement;
  //   const name = (target.name as unknown as HTMLInputElement).value;
  //   const email = (target.email as HTMLInputElement).value;
  //   const phone = (target.phone as HTMLInputElement).value;
  //   const message = (target.message as HTMLTextAreaElement).value;

  //   const body = `
  //     New Customer Service Message:
      
  //     From: ${name}
  //     Email: ${email}
  //     Phone: ${phone}
      
  //     Message:
  //     ${message}
  //   `;

  //   formData.append("Body", body);
  //   formData.append("Subject", "New Customer Service Message");
  //   formData.append("toEmails", "omar.alsayed@mohinspro.com");
  //   formData.append("CCEmails", "");
  //   formData.append("BCCEmails", "");

  //   try {
  //     // await SendEmail(formData);
  //     // messageApi.success(t("customerService.messageSentSuccessfully"));
  //     target.reset();
  //   } catch (error) {
  //     // console.error("Error sending message:", error);
  //     // messageApi.error(t("customerService.messageSendingFailed"));
  //   }
  // };

  return (
    <>
      <CompanySinceComp />
      <section className="container mx-auto p-6 pb-16 px-8" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 text-center my-10">{t("customerService.title")}</h2>

        {/* Contact Information */}
        <div className="grid grid-cols-1 items-center md:grid-cols-2 gap-10">
          {sectionsData?.blocks.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center pb-5">
              {sectionsData?.blocks[0]?.block?.translations?.[i18n.language === "ar" ? 1 : 0]?.title as string}
            </h3>
            <div className="flex justify-center space-x-4 mb-6 text-lg font-semibold">
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(sectionsData?.blocks[0]?.block?.translations?.[i18n.language === "ar" ? 1 : 0]?.description as string, { allowLinks: false }) }} />
            </div>
            <div className="flex justify-center">
              {
              sectionsData?.blocks[0]?.block?.imageUrl && (
              (<img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${sectionsData?.blocks[0]?.block?.imageUrl}`} alt="senior-management" className="w-1/2" />)
              )}
            </div>
          </div>
          )}
          {/* Contact Form */}
          <FormComp
            title={
              t("customerService.sendMessage")}
            enableDesciption={true}
            buttonText={t("send")}
            formTitle={"Contact Senior Management"}
            TicketTypeId={3}
          />
          {/* <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">{t("customerService.sendMessage")}</h3>
            <form className="text-lg" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">{t("customerService.name")}</label>
                <InputComp type="text" name="name" placeholder={t("customerService.namePlaceholder")} required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">{t("customerService.email")}</label>
                <InputComp type="email" name="email" placeholder={t("customerService.emailPlaceholder")} required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">{t("customerService.phone")}</label>
                <InputComp
                  type="tel"
                  name="phone"
                  direction={direction}
                  placeholder={t("customerService.phonePlaceholder")}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">{t("customerService.message")}</label>
                <TextareaComp
                  name="message"
                  rows={4}
                  placeholder={t("customerService.messagePlaceholder")}
                  required
                  value={""}
                  onChange={() => {}}
                ></TextareaComp>
              </div>
              <ButtonComp type="submit" text={t("customerService.sendButton")} />
            </form>
          </div> */}
        </div>
      </section>

      {/* Divider and FAQ Section */}
      <div className="container mx-auto">
        <DividerComp />
        <FAQSection />
      </div>
    </>
  );
};

export default CustomerServicePage;
