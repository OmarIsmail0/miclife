import React, { useState, useEffect } from "react";
import { Modal, message } from "antd";
import { renderFormFields } from "./utils/formRenderer";

const TicketFormViewModal = ({ open, onCancel, ticket }) => {
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && ticket?.description) {
      try {
        const parsed = JSON.parse(ticket.description);
        setParsedData(parsed);
        setError(null);
      } catch (err) {
        console.error("Error parsing form data:", err);
        setError("Failed to parse form data. The description may not be valid JSON.");
        setParsedData(null);
        message.error("Failed to parse form data");
      }
    } else {
      setParsedData(null);
      setError(null);
    }
  }, [open, ticket]);

  return (
    <Modal
      title={`View Form - ${ticket?.title || "Ticket"}`}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnHidden
    >
      {error ? (
        <div style={{ padding: "16px", color: "red" }}>{error}</div>
      ) : parsedData ? (
        <div style={{ padding: "16px 0" }}>{renderFormFields(parsedData)}</div>
      ) : (
        <div style={{ padding: "16px" }}>No form data available</div>
      )}
    </Modal>
  );
};

export default TicketFormViewModal;
