import React, { useState, useMemo, memo } from "react";
import { Table, Tag, Button } from "antd";
import { FilterOutlined, EyeOutlined } from "@ant-design/icons";
import TicketActions from "./TicketActions";
import TicketActivitiesTable from "./TicketActivitiesTable";
import { formatDate } from "./utils/dateFormatter";

const TicketTable = memo(
  ({
    tickets = [],
    loading = false,
    ticketTypes = [],
    ticketStatuses = [],
    onFilterChange,
    onEdit,
    onDelete,
    onView,
  }) => {
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    // Create lookup maps for ticket types and statuses with better property detection
    const ticketTypeMap = useMemo(() => {
      return ticketTypes.reduce((acc, type) => {
        const id = type.id || type.Id || type.value;
        const name = type.name || type.Name || type.title || type.Title || type.label || type.Label || `Type ${id}`;
        if (id !== undefined) {
          acc[id] = name;
        }
        return acc;
      }, {});
    }, [ticketTypes]);

    const ticketStatusMap = useMemo(() => {
      return ticketStatuses.reduce((acc, status) => {
        const id = status.id || status.Id || status.value;
        const name =
          status.name || status.Name || status.title || status.Title || status.label || status.Label || `Status ${id}`;
        if (id !== undefined) {
          acc[id] = name;
        }
        return acc;
      }, {});
    }, [ticketStatuses]);

    // Get tag color based on status name
    const getStatusColor = (statusId) => {
      const statusName = (ticketStatusMap[statusId] || "").toLowerCase();
      if (statusName.includes("resolved") || statusName.includes("closed") || statusName.includes("completed")) {
        return "green";
      }
      if (statusName.includes("in progress") || statusName.includes("processing") || statusName.includes("active")) {
        return "blue";
      }
      if (statusName.includes("open") || statusName.includes("pending") || statusName.includes("new")) {
        return "orange";
      }
      if (statusName.includes("cancelled") || statusName.includes("rejected") || statusName.includes("deleted")) {
        return "red";
      }
      if (statusName.includes("on hold") || statusName.includes("waiting")) {
        return "purple";
      }
      return "default";
    };

    // Get tag color for ticket type (different colors for different types)
    const getTypeColor = (typeId) => {
      const colors = ["blue", "cyan", "geekblue", "purple", "magenta", "volcano", "gold", "lime"];
      return colors[typeId % colors.length] || "blue";
    };

    // Handle filter changes
    const handleTypeFilterChange = (selectedKeys) => {
      if (onFilterChange) {
        if (selectedKeys && selectedKeys.length > 0) {
          onFilterChange({ TicketType: selectedKeys[0] });
        } else {
          onFilterChange({ TicketType: null });
        }
      }
    };

    const handleStatusFilterChange = (selectedKeys) => {
      if (onFilterChange) {
        if (selectedKeys && selectedKeys.length > 0) {
          onFilterChange({ TicketStatus: selectedKeys[0] });
        } else {
          onFilterChange({ TicketStatus: null });
        }
      }
    };

    const columns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: 80,
        fixed: "left",
      },
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
        ellipsis: true,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        ellipsis: true,
      },
      {
        title: "Phone",
        dataIndex: "phone",
        key: "phone",
        ellipsis: true,
      },
      {
        title: "Ticket Type",
        dataIndex: "ticketType",
        key: "ticketType",
        render: (typeId) => <Tag color={getTypeColor(typeId)}>{ticketTypeMap[typeId] || `Type ${typeId}`}</Tag>,
        onFilter: (value, record) => {
          return record.ticketType === value;
        },
        filters: ticketTypes.map((type) => {
          const id = type.id || type.Id || type.value;
          const name = type.name || type.Name || type.title || type.Title || type.label || type.Label || `Type ${id}`;
          return {
            text: name,
            value: id,
          };
        }),
        filterIcon: (filtered) => <FilterOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
      },
      {
        title: "Ticket Status",
        dataIndex: "ticketStatus",
        key: "ticketStatus",
        render: (statusId) => (
          <Tag color={getStatusColor(statusId)}>{ticketStatusMap[statusId] || `Status ${statusId}`}</Tag>
        ),
        onFilter: (value, record) => {
          return record.ticketStatus === value;
        },
        filters: ticketStatuses.map((status) => {
          const id = status.id || status.Id || status.value;
          const name =
            status.name ||
            status.Name ||
            status.title ||
            status.Title ||
            status.label ||
            status.Label ||
            `Status ${id}`;
          return {
            text: name,
            value: id,
          };
        }),
        filterIcon: (filtered) => <FilterOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date) => formatDate(date),
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        ellipsis: true,
        render: (description, record) => {
          if (record.isForm) {
            return (
              <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => onView && onView(record)}
                title="View Form"
                size="small"
              >
                View
              </Button>
            );
          }
          return description || "N/A";
        },
      },
      {
        title: "Actions",
        key: "actions",
        fixed: "right",
        width: 200,
        render: (_, record) => <TicketActions ticket={record} onEdit={onEdit} onDelete={onDelete} />,
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={tickets}
        rowKey="id"
        loading={loading}
        onChange={(paginationInfo, filtersInfo) => {
          if (filtersInfo && filtersInfo.ticketType !== undefined) {
            handleTypeFilterChange(filtersInfo.ticketType || []);
          }
          if (filtersInfo && filtersInfo.ticketStatus !== undefined) {
            handleStatusFilterChange(filtersInfo.ticketStatus || []);
          }
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          showTotal: (total) => `Total ${total} tickets`,
        }}
        expandable={{
          expandedRowKeys,
          onExpandedRowsChange: setExpandedRowKeys,
          expandedRowRender: (record) => <TicketActivitiesTable activities={record.ticketActivities || []} />,
          rowExpandable: (record) => record.ticketActivities && record.ticketActivities.length > 0,
        }}
        scroll={{ x: "max-content" }}
      />
    );
  }
);

TicketTable.displayName = "TicketTable";

export default TicketTable;
