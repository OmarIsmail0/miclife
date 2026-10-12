import React, { useEffect, useState, useMemo } from "react";
import { Form, Input, Button, Card, Row, Col } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import TextEditor from "../../TextEditor";

const BoardMemberForm = ({ form: externalForm, initialValues, onSubmit, loading = false }) => {
  const [internalForm] = Form.useForm();
  const form = externalForm || internalForm;
  const [formValues, setFormValues] = useState({});

  // Transform initial values to match form structure
  const initialFormValues = useMemo(() => {
    if (!initialValues) return null;
    return {
      name: initialValues.name || "",
      title: initialValues.title || "",
      description: initialValues.description || "",
      imageUrl: initialValues.imageUrl || "",
      iconUrl: initialValues.iconUrl || "",
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
        name: "",
        title: "",
        description: "",
        imageUrl: "",
        iconUrl: "",
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
      formValues.name !== initialFormValues.name ||
      formValues.title !== initialFormValues.title ||
      formValues.description !== initialFormValues.description ||
      formValues.imageUrl !== initialFormValues.imageUrl ||
      formValues.iconUrl !== initialFormValues.iconUrl
    );
  }, [initialFormValues, formValues]);

  const handleSubmit = (values) => {
    // Transform form values to match API structure (PascalCase)
    const submitData = {
      Name: values.name,
      Title: values.title,
      Description: values.description || "",
      ImageUrl: values.imageUrl,
      IconUrl: values.iconUrl,
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
        name: "",
        title: "",
        description: "",
        imageUrl: "",
        iconUrl: "",
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
        style={{ marginBottom: 16 }}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              name="name"
              label="Name"
              rules={[
                { required: true, message: "Please enter a name" },
                { max: 200, message: "Name must be less than 200 characters" },
              ]}
            >
              <Input placeholder="Enter name" />
            </Form.Item>
          </Col>
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

          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              name="iconUrl"
              label="Icon URL"
              rules={[{ required: true, message: "Please enter an icon URL" }]}
            >
              <Input placeholder="Enter icon URL" />
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
                style={{ width: "100%", height: "100%" }}
                placeholder="Enter description"
                height="300px"
                key={`description-${initialValues?.id || "new"}`}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </Form>
  );
};

export default BoardMemberForm;
