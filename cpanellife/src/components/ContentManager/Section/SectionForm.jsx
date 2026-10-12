import React, { useEffect, useState, useMemo } from "react";
import { Form, Input, Switch, Button, Card, Row, Col, Select } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import TextEditor from "../../TextEditor";

const LANGUAGE_OPTIONS = [
  { label: "English", value: "en" },
  { label: "Arabic", value: "ar" },
];

const SectionForm = ({ form: externalForm, initialValues, onSubmit, loading = false }) => {
  const [internalForm] = Form.useForm();
  const form = externalForm || internalForm;
  const [formValues, setFormValues] = useState({});

  // Transform initial values to match form structure
  const initialFormValues = useMemo(() => {
    if (!initialValues) return null;
    return {
      slug: initialValues.slug || "",
      sectionKey: initialValues.sectionKey || "",
      imageUrl: initialValues.imageUrl || "",
      isActive: initialValues.isActive ?? true,
      translations: (() => {
        const existingTranslations = initialValues.translations || [];
        const translationsMap = {};

        // Map existing translations by language code
        existingTranslations.forEach((trans) => {
          translationsMap[trans.languageCode] = {
            id: trans.id,
            languageCode: trans.languageCode || "",
            title: trans.title || "",
            content: trans.content || "",
            seO_Title: trans.seO_Title || "",
            seO_Description: trans.seO_Description || "",
          };
        });

        // Ensure both English and Arabic are present
        const result = [];

        // Add English (existing or new)
        result.push(
          translationsMap["en"] || {
            languageCode: "en",
            title: "",
            content: "",
            seO_Title: "",
            seO_Description: "",
          }
        );

        // Add Arabic (existing or new)
        result.push(
          translationsMap["ar"] || {
            languageCode: "ar",
            title: "",
            content: "",
            seO_Title: "",
            seO_Description: "",
          }
        );

        // Add any other language translations that might exist
        Object.keys(translationsMap).forEach((code) => {
          if (code !== "en" && code !== "ar") {
            result.push(translationsMap[code]);
          }
        });

        return result;
      })(),
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
      // Reset form for new entry - include both English and Arabic by default
      form.resetFields();
      const defaultValues = {
        isActive: true,
        translations: [
          {
            languageCode: "en",
            title: "",
            content: "",
            seO_Title: "",
            seO_Description: "",
          },
          {
            languageCode: "ar",
            title: "",
            content: "",
            seO_Title: "",
            seO_Description: "",
          },
        ],
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

    // Compare basic fields
    const basicChanged =
      formValues.slug !== initialFormValues.slug ||
      formValues.sectionKey !== initialFormValues.sectionKey ||
      formValues.imageUrl !== initialFormValues.imageUrl ||
      formValues.isActive !== initialFormValues.isActive;

    // Compare translations
    const translationsChanged =
      JSON.stringify(formValues.translations || []) !== JSON.stringify(initialFormValues.translations || []);

    return basicChanged || translationsChanged;
  }, [initialFormValues, formValues]);

  const handleSubmit = (values) => {
    // Transform form values to match API structure
    const submitData = {
      slug: values.slug,
      sectionKey: values.sectionKey,
      imageUrl: values.imageUrl,
      isActive: values.isActive ?? true,
      translations: values.translations
        .filter((trans) => trans.languageCode && trans.title) // Filter out empty translations
        .map((trans) => ({
          ...(trans.id && { id: trans.id }), // Include id only if it exists (for updates)
          languageCode: trans.languageCode,
          title: trans.title,
          content: trans.content || "",
          seO_Title: trans.seO_Title || "",
          seO_Description: trans.seO_Description || "",
        })),
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
        isActive: true,
        translations: [
          {
            languageCode: "en",
            title: "",
            content: "",
            seO_Title: "",
            seO_Description: "",
          },
          {
            languageCode: "ar",
            title: "",
            content: "",
            seO_Title: "",
            seO_Description: "",
          },
        ],
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
          <Col xs={24} sm={12} md={6} lg={6}>
            <Form.Item
              name="slug"
              label="Slug"
              rules={[
                { required: true, message: "Please enter a slug" },
                { max: 100, message: "Slug must be less than 100 characters" },
              ]}
            >
              <Input placeholder="Enter slug (e.g., ABOUT-US)" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6} lg={6}>
            <Form.Item
              name="sectionKey"
              label="Section Key"
              rules={[
                { required: true, message: "Please enter a section key" },
                { max: 100, message: "Section key must be less than 100 characters" },
              ]}
            >
              <Input placeholder="Enter section key (e.g., ABOUT-US)" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6} lg={6}>
            <Form.Item
              name="imageUrl"
              label="Image URL"
              rules={[{ required: true, message: "Please enter an image URL" }]}
            >
              <Input placeholder="Enter image URL" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6} lg={6}>
            <Form.Item name="isActive" label="Status" valuePropName="checked">
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="Translations">
        <Form.List name="translations">
          {(fields) => (
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              {fields.map(({ key, name, ...restField }) => (
                <Col xs={24} sm={24} md={12} lg={12} key={key}>
                  <Card key={key} size="small" style={{ marginBottom: 16 }}>
                    <Form.Item {...restField} name={[name, "languageCode"]} label="Language">
                      <Select disabled options={LANGUAGE_OPTIONS} placeholder="Select language" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "title"]}
                      label="Title"
                      rules={[
                        { required: true, message: "Please enter title" },
                        { max: 200, message: "Title must be less than 200 characters" },
                      ]}
                    >
                      <Input placeholder="Enter translated title" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "seO_Title"]}
                      label="SEO Title"
                      rules={[{ max: 200, message: "SEO Title must be less than 200 characters" }]}
                    >
                      <Input placeholder="Enter SEO title" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "seO_Description"]}
                      label="SEO Description"
                      rules={[{ max: 500, message: "SEO Description must be less than 500 characters" }]}
                    >
                      <Input.TextArea rows={2} placeholder="Enter SEO description" showCount maxLength={500} />
                    </Form.Item>

                    {/* Hidden field to preserve translation ID if it exists */}
                    {initialFormValues?.translations?.[name]?.id && (
                      <Form.Item {...restField} name={[name, "id"]} hidden>
                        <Input type="hidden" />
                      </Form.Item>
                    )}
                    <Form.Item
                      {...restField}
                      name={[name, "content"]}
                      label="Content"
                      rules={[{ max: 5000, message: "Content must be less than 5000 characters" }]}
                      getValueFromEvent={(value) => value || ""}
                    >
                      <TextEditor
                        placeholder="Enter translated content"
                        height="200px"
                        key={`section-content-${initialValues?.id || "new"}-${name}-${
                          initialFormValues?.translations?.[name]?.languageCode || ""
                        }`}
                      />
                    </Form.Item>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Form.List>
      </Card>
    </Form>
  );
};

export default SectionForm;
