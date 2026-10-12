import React, { useEffect, useState } from "react";
import { Modal, Form, Select, Input, App } from "antd";
import { formTemplateService } from "../../api";

const QuotationTemplateCreateModal = ({ open, onCancel, onSuccess }) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [formTemplates, setFormTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({ type: "Quotation" });
      fetchFormTemplates();
    }
  }, [open, form]);

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
        Name: values.name,
        FormTemplateId: values.formTemplateId,
        Type: values.type || "Quotation",
        ReplyJson: null,
        Contact: null,
        Expiration: null,
        isActive: true,
      };

      if (onSuccess) {
        await onSuccess(payload);
      }

      form.resetFields();
      onCancel();
    } catch (error) {
      console.error("Error creating quotation template:", error);
      if (error?.errorFields) {
        // Validation error
        return;
      }
      message.error(error?.message || "Failed to create quotation template");
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
      title="Create Quotation Template"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="Create"
      cancelText="Cancel"
      width={600}
      okButtonProps={{ loading }}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter a template name" }]}>
          <Input placeholder="Enter template name" />
        </Form.Item>

        <Form.Item
          name="formTemplateId"
          label="Form Template"
          rules={[{ required: true, message: "Please select a form template" }]}
        >
          <Select
            placeholder="Select form template"
            showSearch
            loading={loadingTemplates}
            filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
            options={formTemplates.map((template) => ({
              label: template.name || `Template ${template.id}`,
              value: template.id,
            }))}
          />
        </Form.Item>

        <Form.Item name="type" label="Type" initialValue="Quotation">
          <Input placeholder="Enter type" defaultValue="Quotation" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default QuotationTemplateCreateModal;
