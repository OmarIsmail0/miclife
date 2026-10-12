import React, { useEffect, useState, useMemo } from "react";
import { Form, Input, Switch, InputNumber, Button, Card, Row, Col, Select } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import TextEditor from "../TextEditor";

const LANGUAGE_OPTIONS = [
  { label: "English", value: "en" },
  { label: "Arabic", value: "ar" },
];

const AlbumForm = ({ form: externalForm, initialValues, onSubmit, loading = false, albumTypeOptions = [] }) => {
  const [internalForm] = Form.useForm();
  const form = externalForm || internalForm;
  const [formValues, setFormValues] = useState({});

  // Transform initial values to match form structure
  const initialFormValues = useMemo(() => {
    if (!initialValues) return null;
    return {
      displayOrder: initialValues.displayOrder ?? 0,
      isActive: initialValues.isActive ?? true,
      type: initialValues.type ?? undefined,
      translations: (() => {
        const existingTranslations = initialValues.translations || [];
        const translationsMap = {};

        // Map existing translations by language code
        existingTranslations.forEach((trans) => {
          translationsMap[trans.languageCode] = {
            id: trans.id,
            languageCode: trans.languageCode || "",
            name: trans.name || "",
            description: trans.description || "",
          };
        });

        // Ensure both English and Arabic are present
        const result = [];

        // Add English (existing or new)
        result.push(
          translationsMap["en"] || {
            languageCode: "en",
            name: "",
            description: "",
          }
        );

        // Add Arabic (existing or new)
        result.push(
          translationsMap["ar"] || {
            languageCode: "ar",
            name: "",
            description: "",
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
        displayOrder: 0,
        translations: [
          {
            languageCode: "en",
            name: "",
            description: "",
          },
          {
            languageCode: "ar",
            name: "",
            description: "",
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
      formValues.displayOrder !== initialFormValues.displayOrder ||
      formValues.isActive !== initialFormValues.isActive ||
      formValues.type !== initialFormValues.type;

    // Compare translations
    const translationsChanged =
      JSON.stringify(formValues.translations || []) !== JSON.stringify(initialFormValues.translations || []);

    return basicChanged || translationsChanged;
  }, [initialFormValues, formValues]);

  const handleSubmit = (values) => {
    // Transform form values to match API structure
    const submitData = {
      DisplayOrder: values.displayOrder ?? 0,
      IsActive: values.isActive ?? true,
      Type: values.type,
      Translations: values.translations
        .filter((trans) => trans.languageCode && trans.name) // Filter out empty translations
        .map((trans) => ({
          ...(trans.id && { id: trans.id }), // Include id only if it exists (for updates)
          LanguageCode: trans.languageCode,
          Name: trans.name,
          Description: trans.description || "",
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
        displayOrder: 0,
        translations: [
          {
            languageCode: "en",
            name: "",
            description: "",
          },
          {
            languageCode: "ar",
            name: "",
            description: "",
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
              name="type"
              label="Album Type"
              rules={[{ required: true, message: "Please select an album type" }]}
            >
              <Select options={albumTypeOptions} placeholder="Select album type" disabled={!!initialValues?.id} />
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
                  <React.Fragment key={key}>
                    <Form.Item {...restField} name={[name, "languageCode"]} label="Language">
                      <Select disabled options={LANGUAGE_OPTIONS} placeholder="Select language" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "name"]}
                      label="Name"
                      rules={[
                        { required: true, message: "Please enter name" },
                        { max: 200, message: "Name must be less than 200 characters" },
                      ]}
                    >
                      <Input placeholder="Enter album name" />
                    </Form.Item>

                    {/* Hidden field to preserve translation ID if it exists */}
                    {initialFormValues?.translations?.[name]?.id && (
                      <Form.Item {...restField} name={[name, "id"]} hidden>
                        <Input type="hidden" />
                      </Form.Item>
                    )}

                    <Form.Item
                      {...restField}
                      name={[name, "description"]}
                      label="Description"
                      rules={[{ max: 5000, message: "Description must be less than 5000 characters" }]}
                      getValueFromEvent={(value) => value || ""}
                    >
                      <TextEditor
                        placeholder="Enter album description"
                        height="200px"
                        key={`album-description-${initialValues?.id || "new"}-${name}-${
                          initialFormValues?.translations?.[name]?.languageCode || ""
                        }`}
                      />
                    </Form.Item>
                  </React.Fragment>
                </Col>
              ))}
            </Row>
          )}
        </Form.List>
      </Card>
    </Form>
  );
};

export default AlbumForm;
