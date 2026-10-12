import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Tabs, Button, Space, App } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { albumService, catalogService } from "../api";
import AlbumTabsComponent from "../components/MediaManager/AlbumTabsComponent";
import AddAlbumModal from "../components/MediaManager/AddAlbumModal";
import LoadingSpinner from "../components/LoadingSpinner";

const MediaManager = () => {
  const { message: messageApi } = App.useApp();
  const [albums, setAlbums] = useState([]);
  const [albumTypes, setAlbumTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(null);

  // Fetch album types and albums
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Use Promise.allSettled to handle errors independently
      const [typesResult, albumsResult] = await Promise.allSettled([
        catalogService.getAlbumType(),
        albumService.getAll(),
      ]);

      // Handle album types
      if (typesResult.status === "fulfilled") {
        const types = typesResult.value?.data || typesResult.value || [];
        setAlbumTypes(types);

        // Set active tab to first type if not set
        if (!activeTab && types.length > 0) {
          const firstType = types[0];
          const firstTypeValue = firstType.value !== undefined ? firstType.value : firstType.id;
          setActiveTab(String(firstTypeValue));
        }
      } else {
        // Album types failed, but continue with empty array
        console.warn("Failed to load album types:", typesResult.reason);
        setAlbumTypes([]);
        // Only show error if it's not a 404 (resource might not exist yet)
        if (typesResult.reason?.response?.status !== 404) {
          messageApi.warning({
            content: "Failed to load album types. Some features may be limited.",
            duration: 3,
          });
        }
      }

      // Handle albums
      if (albumsResult.status === "fulfilled") {
        const albumsData = albumsResult.value?.data || albumsResult.value || [];
        setAlbums(albumsData);
      } else {
        console.error("Failed to load albums:", albumsResult.reason);
        messageApi.error({
          content:
            albumsResult.reason?.response?.data?.message || albumsResult.reason?.message || "Failed to load albums",
          duration: 3,
        });
        setAlbums([]);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      messageApi.error({
        content: error?.response?.data?.message || error?.message || "An unexpected error occurred",
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  }, [activeTab, messageApi]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Group albums by type
  const albumsByType = useMemo(() => {
    const grouped = {};
    albums.forEach((album) => {
      const type = album.type;
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(album);
    });
    return grouped;
  }, [albums]);

  // Create album type options for forms
  const albumTypeOptions = useMemo(() => {
    return albumTypes.map((type) => ({
      label: type.name || type.label || `Type ${type.value || type.id}`,
      value: type.value !== undefined ? type.value : type.id,
    }));
  }, [albumTypes]);

  // Create tab items based on album types
  const tabItems = useMemo(() => {
    return albumTypes.map((type) => {
      const typeValue = type.value !== undefined ? type.value : type.id;
      const typeAlbums = albumsByType[typeValue] || [];
      const typeName = type.name || type.label || `Type ${typeValue}`;

      return {
        key: String(typeValue),
        label: (
          <Space>
            {typeName} ({typeAlbums.length})
          </Space>
        ),
        children: <AlbumTabsComponent data={typeAlbums} onUpdate={fetchData} albumTypeOptions={albumTypeOptions} />,
      };
    });
  }, [albumTypes, albumsByType, fetchData, albumTypeOptions]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSuccess = () => {
    fetchData();
  };

  if (loading && albums.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Media Manager</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Add New Album
        </Button>
      </div>

      {tabItems.length > 0 ? (
        <>
          <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} size="large" />
        </>
      ) : (
        <div style={{ padding: 24, textAlign: "center" }}>No album types available</div>
      )}

      <AddAlbumModal
        open={isModalOpen}
        onCancel={handleModalClose}
        onSuccess={handleModalSuccess}
        albumTypeOptions={albumTypeOptions}
      />
    </div>
  );
};

export default MediaManager;
