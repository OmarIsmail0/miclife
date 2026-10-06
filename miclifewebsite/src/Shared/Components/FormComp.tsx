 
import InputComp from "./InputComp";
import ButtonComp from "./ButtonComp";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useCreateTicketQuery } from "@/src/lib/store/api/mainApi";
import TextareaComp from "./TextareaComp";

interface FormCompProps {
  title: string;
  formTitle: string;
  TicketTypeId: number;
  buttonText?: string;
  enableDesciption?: boolean;
}

const FormComp = ({ title, formTitle, TicketTypeId = 10, buttonText, enableDesciption = false }: FormCompProps) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ email?: string; mobile?: string }>({});

  const validateEmail = (value: string) => {
    if (!value) return t("required");
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value) ? "" : t("invalid email");
  };

  const validateMobile = (value: string) => {
    if (!value) return t("required");
    const digits = value.replace(/\D/g, "");
    return digits.length >= 10 ? "" : t("invalid mobile");
  };

  const [shouldCreate, setShouldCreate] = useState(false);
  const [requestBody, setRequestBody] = useState<any | null>(null);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const { data: ticketResponse, isFetching: isCreating, error } = useCreateTicketQuery(requestBody as any, {
    skip: !shouldCreate || !requestBody,
  });

  useEffect(() => {
    if (!shouldCreate) return;
    // Handle RTK Query error object first
    if (error) {
      setSubmitStatus("error");
      setShouldCreate(false);
      return;
    }
    if (ticketResponse?.message !== undefined) {
      if (ticketResponse.message === "Ticket created successfully") {
        setSubmitStatus("success");
      } else {
        setSubmitStatus("error");
      }
      setShouldCreate(false);
    }
  }, [ticketResponse, error, shouldCreate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const emailError = validateEmail(email);
    const mobileError = validateMobile(mobile);
    const nextErrors: { email?: string; mobile?: string } = {};
    if (emailError) nextErrors.email = emailError;
    if (mobileError) nextErrors.mobile = mobileError;
    setErrors(nextErrors);

    if (emailError || mobileError) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    const digitsOnly = mobile.replace(/\D/g, "");
    const payload = {
      title: formTitle,
      TicketType: TicketTypeId,
      Email: email,
      Phone: `+20${digitsOnly}`,
      TicketStatus: 1,
      Description: enableDesciption ? description : ""
    };
    setRequestBody(payload);
    setSubmitStatus(null);
    setShouldCreate(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">{title}</h2>
      {submitStatus === "success" ? (
        <div className="mb-4 rounded bg-green-50 border border-green-200 text-green-700 px-3 py-2 text-sm">
          {t("success")}
        </div>
      ) : null}
      {submitStatus === "error" ? (
        <div className="mb-4 rounded bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
          {t("error")}
        </div>
      ) : null}
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div>
          <label className="block text-gray-700 text-sm sm:text-base">{t("email")}</label>
          <InputComp
            type="email"
            placeholder={t("email")}
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            onBlur={() => setErrors((prev) => ({ ...prev, email: validateEmail(email) }))}
            aria-invalid={!!errors.email}
          />
          {errors.email ? (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          ) : null}
        </div>

        <div>
          <label className="block text-gray-700 text-sm sm:text-base">{t("mobile")}</label>
          <div className="relative">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-black pl-1 select-none">+20</span>
            <InputComp
              type="tel"
              placeholder={t("mobile")}
              value={mobile}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const digitsOnly = e.target.value.replace(/\D/g, "");
                if (digitsOnly.length <= 10) {
                  setMobile(digitsOnly);
                }
              }}
              onBlur={() => setErrors((prev) => ({ ...prev, mobile: validateMobile(mobile) }))}
              aria-invalid={!!errors.mobile}
              style={{ paddingLeft: "3rem" }}
              maxLength={10}
            />
          </div>
          {errors.mobile ? (
            <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
          ) : null}
        </div>
        {enableDesciption && (
        <div className="mb-4 sm:mb-5">
            <label className="block text-gray-700 text-sm sm:text-base">{t("customerService.message")}</label>
            <TextareaComp rows={4} placeholder={t("customerService.messagePlaceholder")} value={description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}></TextareaComp>
        </div>
        )}
        <ButtonComp 
          text={isCreating ? t("loading") : (buttonText ?? t("send"))} 
          primaryColor="#075DA0" 
          secondaryColor="#FE5A00" 
        />
      </form>
    </div>
  );
};

export default FormComp;
