import React, { memo, useEffect, useState, useMemo } from "react";
import { Table, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import QuotationTemplateActions from "./QuotationTemplateActions";
import { formTemplateService } from "../../api";
import { formatDate } from "../TicketManager/utils/dateFormatter";

const QuotationTemplatesTable = memo(
  ({ templates = [], loading = false, onEdit, onDelete, onViewTemplate, onViewResponse }) => {
    const [formTemplates, setFormTemplates] = useState([]);

    useEffect(() => {
      const fetchFormTemplates = async () => {
        try {
          const response = await formTemplateService.getAll({ PageNumber: 1, PageSize: 1000 });
          const templatesList = response.data || response || [];
          setFormTemplates(templatesList);
        } catch (error) {
          console.error("Error fetching form templates:", error);
        }
      };
      fetchFormTemplates();
    }, []);

    const formTemplateMap = useMemo(() => {
      return formTemplates.reduce((acc, template) => {
        acc[template.id] = template.name || `Template ${template.id}`;
        return acc;
      }, {});
    }, [formTemplates]);
    const columns = [
      {
        title: "Code",
        dataIndex: "randomId",
        key: "randomId",
        width: 150,
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        ellipsis: true,
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
        width: 150,
      },
      {
        title: "Creation Date",
        key: "creationDate",
        width: 200,
        render: (_, record) => {
          // Try different possible field names for creation date
          const date =
            record.createdAt || record.createdDate || record.creationDate || record.dateCreated || record.created;
          return formatDate(date);
        },
      },
      {
        title: "Expiration Date",
        dataIndex: "expiration",
        key: "expiration",
        width: 200,
        render: (date) => {
          return formatDate(date);
        },
      },
      {
        title: "Template",
        key: "template",
        width: 120,
        render: (_, record) => {
          if (record.formTemplate && record.formTemplate.design) {
            return (
              <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => onViewTemplate && onViewTemplate(record.formTemplate.design)}
                title="View Template Design"
                size="small"
              >
                View
              </Button>
            );
          }
          return "N/A";
        },
      },
      {
        title: "Template ID",
        dataIndex: "formTemplateId",
        key: "formTemplateId",
        width: 200,
        render: (formTemplateId) => {
          return formTemplateMap[formTemplateId] || formTemplateId || "N/A";
        },
      },
      {
        title: "Response",
        key: "response",
        width: 120,
        render: (_, record) => {
          if (record.replyJson) {
            return (
              <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => onViewResponse && onViewResponse(record.replyJson)}
                title="View Response JSON"
                size="small"
              >
                View
              </Button>
            );
          }
          return "N/A";
        },
      },
      {
        title: "Actions",
        key: "actions",
        fixed: "right",
        width: 200,
        render: (_, record) => <QuotationTemplateActions template={record} onEdit={onEdit} onDelete={onDelete} />,
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={templates}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          showTotal: (total) => `Total ${total} templates`,
        }}
        scroll={{ x: "max-content" }}
      />
    );
  }
);

QuotationTemplatesTable.displayName = "QuotationTemplatesTable";

export default QuotationTemplatesTable;
