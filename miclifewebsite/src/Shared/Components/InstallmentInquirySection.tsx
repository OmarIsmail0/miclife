import InputComp from "./InputComp";
import ButtonComp from "./ButtonComp";
import { Select, Form, DatePicker } from "antd";
import colorscm from "../constants/colorscm";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useCreateTicketQuery } from "../../lib/store/api/mainApi";

interface InstallmentInquirySectionProps {
  direction?: "rtl" | "ltr";
  displayImage?: boolean;
}

interface DocumentType {
  value: string;
  label: string;
}

const InstallmentInquirySection: React.FC<InstallmentInquirySectionProps> = ({ direction = "rtl", displayImage = true }) => {
  const [form] = Form.useForm();
  const { t, i18n } = useTranslation();
  const [shouldCreateTicket, setShouldCreateTicket] = useState(false);
  const [requestBody, setRequestBody] = useState<any | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { data: ticketResponse, error } = useCreateTicketQuery(requestBody as any, {
    skip: !shouldCreateTicket || !requestBody,
  });

  useEffect(() => {
    if (!shouldCreateTicket) return;

    if (error) {
      setFeedback({ type: "error", text: t("registrationFailed") });
      setShouldCreateTicket(false);
      return;
    }

    if (ticketResponse?.message !== undefined) {
      if (ticketResponse.message === "Ticket created successfully") {
        setFeedback({ type: "success", text: t("registrationSuccessful") });
        form.resetFields();
      } else {
        setFeedback({ type: "error", text: t("registrationFailed") });
      }
      setShouldCreateTicket(false);
    }
  }, [ticketResponse, error, shouldCreateTicket, form, t]);

  const documentTypes: DocumentType[] = [
    { value: "id", label: t("installmentInquiry.documentTypes.id") },
    { value: "passport", label: t("installmentInquiry.documentTypes.passport") },
    { value: "license", label: t("installmentInquiry.documentTypes.license") },
  ];

  const handleSubmit = (values: any) => {
    const digitsOnly = typeof values.mobile === "string" ? values.mobile.replace(/\D/g, "") : "";
    const payload = {
      title: "Installment Inquiry",
      TicketType: 2,
      Email: values.email,
      Phone: digitsOnly ? `+20${digitsOnly}` : "",
      TicketStatus: 1,
      Description: JSON.stringify({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        mobile: digitsOnly ? `+20${digitsOnly}` : "",
        city: values.city,
        dob: values.dob ? values.dob.toISOString?.() ?? String(values.dob) : "",
        documentType: values.documentType,
      }),
    };
    setRequestBody(payload);
    setShouldCreateTicket(true);
  };

  return (
    <section
      className={`container mx-auto flex flex-col lg:flex-row items-center lg:items-start ${displayImage ? "justify-between" : "justify-center"} gap-8 lg:gap-12 py-8 px-4 md:px-6`}
      dir={direction}
    >
      {/* Illustration - only show if displayImage is true */}
      {displayImage && (
        <div className="order-2 lg:order-1 w-full lg:w-5/12 flex justify-center lg:justify-start items-center">
          <img
            src="/assets/images/senior-management.png"
            alt="Installment Inquiry Illustration"
            className="w-60 sm:w-72 md:w-96 lg:w-auto max-w-full"
            loading="lazy"
          />
        </div>
      )}

      {/* Form Card */}
      <div
        className={`${displayImage ? "order-1 lg:order-2 w-full lg:w-7/12" : "w-full"} max-w-lg bg-white rounded-3xl shadow-md p-6 sm:p-8 lg:p-10 border mx-auto lg:mx-0`}
      >
        <h2 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gray-100 rounded-full py-2">
          {t("installmentInquiry.title")}
        </h2>
        {feedback && (
          <div
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
            className={`mb-4 rounded-md p-3 text-sm ${
              feedback.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
            role="status"
          >
            {feedback.text}
          </div>
        )}
        <Form form={form} onFinish={handleSubmit} className="space-y-4" layout="vertical" dir={direction}>
          <Form.Item
            name="firstName"
            rules={[{ required: true, message: t("installmentInquiry.validation.firstNameRequired") }]}
          >
            <InputComp
              borderRadius="1.5rem"
              borderWidth="1px"
              placeholder={t("installmentInquiry.firstName")}
              direction={direction}
            />
          </Form.Item>

          <Form.Item
            name="lastName"
            rules={[{ required: true, message: t("installmentInquiry.validation.lastNameRequired") }]}
          >
            <InputComp
              borderRadius="1.5rem"
              borderWidth="1px"
              placeholder={t("installmentInquiry.lastName")}
              direction={direction}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: t("installmentInquiry.validation.emailRequired") },
              { type: "email", message: t("installmentInquiry.validation.emailInvalid") },
            ]}
          >
            <InputComp
              placeholder={t("installmentInquiry.email")}
              direction={direction}
              type="email"
              borderRadius="1.5rem"
              borderWidth="1px"
            />
          </Form.Item>

          <Form.Item
            name="mobile"
            rules={[
              { required: true, message: t("installmentInquiry.validation.mobileRequired") },
              { pattern: /^[0-9]{11}$/, message: t("installmentInquiry.validation.mobileInvalid") },
            ]}
            normalize={(value: string | undefined) => {
              if (typeof value !== "string") return value;
              const digitsOnly = value.replace(/\D/g, "");
              return digitsOnly.slice(0, 11);
            }}
          >
            <InputComp
              placeholder={t("installmentInquiry.mobile")}
              direction={direction}
              type="tel"
              maxLength={11}
              borderRadius="1.5rem"
              borderWidth="1px"
            />
          </Form.Item>

          <Form.Item name="city" rules={[{ required: true, message: t("installmentInquiry.validation.cityRequired") }]}>
            <InputComp
              placeholder={t("installmentInquiry.city")}
              direction={direction}
              borderRadius="1.5rem"
              borderWidth="1px"
            />
          </Form.Item>

          <Form.Item name="dob" rules={[{ required: true, message: t("installmentInquiry.validation.dobRequired") }]}>
            <DatePicker
              placeholder={t("installmentInquiry.dateOfBirth")}
              className="w-full custom-date"
              size="large"
              style={{
                direction,
                "--border-color": colorscm.primary,
                "--focus-border-color": colorscm.secondary,
              } as React.CSSProperties}
            />
          </Form.Item>

          <Form.Item
            name="documentType"
            rules={[{ required: true, message: t("installmentInquiry.validation.documentTypeRequired") }]}
          >
            <Select
              placeholder={t("installmentInquiry.documentType")}
              className="w-full custom-select"
              options={documentTypes}
              size="large"
              style={{
                direction,
                "--border-color": colorscm.primary,
                "--focus-border-color": colorscm.secondary,
              } as React.CSSProperties}
              styles={{
                popup: {
                  root: { textAlign: direction === "rtl" ? "right" : "left" },
                },
              }}
            />
          </Form.Item>

          <Form.Item>
            <ButtonComp
              text={t("installmentInquiry.submit")}
              type="submit"
              primaryColor={colorscm.pomonaGreen}
              secondaryColor={colorscm.secondary}
              style={{
                borderRadius: "1.5rem",
                borderWidth: "1px",
              }}
            />
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default InstallmentInquirySection;
