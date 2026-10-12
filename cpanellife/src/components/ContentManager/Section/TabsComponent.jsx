import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Modal, Tabs, Form, App, Spin } from "antd";
import SectionForm from "./SectionForm";
import { sectionService } from "../../../api";

const TabsComponent = forwardRef((props, ref) => {
  const { data, onUpdate } = props;
  const { message, modal } = App.useApp();
  const [loadingStates, setLoadingStates] = useState({});
  const [createLoading, setCreateLoading] = useState(false);
  const [createForm] = Form.useForm();

  const handleSectionUpdate = async (submitData) => {
    const id = submitData.id;
    setLoadingStates((prev) => ({ ...prev, [id]: true }));
    try {
      await sectionService.update(submitData);
      message.success({
        content: "Section updated successfully",
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
        content: error?.response?.data?.message || error?.message || "Failed to update Section",
        duration: 3,
      });
      console.error("Update error:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleSectionCreate = async (submitData) => {
    setCreateLoading(true);
    try {
      await sectionService.create(submitData);
      message.success({
        content: "Section created successfully",
        duration: 2,
      });
      setIsModalOpen(false);
      createForm.resetFields();
      // Call the parent's refresh function if provided
      if (onUpdate) {
        // Add a small delay to ensure message is displayed before state update
        setTimeout(() => {
          onUpdate();
        }, 100);
      }
    } catch (error) {
      message.error({
        content: error?.response?.data?.message || error?.message || "Failed to create Section",
        duration: 3,
      });
      console.error("Create error:", error);
    } finally {
      setCreateLoading(false);
    }
  };

  const [activeKey, setActiveKey] = useState(data[0]?.id ? String(data[0].id) : undefined);

  const createPanes = (sectionData) => {
    return sectionData.map((item) => {
      const isLoading = loadingStates[item.id] || false;
      return {
        label: (
          <span>
            {isLoading && <Spin size="small" style={{ marginRight: 8 }} />}
            {item.slug}
          </span>
        ),
        children: <SectionForm initialValues={item} onSubmit={handleSectionUpdate} loading={isLoading} />,
        key: String(item.id),
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
    createForm.resetFields();
  };

  useImperativeHandle(ref, () => ({
    showModal: showModal,
  }));

  const handleOk = () => {
    createForm.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    createForm.resetFields();
  };

  const onChange = (key) => {
    setActiveKey(key);
  };

  const add = () => {
    showModal();
  };

  const remove = (targetKey) => {
    // Find the Section item to get its name for confirmation
    const targetItem = data.find((item) => item.id === targetKey);
    const sectionName = targetItem?.slug || "this Section";

    const confirmModal = modal.confirm({
      title: "Delete Section",
      content: `Are you sure you want to delete "${sectionName}"? This action cannot be undone.`,
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
          await sectionService.delete(targetKey);
          message.success({
            content: "Section deleted successfully",
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
            setActiveKey(newData[newIndex]?.id ? String(newData[newIndex].id) : undefined);
          } else if (newData.length === 0) {
            setActiveKey(undefined);
          }
        } catch (error) {
          message.error({
            content: error?.response?.data?.message || error?.message || "Failed to delete Section",
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
      add();
    }
    // else {
    //   remove(targetKey);
    // }
  };

  return (
    <div>
      <Tabs hideAdd onChange={onChange} activeKey={activeKey} type="card" onEdit={onEdit} items={items} />

      <Modal
        title="Add New Section"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Create"
        cancelText="Cancel"
        width={1200}
        okButtonProps={{ loading: createLoading }}
        destroyOnHidden
      >
        <SectionForm form={createForm} onSubmit={handleSectionCreate} />
      </Modal>
    </div>
  );
});

TabsComponent.displayName = "TabsComponent";

export default TabsComponent;
