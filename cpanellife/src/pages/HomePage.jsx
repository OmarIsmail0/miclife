import React, { useState } from "react";
import { Layout } from "antd";
import { COLORS } from "../constants/colors";
import SideComp from "../components/SiderComp";
import { Route, Routes } from "react-router-dom";
import { AUTH_CONFIG } from "../constants/config";
import FileManager from "./FileManager";
import ContentManager from "./ContentManager";
import TicketManager from "./TicketManager";
import Dashboard from "./Dashboard";
import MediaManager from "./MediaManager";
import FormManager from "./FormManager";
import QuotationTemplatesPage from "./QuotationTemplatesPage";
import NotFound from "./NotFound";

const { Sider, Content } = Layout;

const HomePage = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={250}
        style={{
          background: COLORS.WHITE,
          height: "100vh",
          overflow: "auto",
          position: "fixed",
          left: 0,
          top: 0,
        }}
      >
        <SideComp collapsed={collapsed} />
      </Sider>

      <Layout
        style={{
          minHeight: "100vh",
          overflow: "auto",
          backgroundColor: COLORS.WHITESMOKE,
          marginLeft: collapsed ? 80 : 250,
          transition: "margin-left 0.2s",
        }}
      >
        <Content
          style={{
            padding: "24px",
          }}
        >
          <Routes>
            <Route path={AUTH_CONFIG.HOME_PATH} element={<Dashboard />} />
            <Route path={AUTH_CONFIG.FILE_MANAGER} element={<FileManager />} />
            <Route path={AUTH_CONFIG.CONTENT_MANAGER} element={<ContentManager />} />
            <Route path={AUTH_CONFIG.TICKET_MANAGER} element={<TicketManager />} />
            <Route path={AUTH_CONFIG.MEDIA_MANAGER} element={<MediaManager />} />
            <Route path={AUTH_CONFIG.FORM_MANAGER} element={<FormManager />} />
            <Route path={AUTH_CONFIG.QUOTATION_TEMPLATES} element={<QuotationTemplatesPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomePage;
