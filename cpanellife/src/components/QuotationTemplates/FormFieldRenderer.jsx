import React from "react";
import { Form, Input, InputNumber, DatePicker, Select, Checkbox, Radio, Space } from "antd";
import dayjs from "dayjs";

const { TextArea } = Input;

/**
 * Render form fields from formBuilder design data
 * @param {Array} designData - Array of form field objects from formBuilder
 * @returns {React.ReactNode} Form with rendered fields
 */
export const renderFormBuilderFields = (designData) => {
  if (!designData || !Array.isArray(designData)) {
    return <div>No form data available</div>;
  }

  return (
    <Form layout="vertical" disabled>
      {designData.map((field, index) => {
        const key = field.id || field.name || `field-${index}`;
        const label = field.label || field.name || "";
        const value = field.value || field.defaultValue || "";

        switch (field.type) {
          case "header":
            const HeaderTag = field.subtype || "h3";
            return (
              <div key={key} style={{ marginBottom: 16 }}>
                <HeaderTag style={{ margin: 0 }}>{label}</HeaderTag>
              </div>
            );

          case "paragraph":
            return (
              <div key={key} style={{ marginBottom: 16 }}>
                <p style={{ margin: 0 }}>{label}</p>
              </div>
            );

          case "text":
            return (
              <Form.Item key={key} label={label} style={{ marginBottom: 16 }}>
                <Input value={value} placeholder={field.placeholder || ""} />
              </Form.Item>
            );

          case "textarea":
            return (
              <Form.Item key={key} label={label} style={{ marginBottom: 16 }}>
                <TextArea
                  value={value}
                  placeholder={field.placeholder || ""}
                  rows={field.rows || 4}
                  style={{ resize: "vertical" }}
                />
              </Form.Item>
            );

          case "number":
            return (
              <Form.Item key={key} label={label} style={{ marginBottom: 16 }}>
                <InputNumber value={value} style={{ width: "100%" }} placeholder={field.placeholder || ""} />
              </Form.Item>
            );

          case "date":
            return (
              <Form.Item key={key} label={label} style={{ marginBottom: 16 }}>
                <DatePicker
                  value={value ? dayjs(value) : null}
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  disabled
                />
              </Form.Item>
            );

          case "select":
          case "dropdown":
            const options = field.options || field.values || [];
            return (
              <Form.Item key={key} label={label} style={{ marginBottom: 16 }}>
                <Select value={value} style={{ width: "100%" }} disabled>
                  {options.map((option, optIndex) => {
                    const optValue = typeof option === "object" ? option.value || option.label : option;
                    const optLabel = typeof option === "object" ? option.label || option.value : option;
                    return (
                      <Select.Option key={optIndex} value={optValue}>
                        {optLabel}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            );

          case "checkbox-group":
            const checkboxOptions = field.options || field.values || [];
            return (
              <Form.Item key={key} label={label} style={{ marginBottom: 16 }}>
                <Checkbox.Group value={Array.isArray(value) ? value : value ? [value] : []} disabled>
                  <Space direction="vertical">
                    {checkboxOptions.map((option, optIndex) => {
                      const optValue = typeof option === "object" ? option.value || option.label : option;
                      const optLabel = typeof option === "object" ? option.label || option.value : option;
                      return (
                        <Checkbox key={optIndex} value={optValue}>
                          {optLabel}
                        </Checkbox>
                      );
                    })}
                  </Space>
                </Checkbox.Group>
              </Form.Item>
            );

          case "radio-group":
            const radioOptions = field.options || field.values || [];
            return (
              <Form.Item key={key} label={label} style={{ marginBottom: 16 }}>
                <Radio.Group value={value} disabled>
                  <Space direction="vertical">
                    {radioOptions.map((option, optIndex) => {
                      const optValue = typeof option === "object" ? option.value || option.label : option;
                      const optLabel = typeof option === "object" ? option.label || option.value : option;
                      return (
                        <Radio key={optIndex} value={optValue}>
                          {optLabel}
                        </Radio>
                      );
                    })}
                  </Space>
                </Radio.Group>
              </Form.Item>
            );

          case "checkbox":
            return (
              <Form.Item key={key} valuePropName="checked" style={{ marginBottom: 16 }}>
                <Checkbox checked={value} disabled>
                  {label}
                </Checkbox>
              </Form.Item>
            );

          case "button":
            return (
              <Form.Item key={key} style={{ marginBottom: 16 }}>
                <button type="button" disabled style={{ padding: "8px 16px", cursor: "not-allowed" }}>
                  {label || value || "Button"}
                </button>
              </Form.Item>
            );

          case "file":
            return (
              <Form.Item key={key} label={label} style={{ marginBottom: 16 }}>
                <Input value={value || "No file selected"} disabled />
              </Form.Item>
            );

          case "autocomplete":
            return (
              <Form.Item key={key} label={label} style={{ marginBottom: 16 }}>
                <Input value={value} placeholder={field.placeholder || ""} disabled />
              </Form.Item>
            );

          case "hidden":
            return null; // Don't render hidden fields

          default:
            // For unknown types, render as text input
            return (
              <Form.Item key={key} label={label || field.type} style={{ marginBottom: 16 }}>
                <Input value={typeof value === "object" ? JSON.stringify(value) : String(value || "")} disabled />
              </Form.Item>
            );
        }
      })}
    </Form>
  );
};

