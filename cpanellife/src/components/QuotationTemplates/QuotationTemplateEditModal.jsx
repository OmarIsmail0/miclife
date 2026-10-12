import React, { useEffect, useState } from "react";
import { Modal, Form, Select, Input, Checkbox, DatePicker, App } from "antd";
import dayjs from "dayjs";
import { formTemplateService } from "../../api";

const QuotationTemplateEditModal = ({ open, onCancel, template, onSuccess }) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [formTemplates, setFormTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  useEffect(() => {
    if (open) {
      fetchFormTemplates();
      if (template) {
        form.setFieldsValue({
          name: template.name,
          formTemplateId: template.formTemplateId,
          type: template.type,
          contact: template.contact || "",
          replied: template.replied || false,
          expiration: template.expiration ? dayjs(template.expiration) : null,
          isActive: template.isActive !== undefined ? template.isActive : true,
        });
      }
    }
  }, [open, template, form]);

  const fetchFormTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const response = await formTemplateService.getAll({ PageNumber: 1, PageSize: 1000 });
      const templates = response.data || response || [];
      setFormTemplates(templates);
    } catch (error) {
      console.error("Error fetching form templates:", error);
      message.error("Failed to load form templates");
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const payload = {
        Id: template.id,
        Name: values.name || template.name,
        FormTemplateId: values.formTemplateId || template.formTemplateId,
        Type: values.type || template.type,
        ReplyJson: template.replyJson || null,
        Contact: values.contact || template.contact || null,
        Replied: values.replied || template.replied || false,
        Expiration: values.expiration
          ? values.expiration.format("YYYY-MM-DD")
          : template.expiration
          ? template.expiration.format("YYYY-MM-DD")
          : null,
        isActive:
          values.isActive !== undefined ? values.isActive : template.isActive !== undefined ? template.isActive : true,
      };

      if (onSuccess) {
        await onSuccess(payload);
      }

      form.resetFields();
      onCancel();
    } catch (error) {
      console.error("Error updating quotation template:", error);
      if (error?.errorFields) {
        // Validation error
        return;
      }
      message.error(error?.message || "Failed to update quotation template");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Edit Quotation Template"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="Update"
      cancelText="Cancel"
      width={600}
      okButtonProps={{ loading }}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter a template name" }]}>
          <Input placeholder="Enter template name" />
        </Form.Item>

        <Form.Item name="formTemplateId" label="Form Template">
          <Select
            disabled
            placeholder="Select form template"
            showSearch
            loading={loadingTemplates}
            filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
            options={formTemplates.map((t) => ({
              label: t.name || `Template ${t.id}`,
              value: t.id,
            }))}
          />
        </Form.Item>

        <Form.Item name="type" label="Type">
          <Input placeholder="Enter type" disabled />
        </Form.Item>

        <Form.Item name="contact" label="Contact (Optional)">
          <Input placeholder="Enter contact information" disabled />
        </Form.Item>

        <Form.Item name="replied" valuePropName="checked">
          <Checkbox disabled>Replied</Checkbox>
        </Form.Item>

        <Form.Item name="expiration" label="Expiration (Optional)">
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" disabled />
        </Form.Item>

        <Form.Item name="isActive" valuePropName="checked" initialValue={true}>
          <Checkbox disabled>Active</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default QuotationTemplateEditModal;
