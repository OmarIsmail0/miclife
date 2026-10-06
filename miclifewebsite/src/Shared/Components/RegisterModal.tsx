 
"use client";
import { Modal, Form, Input, Button, message } from "antd";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useCreateTicketQuery } from "@/src/lib/store/api/mainApi";

interface RegisterModalProps {
  visible: boolean;
  onClose: () => void;
}

const RegisterModal = ({ visible, onClose }: RegisterModalProps) => {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const [shouldCreateTicket, setShouldCreateTicket] = useState(false);
  const [requestBody, setRequestBody] = useState<any | null>(null);

  const { data: ticketResponse, isFetching: isCreating, error } = useCreateTicketQuery(requestBody as any, {
    skip: !shouldCreateTicket || !requestBody,
  });

  useEffect(() => {
    if (!shouldCreateTicket) return;

    if (error) {
      message.error(t("registrationFailed"));
      setShouldCreateTicket(false);
      return;
    }

    if (ticketResponse?.message !== undefined) {
      if (ticketResponse.message === "Ticket created successfully") {
        message.success(t("registrationSuccessful"));
        form.resetFields();
        onClose();
      } else {
        message.error(t("registrationFailed"));
      }
      setShouldCreateTicket(false);
    }
  }, [ticketResponse, error, shouldCreateTicket, form, onClose, t]);

  const handleFinish = async (values: any) => {
    const payload = {
      title: "Registration Request",
      TicketType: 10,
      Email: values.email,
      Phone: `+20${values.phone}`,
      TicketStatus: 1,
      Description: JSON.stringify({
        name: values.name,
        phone: `+20${values.phone}`,
        email: values.email,
      }),
    };

    setRequestBody(payload);
    setShouldCreateTicket(true);
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={t("registerModal.title")}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      style={{ direction: i18n?.language === "ar" ? "rtl" : "ltr" }}
      
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="mt-4"
        autoComplete="off"
      >
        <Form.Item
          name="name"
          label={t("registerModal.nameLabel")}
          rules={[{ required: true, message: t("registerModal.nameRequired") }]}
        >
          <Input placeholder={t("registerModal.namePlaceholder")} autoFocus />
        </Form.Item>

        <Form.Item
          name="phone"
          label={t("registerModal.phoneLabel")}
          rules={[
            { required: true, message: t("registerModal.phoneRequired") },
            {
              pattern: /^[0-9]{10}$/,
              message: t("registerModal.phoneInvalid"),
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
            placeholder={t("registerModal.phonePlaceholder")}
          />
        </Form.Item>

        <Form.Item
          name="email"
          label={t("registerModal.emailLabel")}
          rules={[
            { required: true, message: t("registerModal.emailRequired") },
            { type: "email", message: t("registerModal.emailInvalid") },
          ]}
        >
          <Input type="email" placeholder={t("registerModal.emailPlaceholder")} />
        </Form.Item>

        <Form.Item className="mb-0 text-right">
          <Button onClick={handleCancel} className="mr-2">
            {t("registerModal.cancelButton")}
          </Button>
          <Button type="primary" htmlType="submit" loading={isCreating}>
            {t("registerModal.submitButton")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RegisterModal;
