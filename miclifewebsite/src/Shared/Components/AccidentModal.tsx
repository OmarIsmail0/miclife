 
"use client";
import { Modal, Form, Input, Upload, Button, message } from "antd";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { useLanguage } from "../../lib/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { useCreateTicketQuery } from "@/src/lib/store/api/mainApi";

interface AccidentModalProps {
  visible: boolean;
  onClose: () => void;
}

const AccidentModal = ({ visible, onClose }: AccidentModalProps) => {
  const [form] = Form.useForm();
  const { t, i18n } = useTranslation();

  const [shouldCreateTicket, setShouldCreateTicket] = useState(false);
  const [requestBody, setRequestBody] = useState<any | null>(null);

  const { data: ticketResponse, isFetching: isCreating, error } = useCreateTicketQuery(requestBody as any, {
    skip: !shouldCreateTicket || !requestBody,
  });

  useEffect(() => {
    if (!shouldCreateTicket) return;

    if (error) {
      message.error(t("accidentModal.errorMessage"));
      setShouldCreateTicket(false);
      return;
    }

    if (ticketResponse?.message !== undefined) {
      if (ticketResponse.message === "Ticket created successfully") {
        message.success(t("accidentModal.successMessage"));
        form.resetFields();
        onClose();
      } else {
        message.error(t("accidentModal.errorMessage"));
      }
      setShouldCreateTicket(false);
    }
  }, [ticketResponse, error, shouldCreateTicket, form, onClose, t]);

  const { Dragger } = Upload;

  const handleSubmit = (values: any) => {
    const attachments = (values.Attachments || []).map((file: any) => file?.name).filter(Boolean);

    const descriptionPayload = {
      policy: values.policy ?? "",
      email: values.email,
      description: values.description ?? "",
      // attachments,
    };

    const payload = {
      title: "Accident Report",
      TicketType: 1,
      Email: values.email,
      TicketStatus: 1,
      Description: JSON.stringify(descriptionPayload),
    };

    setRequestBody(payload);
    setShouldCreateTicket(true);
  };

  // AntD's Upload normalization
  const normFile = (e: any) => {
    return Array.isArray(e) ? e : e?.fileList;
  };

  return (
    <Modal
      title={t("accidentModal.title")}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1024}
      style={{ direction: i18n?.language === "ar" ? "rtl" : "ltr" }}
    >
      <Form dir={i18n?.language === "ar" ? "rtl" : "ltr"} layout="vertical" onFinish={handleSubmit} form={form}>
        <Form.Item label={t("accidentModal.policyNumberLabel")} name="policy">
          <Input />
        </Form.Item>

        <Form.Item
          label={t("accidentModal.emailLabel")}
          name="email"
          rules={[{ required: true, type: "email", message: t("accidentModal.emailValidation") }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label={t("accidentModal.descriptionLabel")} name="description">
          <TextArea />
        </Form.Item>

        {/* <Form.Item
          label={t("accidentModal.attachmentsLabel")}
          name="Attachments"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Dragger multiple beforeUpload={() => false}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">{t("accidentModal.draggerText")}</p>
            <p className="ant-upload-hint">{t("accidentModal.draggerHint")}</p>
          </Dragger>
        </Form.Item> */}

        <Form.Item>
          <div className={`flex ${i18n?.language === "ar" ? "flex-row-reverse" : "flex-row"} justify-end`}>
            <Button type="default" onClick={onClose} className={`${i18n?.language === "ar" ? "ml-2" : "mr-2"}`}>
              {t("jobs.cancel")}
            </Button>
            <Button type="primary" htmlType="submit" loading={isCreating}>
              {isCreating ? t("accidentModal.sendingButton") : t("accidentModal.sendButton")}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AccidentModal;
