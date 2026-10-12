import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import TabsComponent from "./TabsComponent";
import { blockService } from "../../../api";
import LoadingSpinner from "../../LoadingSpinner";
import { setBlockData } from "../../../store/contentManagerSlice";

const BlockTab = () => {
  const dispatch = useDispatch();
  const tabsComponentRef = useRef();
  const { data: blockDataList, needsRefresh } = useSelector((state) => state.contentManager.tabData.blocks);
  const [loading, setLoading] = useState(false);

  const fetchBlocks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await blockService.getAll({ PageNumber: 1, PageSize: 10000 });
      dispatch(setBlockData(response.data));
    } catch (err) {
      message.error(err?.message || "Failed to load Blocks");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    // Only fetch if data is empty or needs refresh
    if (blockDataList.length === 0 || needsRefresh) {
      fetchBlocks();
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
        <h3>Blocks</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
          Add New
        </Button>
      </div>

      {loading && blockDataList.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <TabsComponent ref={tabsComponentRef} data={blockDataList} onUpdate={fetchBlocks} />
      )}
    </div>
  );
};

export default BlockTab;
