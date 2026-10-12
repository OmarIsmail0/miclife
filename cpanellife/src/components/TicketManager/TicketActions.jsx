import React from "react";
import { Button, Popconfirm, Space } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const TicketActions = ({ ticket, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (onDelete) {
      onDelete(ticket.id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(ticket);
    }
  };

  return (
    <Space size="small">
      <Button type="link" icon={<EditOutlined />} onClick={handleEdit} title="Edit Ticket">
        Edit
      </Button>
      <Popconfirm
        title="Delete Ticket"
        description="Are you sure you want to delete this ticket?"
        onConfirm={handleDelete}
        okText="Yes"
        cancelText="No"
        okButtonProps={{ danger: true }}
      >
        <Button type="link" danger icon={<DeleteOutlined />} title="Delete Ticket">
          Delete
        </Button>
      </Popconfirm>
    </Space>
  );
};

export default TicketActions;
