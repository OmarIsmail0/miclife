import React, { useEffect, useState, useMemo } from "react";
import { Form, Input, Switch, InputNumber, Button, Card, Row, Col } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import TextEditor from "../../TextEditor";

const QuestionForm = ({ form: externalForm, initialValues, onSubmit, loading = false }) => {
  const [internalForm] = Form.useForm();
  const form = externalForm || internalForm;
  const [formValues, setFormValues] = useState({});

  // Transform initial values to match form structure
  const initialFormValues = useMemo(() => {
    if (!initialValues) return null;
    return {
      questionText: initialValues.questionText || "",
      answer: initialValues.answer || "",
      displayOrder: initialValues.displayOrder || 0,
      isActive: initialValues.isActive ?? true,
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
        questionText: "",
        answer: "",
        displayOrder: 0,
        isActive: true,
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
      formValues.questionText !== initialFormValues.questionText ||
      formValues.answer !== initialFormValues.answer ||
      formValues.displayOrder !== initialFormValues.displayOrder ||
      formValues.isActive !== initialFormValues.isActive
    );
  }, [initialFormValues, formValues]);

  const handleSubmit = (values) => {
    // Transform form values to match API structure
    const submitData = {
      questionText: values.questionText,
      answer: values.answer,
      displayOrder: values.displayOrder || 0,
      isActive: values.isActive ?? true,
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
        questionText: "",
        answer: "",
        displayOrder: 0,
        isActive: true,
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
              name="questionText"
              label="Question"
              rules={[
                { required: true, message: "Please enter a question" },
                { max: 500, message: "Question must be less than 500 characters" },
              ]}
            >
              <Input placeholder="Enter question text" />
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

        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <Form.Item
              name="answer"
              label="Answer"
              rules={[
                { required: true, message: "Please enter an answer" },
                { max: 5000, message: "Answer must be less than 5000 characters" },
              ]}
              getValueFromEvent={(value) => value || ""}
            >
              <TextEditor placeholder="Enter answer text" height="200px" key={`answer-${initialValues?.id || "new"}`} />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </Form>
  );
};

export default QuestionForm;
