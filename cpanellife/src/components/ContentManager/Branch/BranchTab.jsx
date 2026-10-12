import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import TabsComponent from "./TabsComponent";
import { branchService } from "../../../api";
import LoadingSpinner from "../../LoadingSpinner";
import { setBranchesData } from "../../../store/contentManagerSlice";

const BranchTab = () => {
  const dispatch = useDispatch();
  const tabsComponentRef = useRef();
  const { data: branchesDataList, needsRefresh } = useSelector((state) => state.contentManager.tabData.branches);
  const [loading, setLoading] = useState(false);

  const fetchBranches = useCallback(async () => {
    setLoading(true);
    try {
      const response = await branchService.getAll({ PageNumber: 1, PageSize: 10000 });
      dispatch(setBranchesData(response.data || []));
    } catch (err) {
      message.error(err?.message || "Failed to load Branches");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    // Only fetch if data is empty or needs refresh
    if (branchesDataList.length === 0 || needsRefresh) {
      fetchBranches();
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
        <h3>Branches</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
          Add New
        </Button>
      </div>

      {loading && branchesDataList.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <TabsComponent ref={tabsComponentRef} data={branchesDataList} onUpdate={fetchBranches} />
      )}
    </div>
  );
};

export default BranchTab;
