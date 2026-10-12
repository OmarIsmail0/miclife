import React from "react";
import { Descriptions } from "antd";

/**
 * Convert camelCase to Title Case
 * @param {string} str - camelCase string
 * @returns {string} Title Case string
 */
const toTitleCase = (str) => {
  if (!str) return "";
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
};

/**
 * Format field value for display
 * @param {any} value - Field value
 * @returns {string|React.ReactNode} Formatted value
 */
const formatValue = (value) => {
  if (value === null || value === undefined) {
    return "N/A";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(", ") : "Empty";
    }
    // For nested objects, display as formatted JSON
    return <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{JSON.stringify(value, null, 2)}</pre>;
  }

  return String(value);
};

/**
 * Render form fields dynamically from parsed data
 * @param {Object} parsedData - Parsed JSON object
 * @returns {React.ReactNode} Descriptions component with form fields
 */
export const renderFormFields = (parsedData) => {
  if (!parsedData || typeof parsedData !== "object") {
    return <div>No form data available</div>;
  }

  const items = Object.entries(parsedData).map(([key, value]) => ({
    key,
    label: toTitleCase(key),
    children: formatValue(value),
  }));

  return <Descriptions bordered column={1} items={items} />;
};
