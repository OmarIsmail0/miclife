import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import TabsComponent from "./TabsComponent";
import { sectionService } from "../../../api";
import LoadingSpinner from "../../LoadingSpinner";
import { setSectionData } from "../../../store/contentManagerSlice";

const SectionTab = () => {
  const dispatch = useDispatch();
  const tabsComponentRef = useRef();
  const { data: sectionDataList, needsRefresh } = useSelector((state) => state.contentManager.tabData.sections);
  const [loading, setLoading] = useState(false);

  const fetchSections = useCallback(async () => {
    setLoading(true);
    try {
      const response = await sectionService.getAll({ PageNumber: 1, PageSize: 10000 });
      dispatch(setSectionData(response.data));
    } catch (err) {
      message.error(err?.message || "Failed to load Sections");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    // Only fetch if data is empty or needs refresh
    if (sectionDataList.length === 0 || needsRefresh) {
      fetchSections();
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
        <h3>Sections</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
          Add New
        </Button>
      </div>

      {loading && sectionDataList.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <TabsComponent ref={tabsComponentRef} data={sectionDataList} onUpdate={fetchSections} />
      )}
    </div>
  );
};

export default SectionTab;
