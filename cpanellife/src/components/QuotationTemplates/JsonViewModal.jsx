import React, { useState, useEffect } from "react";
import { Modal, message } from "antd";
import { renderFormBuilderFields } from "./FormFieldRenderer";

const JsonViewModal = ({ open, onCancel, title, jsonData, isFormBuilder = false }) => {
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && jsonData) {
      try {
        // Handle both string and object JSON
        let parsed;
        if (typeof jsonData === "string") {
          parsed = JSON.parse(jsonData);
        } else if (typeof jsonData === "object") {
          parsed = jsonData;
        } else {
          throw new Error("Invalid JSON data type");
        }
        setParsedData(parsed);
        setError(null);
      } catch (err) {
        console.error("Error parsing JSON data:", err);
        setError("Failed to parse JSON data. The data may not be valid JSON.");
        setParsedData(null);
        message.error("Failed to parse JSON data");
      }
    } else {
      setParsedData(null);
      setError(null);
    }
  }, [open, jsonData]);

  return (
    <Modal
      title={title || "View Data"}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnHidden
    >
      {error ? (
        <div style={{ padding: "16px", color: "red" }}>{error}</div>
      ) : parsedData ? (
        <div style={{ padding: "16px 0" }}>
          {isFormBuilder || Array.isArray(parsedData) ? (
            renderFormBuilderFields(parsedData)
          ) : typeof parsedData === "object" ? (
            // For response JSON that's not formBuilder format, convert to form fields
            renderFormBuilderFields(
              Object.entries(parsedData).map(([key, value]) => {
                // Determine field type based on value
                let fieldType = "text";
                if (typeof value === "string" && value.length > 100) {
                  fieldType = "textarea";
                } else if (typeof value === "number") {
                  fieldType = "number";
                } else if (typeof value === "boolean") {
                  fieldType = "checkbox";
                } else if (Array.isArray(value)) {
                  fieldType = "checkbox-group";
                }

                return {
                  type: fieldType,
                  label: key,
                  value: value,
                  options: Array.isArray(value) ? value.map((v, i) => ({ label: String(v), value: v })) : [],
                };
              })
            )
          ) : (
            <div style={{ padding: "16px" }}>Invalid data format</div>
          )}
        </div>
      ) : (
        <div style={{ padding: "16px" }}>No data available</div>
      )}
    </Modal>
  );
};

export default JsonViewModal;

