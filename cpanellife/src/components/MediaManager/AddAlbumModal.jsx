import React, { useState, useMemo } from "react";
import { Modal, Steps, Form, Upload, App, Spin, Button } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import AlbumForm from "./AlbumForm";
import { albumService } from "../../api";

const { Dragger } = Upload;

const AddAlbumModal = ({ open, onCancel, onSuccess, albumTypeOptions = [] }) => {
  const { message } = App.useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [createForm] = Form.useForm();
  const [createdAlbumId, setCreatedAlbumId] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const handleAlbumCreate = async (submitData) => {
    setCreateLoading(true);
    try {
      const response = await albumService.create(submitData);
      const albumId = response.id || response.data?.id;
      if (albumId) {
        setCreatedAlbumId(albumId);
        message.success({
          content: "Album created successfully",
          duration: 2,
        });
        setCurrentStep(1);
      } else {
        throw new Error("Album ID not returned from server");
      }
    } catch (error) {
      message.error({
        content: error?.response?.data?.message || error?.message || "Failed to create Album",
        duration: 3,
      });
      console.error("Create error:", error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleImageUpload = async () => {
    if (!createdAlbumId) {
      message.error("Album ID is missing. Please go back and create the album first.");
      return;
    }

    if (fileList.length === 0) {
      message.warning("Please select at least one image to upload.");
      return;
    }

    setUploadLoading(true);
    try {
      const files = fileList.map((file) => file.originFileObj || file);
      await albumService.uploadImages(createdAlbumId, files);
      message.success({
        content: "Images uploaded successfully",
        duration: 2,
      });
      handleClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      message.error({
        content: error?.response?.data?.message || error?.message || "Failed to upload images",
        duration: 3,
      });
      console.error("Upload error:", error);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    setCreatedAlbumId(null);
    setFileList([]);
    createForm.resetFields();
    onCancel();
  };

  const handleNext = () => {
    if (currentStep === 0) {
      createForm.submit();
    } else if (currentStep === 1) {
      handleImageUpload();
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const uploadProps = useMemo(
    () => ({
      name: "files",
      multiple: true,
      fileList: fileList,
      beforeUpload: () => false, // Prevent auto upload
      onChange: (info) => {
        setFileList(info.fileList);
      },
      accept: "image/*",
    }),
    [fileList]
  );

  const steps = [
    {
      title: "Create Album",
      content: (
        <div style={{ marginTop: 24 }}>
          <AlbumForm form={createForm} onSubmit={handleAlbumCreate} albumTypeOptions={albumTypeOptions} />
        </div>
      ),
    },
    {
      title: "Upload Images",
      content: (
        <div style={{ marginTop: 24 }}>
          <Spin spinning={uploadLoading}>
            <Dragger {...uploadProps} disabled={uploadLoading}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag image files to this area to upload</p>
              <p className="ant-upload-hint">Support for multiple files. Select images to upload.</p>
            </Dragger>
            {fileList.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <p>Selected files: {fileList.length}</p>
              </div>
            )}
          </Spin>
        </div>
      ),
    },
  ];

  return (
    <Modal
      title="Add New Album"
      open={open}
      onCancel={handleClose}
      width={1200}
      destroyOnHidden
      footer={[
        <Button key="cancel" onClick={handleClose}>
          {currentStep === 0 ? "Cancel" : "Close"}
        </Button>,
        currentStep > 0 && (
          <Button key="prev" onClick={handlePrev} disabled={uploadLoading}>
            Previous
          </Button>
        ),
        <Button
          key="next"
          type="primary"
          onClick={handleNext}
          loading={currentStep === 0 ? createLoading : uploadLoading}
        >
          {currentStep === 0 ? "Create & Continue" : "Upload Images"}
        </Button>,
      ]}
    >
      <Steps current={currentStep} items={steps.map((step) => ({ title: step.title }))} style={{ marginBottom: 24 }} />
      {steps[currentStep].content}
    </Modal>
  );
};

export default AddAlbumModal;
