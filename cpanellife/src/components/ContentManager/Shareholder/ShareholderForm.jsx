import React, { useEffect, useState, useMemo } from "react";
import { Form, Input, InputNumber, Button, Card, Row, Col } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import TextEditor from "../../TextEditor";

const ShareholderForm = ({ form: externalForm, initialValues, onSubmit, loading = false }) => {
  const [internalForm] = Form.useForm();
  const form = externalForm || internalForm;
  const [formValues, setFormValues] = useState({});

  // Transform initial values to match form structure
  // Handle API typo: descrption -> description
  const initialFormValues = useMemo(() => {
    if (!initialValues) return null;
    return {
      title: initialValues.title || "",
      description: initialValues.descrption || initialValues.description || "",
      imageUrl: initialValues.imageUrl || "",
      displayOrder: initialValues.displayOrder || 0,
      share: initialValues.share || "",
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
        description: "",
        imageUrl: "",
        displayOrder: 0,
        share: "",
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
      formValues.description !== initialFormValues.description ||
      formValues.imageUrl !== initialFormValues.imageUrl ||
      formValues.displayOrder !== initialFormValues.displayOrder ||
      formValues.share !== initialFormValues.share
    );
  }, [initialFormValues, formValues]);

  const handleSubmit = (values) => {
    // Transform form values to match API structure (PascalCase)
    const submitData = {
      Title: values.title,
      Description: values.description || "",
      ImageUrl: values.imageUrl,
      DisplayOrder: values.displayOrder || 0,
      Share: values.share,
    };

    // Include id if it's an update
    if (initialValues?.id) {
      submitData.Id = initialValues.id;
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
        description: "",
        imageUrl: "",
        displayOrder: 0,
        share: "",
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
              label="Title"
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
              name="imageUrl"
              label="Image URL"
              rules={[{ required: true, message: "Please enter an image URL" }]}
            >
              <Input placeholder="Enter image URL" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6} lg={6}>
            <Form.Item
              name="displayOrder"
              label="Display Order"
              rules={[{ required: true, message: "Please enter display order" }]}
            >
              <InputNumber min={0} placeholder="Enter display order" style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6} lg={6}>
            <Form.Item
              name="share"
              label="Share"
              rules={[
                { required: true, message: "Please enter share percentage" },
                { max: 50, message: "Share must be less than 50 characters" },
              ]}
            >
              <Input placeholder="Enter share (e.g., 50%)" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24}>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ max: 5000, message: "Description must be less than 5000 characters" }]}
              getValueFromEvent={(value) => value || ""}
            >
              <TextEditor
                placeholder="Enter description"
                height="200px"
                key={`description-${initialValues?.id || "new"}`}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </Form>
  );
};

export default ShareholderForm;
