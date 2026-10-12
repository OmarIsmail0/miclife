import React from "react";
import { Table, Empty } from "antd";
import { formatDate } from "./utils/dateFormatter";

const TicketActivitiesTable = ({ activities = [] }) => {
  const columns = [
    {
      title: "Comment",
      dataIndex: "ticketComment",
      key: "ticketComment",
      render: (text) => text || "N/A",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => formatDate(date),
    },
  ];

  if (!activities || activities.length === 0) {
    return (
      <div style={{ padding: "16px 0" }}>
        <Empty description="No activities found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    );
  }

  return (
    <Table
      columns={columns}
      dataSource={activities}
      rowKey="id"
      pagination={false}
      size="small"
      style={{ margin: "16px 0" }}
    />
  );
};

export default TicketActivitiesTable;
