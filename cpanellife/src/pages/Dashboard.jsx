import React, { useEffect } from "react";
import { Card, Row, Col, Statistic, Typography, Space } from "antd";
import {
  FileDoneOutlined,
  CodeSandboxOutlined,
  ScheduleOutlined,
  FolderOutlined,
  BlockOutlined,
  ShoppingOutlined,
  QuestionCircleOutlined,
  TeamOutlined,
  BankOutlined,
  ShopOutlined,
  AppstoreOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { COLORS } from "../constants/colors";
import { AUTH_CONFIG } from "../constants/config";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchDashboardStats } from "../store/dashboardSlice";

const { Title, Text } = Typography;

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading, lastFetchTime, cacheDuration } = useSelector((state) => state.dashboard);

  useEffect(() => {
    // Fetch stats if not cached or cache expired
    const hasNoData = Object.values(stats).every((v) => v === 0);
    const shouldFetch = !lastFetchTime || Date.now() - lastFetchTime > cacheDuration || hasNoData;

    if (shouldFetch) {
      dispatch(fetchDashboardStats());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, lastFetchTime, cacheDuration]);

  const statCards = [
    {
      title: "Files",
      value: stats.files,
      icon: <FileDoneOutlined style={{ fontSize: 24, color: COLORS.STEELBLUE }} />,
      link: AUTH_CONFIG.FILE_MANAGER,
      color: COLORS.STEELBLUE,
    },
    {
      title: "Tickets",
      value: stats.tickets,
      icon: <ScheduleOutlined style={{ fontSize: 24, color: COLORS.ORANGERED }} />,
      link: AUTH_CONFIG.TICKET_MANAGER,
      color: COLORS.ORANGERED,
    },
    {
      title: "Sections",
      value: stats.sections,
      icon: <FolderOutlined style={{ fontSize: 24, color: COLORS.ROYALBLUE }} />,
      link: `${AUTH_CONFIG.CONTENT_MANAGER}#sections`,
      color: COLORS.ROYALBLUE,
    },
    {
      title: "Blocks",
      value: stats.blocks,
      icon: <BlockOutlined style={{ fontSize: 24, color: COLORS.DARKSLATEBLUE }} />,
      link: `${AUTH_CONFIG.CONTENT_MANAGER}#blocks`,
      color: COLORS.DARKSLATEBLUE,
    },
    {
      title: "Products",
      value: stats.products,
      icon: <ShoppingOutlined style={{ fontSize: 24, color: COLORS.LIMEGREEN }} />,
      link: `${AUTH_CONFIG.CONTENT_MANAGER}#products`,
      color: COLORS.LIMEGREEN,
    },
    {
      title: "Questions",
      value: stats.questions,
      icon: <QuestionCircleOutlined style={{ fontSize: 24, color: COLORS.GOLDENROD }} />,
      link: `${AUTH_CONFIG.CONTENT_MANAGER}#questions`,
      color: COLORS.GOLDENROD,
    },
    {
      title: "Line of Business",
      value: stats.lobs,
      icon: <AppstoreOutlined style={{ fontSize: 24, color: COLORS.SKYBLUE }} />,
      link: `${AUTH_CONFIG.CONTENT_MANAGER}#lob`,
      color: COLORS.SKYBLUE,
    },
    {
      title: "Investors",
      value: stats.investors,
      icon: <TeamOutlined style={{ fontSize: 24, color: COLORS.DODGERBLUE }} />,
      link: `${AUTH_CONFIG.CONTENT_MANAGER}#investor`,
      color: COLORS.DODGERBLUE,
    },
    {
      title: "Board Members",
      value: stats.boardMembers,
      icon: <TeamOutlined style={{ fontSize: 24, color: COLORS.TOMATO }} />,
      link: `${AUTH_CONFIG.CONTENT_MANAGER}#boardMembers`,
      color: COLORS.TOMATO,
    },
    {
      title: "Shareholders",
      value: stats.shareholders,
      icon: <BankOutlined style={{ fontSize: 24, color: COLORS.MIDNIGHTBLUE }} />,
      link: `${AUTH_CONFIG.CONTENT_MANAGER}#shareholders`,
      color: COLORS.MIDNIGHTBLUE,
    },
    {
      title: "Branches",
      value: stats.branches,
      icon: <ShopOutlined style={{ fontSize: 24, color: COLORS.DARKORANGE }} />,
      link: `${AUTH_CONFIG.CONTENT_MANAGER}#branches`,
      color: COLORS.DARKORANGE,
    },
    {
      title: "Albums",
      value: stats.albums,
      icon: <FileImageOutlined style={{ fontSize: 24, color: COLORS.MEDIUMORCHID }} />,
      link: AUTH_CONFIG.MEDIA_MANAGER,
      color: COLORS.MEDIUMORCHID,
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={2} style={{ marginBottom: 8, color: COLORS.MIDNIGHTBLUE }}>
            Dashboard
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Welcome to the Control Panel. Here's an overview of your system.
          </Text>
        </div>

        <Row gutter={[16, 16]}>
          {statCards.map((stat, index) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={6} key={index}>
              <Link to={stat.link} style={{ textDecoration: "none" }}>
                <Card
                  hoverable
                  style={{
                    height: "100%",
                    borderRadius: 8,
                    border: `1px solid ${COLORS.LIGHTGRAY}`,
                    transition: "all 0.3s ease",
                  }}
                  bodyStyle={{ padding: 20 }}
                >
                  <Space direction="vertical" size="small" style={{ width: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Statistic
                        title={stat.title}
                        value={stat.value}
                        valueStyle={{ color: stat.color, fontWeight: 600 }}
                      />
                      {stat.icon}
                    </div>
                  </Space>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card
              title={
                <Space>
                  <CodeSandboxOutlined />
                  <span>Content Manager</span>
                </Space>
              }
              style={{
                borderRadius: 8,
                border: `1px solid ${COLORS.LIGHTGRAY}`,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
              bodyStyle={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Text style={{ flex: 1 }}>
                Manage your content including sections, blocks, products, questions, and more. Organize and maintain
                your content structure efficiently.
              </Text>
              <div style={{ marginTop: 16 }}>
                <Link to={AUTH_CONFIG.CONTENT_MANAGER}>
                  <Text strong style={{ color: COLORS.STEELBLUE }}>
                    Go to Content Manager →
                  </Text>
                </Link>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card
              title={
                <Space>
                  <FileDoneOutlined />
                  <span>File Manager</span>
                </Space>
              }
              style={{
                borderRadius: 8,
                border: `1px solid ${COLORS.LIGHTGRAY}`,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
              bodyStyle={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Text style={{ flex: 1 }}>
                Upload, organize, and manage your files. View and delete documents, images, and other media files stored
                in the system.
              </Text>
              <div style={{ marginTop: 16 }}>
                <Link to={AUTH_CONFIG.FILE_MANAGER}>
                  <Text strong style={{ color: COLORS.STEELBLUE }}>
                    Go to File Manager →
                  </Text>
                </Link>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card
              title={
                <Space>
                  <FileImageOutlined />
                  <span>Media Manager</span>
                </Space>
              }
              style={{
                borderRadius: 8,
                border: `1px solid ${COLORS.LIGHTGRAY}`,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
              bodyStyle={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Text style={{ flex: 1 }}>
                Organize and manage your media albums. Create albums, upload images, and organize your media content by
                type and category.
              </Text>
              <div style={{ marginTop: 16 }}>
                <Link to={AUTH_CONFIG.MEDIA_MANAGER}>
                  <Text strong style={{ color: COLORS.STEELBLUE }}>
                    Go to Media Manager →
                  </Text>
                </Link>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card
              title={
                <Space>
                  <ScheduleOutlined />
                  <span>Ticket Manager</span>
                </Space>
              }
              style={{
                borderRadius: 8,
                border: `1px solid ${COLORS.LIGHTGRAY}`,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
              bodyStyle={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Text style={{ flex: 1 }}>
                View and manage support tickets. Track ticket status, respond to inquiries, and monitor ticket
                activities.
              </Text>
              <div style={{ marginTop: 16 }}>
                <Link to={AUTH_CONFIG.TICKET_MANAGER}>
                  <Text strong style={{ color: COLORS.STEELBLUE }}>
                    Go to Ticket Manager →
                  </Text>
                </Link>
              </div>
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default Dashboard;
