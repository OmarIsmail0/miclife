import React from "react";
import { Button, Popconfirm, Space } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const QuotationTemplateActions = ({ template, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (onDelete) {
      onDelete(template.id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(template);
    }
  };

  return (
    <Space size="small">
      <Button type="link" icon={<EditOutlined />} onClick={handleEdit} title="Edit Template">
        Edit
      </Button>
      <Popconfirm
        title="Delete Template"
        description="Are you sure you want to delete this quotation template?"
        onConfirm={handleDelete}
        okText="Yes"
        cancelText="No"
        okButtonProps={{ danger: true }}
      >
        <Button type="link" danger icon={<DeleteOutlined />} title="Delete Template">
          Delete
        </Button>
      </Popconfirm>
    </Space>
  );
};

export default QuotationTemplateActions;

