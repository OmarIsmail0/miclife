import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import TabsComponent from "./TabsComponent";
import { lobService } from "../../../api";
import LoadingSpinner from "../../LoadingSpinner";
import { setLobData } from "../../../store/contentManagerSlice";

const LOBTab = () => {
  const dispatch = useDispatch();
  const tabsComponentRef = useRef();
  const { data: lobDataList, needsRefresh } = useSelector((state) => state.contentManager.tabData.lob);
  const [loading, setLoading] = useState(false);

  const fetchLobs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await lobService.getAll();
      dispatch(setLobData(response.data));
    } catch (err) {
      message.error(err?.message || "Failed to load LOBs");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    // Only fetch if data is empty or needs refresh
    if (lobDataList.length === 0 || needsRefresh) {
      fetchLobs();
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
        <h3>Line of Business (LOB)</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
          Add New
        </Button>
      </div>

      {loading && lobDataList.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <TabsComponent ref={tabsComponentRef} data={lobDataList} onUpdate={fetchLobs} />
      )}
    </div>
  );
};

export default LOBTab;
