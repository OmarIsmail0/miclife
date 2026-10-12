import { Button, Menu } from "antd";
import {
  LogoutOutlined,
  CodeSandboxOutlined,
  HomeOutlined,
  FileDoneOutlined,
  ScheduleOutlined,
  FileImageOutlined,
  FormOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AUTH_CONFIG, APP_CONFIG } from "../constants/config";
import { COLORS } from "../constants/colors";
import { authService } from "../api";

const SideComp = ({ collapsed = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    authService.logout();
    navigate(AUTH_CONFIG.LOGIN_PATH, { replace: true });
  };

  const menuItems = [
    {
      key: AUTH_CONFIG.HOME_PATH,
      icon: <HomeOutlined />,
      label: <Link to={AUTH_CONFIG.HOME_PATH}>Dashboard</Link>,
    },
    {
      key: AUTH_CONFIG.FILE_MANAGER,
      icon: <FileDoneOutlined />,
      label: <Link to={AUTH_CONFIG.FILE_MANAGER}>File Manager</Link>,
    },
    {
      key: AUTH_CONFIG.CONTENT_MANAGER,
      icon: <CodeSandboxOutlined />,
      label: <Link to={AUTH_CONFIG.CONTENT_MANAGER}>Content Manager</Link>,
    },
    {
      key: AUTH_CONFIG.TICKET_MANAGER,
      icon: <ScheduleOutlined />,
      label: <Link to={AUTH_CONFIG.TICKET_MANAGER}>Ticket Manager</Link>,
    },
    {
      key: AUTH_CONFIG.MEDIA_MANAGER,
      icon: <FileImageOutlined />,
      label: <Link to={AUTH_CONFIG.MEDIA_MANAGER}>Media Manager</Link>,
    },
    {
      key: AUTH_CONFIG.FORM_MANAGER,
      icon: <FormOutlined />,
      label: <Link to={AUTH_CONFIG.FORM_MANAGER}>Form Manager</Link>,
    },
    {
      key: AUTH_CONFIG.QUOTATION_TEMPLATES,
      icon: <FileTextOutlined />,
      label: <Link to={AUTH_CONFIG.QUOTATION_TEMPLATES}>Quotation Templates</Link>,
    },
  ];

  // Automatically derive selected key from current path
  // Check paths in reverse order (longest first) to match specific routes before home
  const selectedKey = [
    menuItems
      .slice()
      .reverse()
      .find((item) => location.pathname.startsWith(item.key))?.key || AUTH_CONFIG.HOME_PATH,
  ];

  return (
    <div
      className="sidebar-container"
      style={{
        height: "calc(100vh - 48px)",
        display: "flex",
        flexDirection: "column",
        background: COLORS.WHITE,
      }}
    >
      {/* Logo/Brand Area */}
      <div
        style={{
          padding: collapsed ? "16px 8px" : "24px 6px 10px 6px",
          textAlign: "center",
          transition: "padding 0.2s",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: COLORS.DARKGRAY,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={APP_CONFIG.LOGO}
              alt="logo"
              style={{
                width: collapsed ? "60%" : "90%",
                transition: "width 0.2s",
              }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
        <Menu
          theme="light"
          selectedKeys={selectedKey}
          mode="inline"
          items={menuItems}
          style={{
            height: "100%",
            borderRight: 0,
            background: COLORS.WHITE,
          }}
        />
      </div>

      {/* Bottom Section with Logout */}
      <div
        style={{
          padding: collapsed ? "8px" : "8px 16px",
          borderTop: `1px solid ${COLORS.LIGHTGRAY}`,
          flexShrink: 0,
          background: COLORS.WHITE,
        }}
      >
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={logout}
          style={{
            width: "100%",
            textAlign: "left",
            color: COLORS.BLACK,
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
          title="Logout"
        >
          {!collapsed && "Logout"}
        </Button>
      </div>
    </div>
  );
};

export default SideComp;
