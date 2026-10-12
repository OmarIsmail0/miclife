import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import TabsComponent from "./TabsComponent";
import { boardMembersService } from "../../../api";
import LoadingSpinner from "../../LoadingSpinner";
import { setBoardMembersData } from "../../../store/contentManagerSlice";

const BoardMemberTab = () => {
  const dispatch = useDispatch();
  const tabsComponentRef = useRef();
  const { data: boardMembersDataList, needsRefresh } = useSelector(
    (state) => state.contentManager.tabData.boardMembers
  );
  const [loading, setLoading] = useState(false);

  const fetchBoardMembers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await boardMembersService.getAll({ PageNumber: 1, PageSize: 10000 });
      dispatch(setBoardMembersData(response.data || []));
    } catch (err) {
      message.error(err?.message || "Failed to load Board Members");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    // Only fetch if data is empty or needs refresh
    if (boardMembersDataList.length === 0 || needsRefresh) {
      fetchBoardMembers();
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
        <h3>Board Members</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
          Add New
        </Button>
      </div>

      {loading && boardMembersDataList.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <TabsComponent ref={tabsComponentRef} data={boardMembersDataList} onUpdate={fetchBoardMembers} />
      )}
    </div>
  );
};

export default BoardMemberTab;
