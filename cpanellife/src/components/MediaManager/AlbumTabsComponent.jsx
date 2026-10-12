import React, { useState, useEffect } from "react";
import { Modal, Tabs, Form, App, Spin } from "antd";
import AlbumForm from "./AlbumForm";
import AlbumImageGallery from "./AlbumImageGallery";
import { albumService } from "../../api";

const AlbumTabsComponent = (props) => {
  const { data, onUpdate, albumTypeOptions } = props;
  const { message, modal } = App.useApp();
  const [loadingStates, setLoadingStates] = useState({});
  const [activeKey, setActiveKey] = useState(data[0]?.id);

  const handleAlbumUpdate = async (submitData) => {
    const id = submitData.id;
    setLoadingStates((prev) => ({ ...prev, [id]: true }));
    try {
      await albumService.update(submitData);
      message.success({
        content: "Album updated successfully",
        duration: 2,
      });
      // Call the parent's refresh function if provided
      if (onUpdate) {
        // Add a small delay to ensure message is displayed before state update
        setTimeout(() => {
          onUpdate();
        }, 100);
      }
    } catch (error) {
      message.error({
        content: error?.response?.data?.message || error?.message || "Failed to update Album",
        duration: 3,
      });
      console.error("Update error:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const createPanes = (albumData) => {
    return albumData.map((item) => {
      const isLoading = loadingStates[item.id] || false;
      // Get album name from translations (prefer English, fallback to first available)
      const enTranslation = item.translations?.find((t) => t.languageCode === "en");
      const albumName = enTranslation?.name || item.translations?.[0]?.name || `Album ${item.id}`;

      return {
        label: (
          <span>
            {isLoading && <Spin size="small" style={{ marginRight: 8 }} />}
            {albumName}
          </span>
        ),
        children: (
          <div>
            <AlbumForm
              initialValues={item}
              onSubmit={handleAlbumUpdate}
              loading={isLoading}
              albumTypeOptions={albumTypeOptions}
            />
            <AlbumImageGallery images={item.images || []} albumId={item.id} onUpdate={onUpdate} />
          </div>
        ),
        key: item.id,
      };
    });
  };

  const [items, setItems] = useState(() => createPanes(data));

  // Update panes when data changes
  useEffect(() => {
    const newPanes = createPanes(data);
    setItems(newPanes);
    // Keep the current active key if it still exists, otherwise select the first one
    const currentActiveKey = activeKey;
    if (!newPanes.find((pane) => pane.key === currentActiveKey)) {
      setActiveKey(newPanes[0]?.key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loadingStates]);

  const onChange = (key) => {
    setActiveKey(key);
  };

  const remove = (targetKey) => {
    // Find the Album item to get its name for confirmation
    const targetItem = data.find((item) => item.id === targetKey);
    const enTranslation = targetItem?.translations?.find((t) => t.languageCode === "en");
    const albumName = enTranslation?.name || targetItem?.translations?.[0]?.name || "this Album";

    const confirmModal = modal.confirm({
      title: "Delete Album",
      content: `Are you sure you want to delete "${albumName}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        setLoadingStates((prev) => ({ ...prev, [targetKey]: true }));
        // Update modal button to show loading
        confirmModal.update({
          okButtonProps: { loading: true },
        });

        try {
          await albumService.delete(targetKey);
          message.success({
            content: "Album deleted successfully",
            duration: 2,
          });

          // Refresh data from parent
          if (onUpdate) {
            await onUpdate();
          }

          // Update active key if needed (handled by useEffect when data changes)
          const newData = data.filter((item) => item.id !== targetKey);
          if (newData.length > 0 && targetKey === activeKey) {
            const targetIndex = data.findIndex((item) => item.id === targetKey);
            const newIndex = targetIndex >= newData.length ? newData.length - 1 : targetIndex;
            setActiveKey(newData[newIndex]?.id);
          } else if (newData.length === 0) {
            setActiveKey(undefined);
          }
        } catch (error) {
          message.error({
            content: error?.response?.data?.message || error?.message || "Failed to delete Album",
            duration: 3,
          });
          console.error("Delete error:", error);
          // Update modal button to remove loading on error
          confirmModal.update({
            okButtonProps: { loading: false },
          });
        } finally {
          setLoadingStates((prev) => ({ ...prev, [targetKey]: false }));
        }
      },
    });
  };

  const onEdit = (targetKey, action) => {
    if (action === "add") {
      // Add action is handled by parent (AddAlbumModal)
      return;
    } else {
      remove(targetKey);
    }
  };

  if (!data || data.length === 0) {
    return <div style={{ padding: 24, textAlign: "center" }}>No albums in this category</div>;
  }

  return (
    <div>
      <Tabs hideAdd onChange={onChange} activeKey={activeKey} type="editable-card" onEdit={onEdit} items={items} />
    </div>
  );
};

export default AlbumTabsComponent;
