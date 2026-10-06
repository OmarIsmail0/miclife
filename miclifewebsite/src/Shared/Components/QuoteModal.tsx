import { useEffect, useState } from "react";
import { Modal, Steps, Button, Form, Input, InputNumber, message } from "antd";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { useCreateTicketQuery } from "@/src/lib/store/api/mainApi";

const { Step } = Steps;

const QuoteModal = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form1Data, setForm1Data] = useState({});

  const [quote, setQuote] = useState(0);
  const [pendingQuote, setPendingQuote] = useState(0);
  const [shouldCreateTicket, setShouldCreateTicket] = useState(false);
  const [requestBody, setRequestBody] = useState<any | null>(null);

  const {  t, i18n } = useTranslation();

  const { data: ticketResponse, isFetching: isCreating, error } = useCreateTicketQuery(requestBody as any, {
    skip: !shouldCreateTicket || !requestBody,
  });

  useEffect(() => {
    if (!shouldCreateTicket) return;

    if (error) {
      message.error(t("modal.quoteSubmittedFailed"));
      setShouldCreateTicket(false);
      return;
    }

    if (ticketResponse?.message !== undefined) {
      if (ticketResponse.message === "Ticket created successfully") {
        message.success(t("modal.quoteSubmittedSuccessfully"));
        setQuote(pendingQuote);
        setCurrentStep(2);
      } else {
        message.error(t("modal.quoteSubmittedFailed"));
      }
      setShouldCreateTicket(false);
    }
  }, [ticketResponse, error, shouldCreateTicket, pendingQuote, t]);

  const next = () => setCurrentStep(currentStep + 1);
  const prev = () => setCurrentStep(currentStep - 1);

  const handleForm1Submit = (values: any) => {
    setForm1Data(values);
    next();
  };

  const calculateQuote = ({ insuredSum }: { insuredSum: number }) => {
    const qoute = insuredSum > 1000000 ? insuredSum * 0.017 : insuredSum * 0.019;
    setQuote(qoute);
    return qoute;
  };

  const handleForm2Submit = (values: any) => {
    const allFormData = { ...form1Data, ...values };
    const calculatedQuote = calculateQuote(allFormData);
    const formDataWithQuote = { ...allFormData, quote: calculatedQuote };

    const payload = {
      title: t("modal.carInsuranceQuote"),
      TicketType: 10,
      Email: values.email,
      Phone: `+20${values.phone}`,
      TicketStatus: 1,
      Description: JSON.stringify(formDataWithQuote),
    };
    setPendingQuote(calculatedQuote);
    setRequestBody(payload);
    setShouldCreateTicket(true);
  };

  const steps = [
    {
      title: t("modal.Your Car Details"),
      content: (
        <Form dir={i18n?.language === "ar" ? "rtl" : "ltr"} layout="vertical" onFinish={handleForm1Submit} initialValues={{ year: dayjs().year() }}>
          <Form.Item label={t("modal.model")} name="model" rules={[{ required: true, message: " " }]}>
            <Input />
          </Form.Item>
          <Form.Item label={t("modal.year")} name="year">
            <Input disabled />
          </Form.Item>
          <Form.Item label={t("modal.insuredSum")} name="insuredSum" rules={[{ required: true, message: " " }]}>
            <InputNumber<number>
              style={{ width: "100%" }}
              min={0}
              max={8000000}
              controls={false}
              formatter={(value) => {
                if (value === undefined || value === null) return "";
                const [integerPart, decimalPart] = String(value).split(".");
                const withSeparators = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return decimalPart !== undefined ? `${withSeparators}.${decimalPart}` : withSeparators;
              }}
              parser={(value) => {
                if (!value) return 0;
                const numeric = Number(value.replace(/,/g, ""));
                if (Number.isNaN(numeric)) {
                  return 0;
                }
                return numeric as number;
              }}
              prefix={"E£"}
              onKeyDown={(e) => {
                const pattern = /[0-9]/;
                if (
                  !pattern.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Delete" &&
                  e.key !== "ArrowLeft" &&
                  e.key !== "ArrowRight" &&
                  e.key !== "Tab" &&
                  !(e.ctrlKey && e.key === "a") &&
                  !(e.ctrlKey && e.key === "Backspace") &&
                  !(e.ctrlKey && e.key === "Delete")
                ) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>
          <Form.Item label={t("modal.carSpecifications")} name="details">
            <Input.TextArea />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            {t("modal.next")}
          </Button>
        </Form>
      ),
    },
    {
      title: t("modal.Your Details"),
      content: (
        <Form dir={i18n?.language === "ar" ? "rtl" : "ltr"} layout="vertical" onFinish={handleForm2Submit}>
          <Form.Item label={t("modal.personName")} name="name" rules={[{ required: true, message: " " }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label={t("modal.email")}
            name="email"
            rules={[
              { required: true, message: " " },
              { type: "email", message: " " },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t("modal.phoneNumber")}
            name="phone"
            rules={[
              { required: true, message: " " },
              {
                pattern: /^[0-9]{10}$/,
                message: " ",
              },
            ]}
            normalize={(value: string | undefined) => {
              if (typeof value !== "string") return value;
              const digitsOnly = value.replace(/\D/g, "");
              return digitsOnly.slice(0, 10);
            }}
          >
            <Input
              type="tel"
              maxLength={10}
              prefix={<span className="text-black">+20</span>}
            />
          </Form.Item>
          <div style={{ display: "flex", gap: "8px" }}>
            <Button onClick={prev}>{t("modal.back")}</Button>
            <Button type="primary" htmlType="submit" loading={isCreating}>
              {t("modal.submit")}
            </Button>
          </div>
        </Form>
      ),
    },
    {
      title: t("modal.Your Quote"),
      content: (
        <div className="text-center">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mt-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">{t("modal.estimatedQuote")}</p>
            <p className="text-3xl font-bold text-blue-600">
              E£
              {quote.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <Button
            onClick={() => {
              setCurrentStep(0);
              onClose();
            }}
          >
            {t("modal.close")}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={t("modal.carInsuranceQuote")}
      open={visible}
      onCancel={() => {
        setCurrentStep(0);
        onClose();
      }}
      footer={null}
      width={800}
      destroyOnHidden
      style={{ direction: i18n?.language === "ar" ? "rtl" : "ltr" }}
    >
      <Steps current={currentStep} size="small" className="mb-6">
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div>{steps[currentStep].content}</div>
    </Modal>
  );
};


export default QuoteModal;
