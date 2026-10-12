import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import TabsComponent from "./TabsComponent";
import { shareholderService } from "../../../api";
import LoadingSpinner from "../../LoadingSpinner";
import { setShareholdersData } from "../../../store/contentManagerSlice";

const ShareholderTab = () => {
  const dispatch = useDispatch();
  const tabsComponentRef = useRef();
  const { data: shareholdersDataList, needsRefresh } = useSelector(
    (state) => state.contentManager.tabData.shareholders
  );
  const [loading, setLoading] = useState(false);

  const fetchShareholders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await shareholderService.getAll({ PageNumber: 1, PageSize: 1000 });
      dispatch(setShareholdersData(response.data || []));
    } catch (err) {
      message.error(err?.message || "Failed to load Shareholders");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    // Only fetch if data is empty or needs refresh
    if (shareholdersDataList.length === 0 || needsRefresh) {
      fetchShareholders();
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
        <h3>Shareholders</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
          Add New
        </Button>
      </div>

      {loading && shareholdersDataList.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <TabsComponent ref={tabsComponentRef} data={shareholdersDataList} onUpdate={fetchShareholders} />
      )}
    </div>
  );
};

export default ShareholderTab;
