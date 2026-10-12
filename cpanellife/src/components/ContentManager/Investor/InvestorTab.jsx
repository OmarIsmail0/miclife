import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import TabsComponent from "./TabsComponent";
import { investorService } from "../../../api";
import LoadingSpinner from "../../LoadingSpinner";
import { setInvestorData } from "../../../store/contentManagerSlice";

const InvestorTab = () => {
  const dispatch = useDispatch();
  const tabsComponentRef = useRef();
  const { data: investorDataList, needsRefresh } = useSelector((state) => state.contentManager.tabData.investor);
  const [loading, setLoading] = useState(false);

  const fetchInvestors = useCallback(async () => {
    setLoading(true);
    try {
      const response = await investorService.getAll({ PageNumber: 1, PageSize: 10000 });
      console.log(response.data);
      dispatch(setInvestorData(response.data));
    } catch (err) {
      message.error(err?.message || "Failed to load Investors");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    // Only fetch if data is empty or needs refresh
    if (investorDataList.length === 0 || needsRefresh) {
      fetchInvestors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddClick = () => {
    if (tabsComponentRef.current) {
      tabsComponentRef.current.showModal();
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Investors</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
          Add New
        </Button>
      </div>

      {loading && investorDataList.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <TabsComponent ref={tabsComponentRef} data={investorDataList} onUpdate={fetchInvestors} />
      )}
    </div>
  );
};

export default InvestorTab;
