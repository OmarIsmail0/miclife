import React, { useEffect } from "react";
import { Tabs, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  ShoppingOutlined,
  FolderOutlined,
  QuestionCircleOutlined,
  TeamOutlined,
  BlockOutlined,
  BankOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import LOBTab from "../components/ContentManager/Lob/LOBTab";
import ProductTab from "../components/ContentManager/Product/ProductTab";
import SectionTab from "../components/ContentManager/Section/SectionTab";
import QuestionTab from "../components/ContentManager/Question/QuestionTab";
import InvestorTab from "../components/ContentManager/Investor/InvestorTab";
import BlockTab from "../components/ContentManager/Block/BlockTab";
import BoardMemberTab from "../components/ContentManager/BoardMember/BoardMemberTab";
import ShareholderTab from "../components/ContentManager/Shareholder/ShareholderTab";
import BranchTab from "../components/ContentManager/Branch/BranchTab";
import { setActiveTab } from "../store/contentManagerSlice";

// Valid tab keys - constant outside component
const VALID_TAB_KEYS = [
  "sections",
  "blocks",
  "lob",
  "products",
  "questions",
  "investor",
  "boardMembers",
  "shareholders",
  "branches",
];

const ContentManager = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = useSelector((state) => state.contentManager.activeTab);

  // Read hash from URL on mount and when location changes
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash && VALID_TAB_KEYS.includes(hash) && activeTab !== hash) {
      dispatch(setActiveTab(hash));
    }
  }, [location.hash, activeTab, dispatch]);

  const handleTabChange = (key) => {
    dispatch(setActiveTab(key));
    // Update URL hash without causing a page reload
    navigate(`${location.pathname}#${key}`, { replace: true });
  };

  const tabItems = [
    {
      key: "sections",
      label: (
        <Space>
          <FolderOutlined />
          Sections
        </Space>
      ),
      children: <SectionTab />,
    },
    {
      key: "blocks",
      label: (
        <Space>
          <BlockOutlined />
          Blocks
        </Space>
      ),
      children: <BlockTab />,
    },
    {
      key: "lob",
      label: (
        <Space>
          <AppstoreOutlined />
          Line of Business
        </Space>
      ),
      children: <LOBTab />,
    },
    {
      key: "products",
      label: (
        <Space>
          <ShoppingOutlined />
          Products
        </Space>
      ),
      children: <ProductTab />,
    },
    {
      key: "questions",
      label: (
        <Space>
          <QuestionCircleOutlined />
          Questions
        </Space>
      ),
      children: <QuestionTab />,
    },
    {
      key: "investor",
      label: (
        <Space>
          <TeamOutlined />
          Investor
        </Space>
      ),
      children: <InvestorTab />,
    },
    {
      key: "boardMembers",
      label: (
        <Space>
          <TeamOutlined />
          Board Members
        </Space>
      ),
      children: <BoardMemberTab />,
    },
    {
      key: "shareholders",
      label: (
        <Space>
          <BankOutlined />
          Shareholders
        </Space>
      ),
      children: <ShareholderTab />,
    },
    {
      key: "branches",
      label: (
        <Space>
          <ShopOutlined />
          Branches
        </Space>
      ),
      children: <BranchTab />,
    },
  ];

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} size="large" />
    </div>
  );
};

export default ContentManager;
