import React, { useEffect, useState } from "react";
import { Modal, Form, Select, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { updateTicket, createTicketActivity } from "../../store/ticketManagerSlice";

const { TextArea } = Input;

const TicketEditModal = ({ open, onCancel, ticket, ticketTypes = [], ticketStatuses = [], onSuccess }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && ticket) {
      form.setFieldsValue({
        ticketType: ticket.ticketType,
        ticketStatus: ticket.ticketStatus,
        ticketComment: "",
      });
    }
  }, [open, ticket, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const updates = [];

      // Check if ticket type or status changed
      if (values.ticketType !== ticket.ticketType || values.ticketStatus !== ticket.ticketStatus) {
        updates.push(
          dispatch(
            updateTicket({
              Id: ticket.id,
              TicketType: values.ticketType,
              TicketStatus: values.ticketStatus,
              Title: ticket.title,
              Description: ticket.description,
              Email: ticket.email,
              Phone: ticket.phone,
            })
          ).unwrap()
        );
      }

      // If comment provided, create activity
      if (values.ticketComment && values.ticketComment.trim()) {
        updates.push(
          dispatch(
            createTicketActivity({
              TicketId: ticket.id,
              TicketComment: values.ticketComment.trim(),
            })
          ).unwrap()
        );
      }

      await Promise.all(updates);

      message.success("Ticket updated successfully");
      form.resetFields();
      if (onSuccess) {
        onSuccess();
      }
      onCancel();
    } catch (error) {
      console.error("Error updating ticket:", error);
      message.error(error?.message || "Failed to update ticket");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Edit Ticket"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="Update"
      cancelText="Cancel"
      width={600}
      okButtonProps={{ loading }}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="ticketType"
          label="Ticket Type"
          rules={[{ required: true, message: "Please select a ticket type" }]}
        >
          <Select
            placeholder="Select ticket type"
            showSearch
            filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
            options={ticketTypes.map((type) => {
              return {
                label: type.name,
                value: type.value,
              };
            })}
          />
        </Form.Item>

        <Form.Item
          name="ticketStatus"
          label="Ticket Status"
          rules={[{ required: true, message: "Please select a ticket status" }]}
        >
          <Select
            placeholder="Select ticket status"
            showSearch
            filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
            options={ticketStatuses.map((status) => {
              return {
                label: status.name,
                value: status.value,
              };
            })}
          />
        </Form.Item>

        <Form.Item
          name="ticketComment"
          label="Add Activity Comment (Optional)"
          rules={[
            {
              max: 1000,
              message: "Comment must be less than 1000 characters",
            },
          ]}
        >
          <TextArea rows={4} placeholder="Enter a comment to add as a new activity..." showCount maxLength={1000} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TicketEditModal;
