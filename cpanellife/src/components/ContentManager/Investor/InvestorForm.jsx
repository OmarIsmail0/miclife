import React, { useEffect, useState, useMemo } from "react";
import { Form, Input, Button, Card, Row, Col } from "antd";
import { SaveOutlined } from "@ant-design/icons";

const InvestorForm = ({ form: externalForm, initialValues, onSubmit, loading = false }) => {
  const [internalForm] = Form.useForm();
  const form = externalForm || internalForm;
  const [formValues, setFormValues] = useState({});

  // Transform initial values to match form structure
  const initialFormValues = useMemo(() => {
    if (!initialValues) return null;
    return {
      title: initialValues.title || "",
      urlFrm: initialValues.urlFrm || "",
      urlFrmAr: initialValues.urlFrmAr || "",
      titleAr: initialValues.titleAr || "",
      imageUrl: initialValues.imageUrl || "",
    };
  }, [initialValues]);

  useEffect(() => {
    if (!form) return;

    if (initialFormValues) {
      form.setFieldsValue(initialFormValues);
      // Set formValues after a tick to ensure form is updated
      setTimeout(() => {
        const currentValues = form.getFieldsValue();
        setFormValues(currentValues);
      }, 0);
    } else {
      // Reset form for new entry
      form.resetFields();
      const defaultValues = {
        title: "",
        urlFrm: "",
        urlFrmAr: "",
        titleAr: "",
        imageUrl: "",
      };
      form.setFieldsValue(defaultValues);
      setFormValues(defaultValues);
    }
  }, [initialFormValues, form]);

  // Track form value changes
  const handleValuesChange = (changedValues, allValues) => {
    setFormValues(allValues);
  };

  // Check if form has changed
  const hasChanges = useMemo(() => {
    if (!initialFormValues || !formValues) return false;

    return (
      formValues.title !== initialFormValues.title ||
      formValues.urlFrm !== initialFormValues.urlFrm ||
      formValues.urlFrmAr !== initialFormValues.urlFrmAr ||
      formValues.titleAr !== initialFormValues.titleAr ||
      formValues.imageUrl !== initialFormValues.imageUrl
    );
  }, [initialFormValues, formValues]);

  const handleSubmit = (values) => {
    // Transform form values to match API structure
    const submitData = {
      title: values.title,
      urlFrm: values.urlFrm,
      urlFrmAr: values.urlFrmAr,
      titleAr: values.titleAr,
      imageUrl: values.imageUrl,
    };

    // Include id if it's an update
    if (initialValues?.id) {
      submitData.id = initialValues.id;
    }

    onSubmit?.(submitData);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      onValuesChange={handleValuesChange}
      initialValues={{
        title: "",
        urlFrm: "",
        urlFrmAr: "",
        titleAr: "",
        imageUrl: "",
      }}
    >
      <Card
        title="Basic Information"
        extra={
          initialValues?.id ? (
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => form.submit()}
              disabled={!hasChanges || loading}
              loading={loading}
            >
              Update
            </Button>
          ) : null
        }
        style={{ marginBottom: 10 }}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              name="title"
              label="Title (English)"
              rules={[
                { required: true, message: "Please enter a title" },
                { max: 200, message: "Title must be less than 200 characters" },
              ]}
            >
              <Input placeholder="Enter title" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              name="titleAr"
              label="Title (Arabic)"
              rules={[
                { required: true, message: "Please enter a title" },
                { max: 200, message: "Title must be less than 200 characters" },
              ]}
            >
              <Input placeholder="Enter title" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              name="urlFrm"
              label="URL From (English)"
              rules={[
                { required: true, message: "Please enter URL from" },
                { max: 500, message: "URL must be less than 500 characters" },
              ]}
            >
              <Input placeholder="Enter URL from" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              name="urlFrmAr"
              label="URL From (Arabic)"
              rules={[
                { required: true, message: "Please enter URL from (Arabic)" },
                { max: 500, message: "URL must be less than 500 characters" },
              ]}
            >
              <Input placeholder="Enter URL from (Arabic)" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              name="imageUrl"
              label="Image URL"
              rules={[{ required: true, message: "Please enter an image URL" }]}
            >
              <Input placeholder="Enter image URL" />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </Form>
  );
};

export default InvestorForm;
