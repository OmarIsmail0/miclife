import React, { useState, useRef, useEffect } from "react";
import { Image, Card, Empty, Upload, Button, Popconfirm, App } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { API_CONFIG, albumService, documentService } from "../../api";

const AlbumImageGallery = ({ images = [], albumId, onUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const processedFilesRef = useRef(new Set());
  const uploadTimeoutRef = useRef(null);
  const { message } = App.useApp();

  // Clear processed files when albumId changes
  useEffect(() => {
    processedFilesRef.current.clear();
  }, [albumId]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (uploadTimeoutRef.current) {
        clearTimeout(uploadTimeoutRef.current);
      }
    };
  }, []);

  const handleUpload = async (fileList) => {
    if (!albumId) {
      message.error("Album ID is required");
      return;
    }

    // Filter out files that have already been processed
    const newFiles = fileList.filter((file) => {
      const fileId = file.uid || file.name + file.size + file.lastModified;
      return !processedFilesRef.current.has(fileId);
    });

    if (newFiles.length === 0) {
      return; // No new files to upload
    }

    setUploading(true);
    try {
      const files = newFiles.map((file) => file.originFileObj || file).filter(Boolean);

      if (files.length === 0) {
        setUploading(false);
        return;
      }

      await albumService.uploadImages(albumId, files);

      // Mark files as processed
      newFiles.forEach((file) => {
        const fileId = file.uid || file.name + file.size + file.lastModified;
        processedFilesRef.current.add(fileId);
      });

      message.success({
        content: "Images uploaded successfully",
        duration: 2,
      });
      if (onUpdate) {
        await onUpdate();
      }
    } catch (error) {
      message.error({
        content: error?.response?.data?.message || error?.message || "Failed to upload images",
        duration: 3,
      });
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!imageId) {
      message.error("Image ID is required");
      return;
    }

    setDeletingId(imageId);
    try {
      await documentService.delete(imageId);
      message.success({
        content: "Image deleted successfully",
        duration: 2,
      });
      if (onUpdate) {
        await onUpdate();
      }
    } catch (error) {
      message.error({
        content: error?.response?.data?.message || error?.message || "Failed to delete image",
        duration: 3,
      });
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const uploadProps = {
    multiple: true,
    beforeUpload: () => false, // Prevent auto upload
    onChange: (info) => {
      // Clear any existing timeout
      if (uploadTimeoutRef.current) {
        clearTimeout(uploadTimeoutRef.current);
      }

      // Wait a bit to allow all files to be added before uploading
      // This prevents multiple uploads when selecting multiple files at once
      uploadTimeoutRef.current = setTimeout(() => {
        if (info.fileList.length > 0) {
          handleUpload(info.fileList);
        }
      }, 300); // 300ms delay to batch file selections
    },
    showUploadList: false,
  };

  return (
    <Card
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Images ({images?.length || 0})</span>
          {albumId && (
            <Upload {...uploadProps}>
              <Button type="primary" icon={<PlusOutlined />} loading={uploading}>
                Upload Images
              </Button>
            </Upload>
          )}
        </div>
      }
      style={{ marginTop: 16 }}
    >
      {!images || images.length === 0 ? (
        <Empty description="No images in this album" />
      ) : (
        <Image.PreviewGroup>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "16px",
              padding: "8px",
              maxWidth: "100%",
              margin: "0 auto",
              justifyContent: "center",
            }}
          >
            {images.map((image) => {
              const extension = image.filePath?.split(".").at(-1)?.toLowerCase();
              let imageSrc;
              if (extension === "docx") {
                imageSrc = "./files/docx_icon.svg";
              } else if (extension === "pdf") {
                imageSrc = "./files/PDF_file_icon.svg";
              } else {
                imageSrc = `${API_CONFIG.BASE_URL}${image.filePath}`;
              }

              return (
                <Card
                  key={image.id}
                  style={{
                    width: "100%",
                    maxWidth: "100%",
                    position: "relative",
                  }}
                  bodyStyle={{
                    padding: 8,
                    display: "flex",
                    flexDirection: "column",
                  }}
                  actions={
                    albumId
                      ? [
                          <Popconfirm
                            key="delete"
                            title="Delete image"
                            description="Are you sure you want to delete this image?"
                            onConfirm={() => handleDelete(image.id)}
                            okText="Yes"
                            cancelText="No"
                            okButtonProps={{ loading: deletingId === image.id }}
                          >
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              loading={deletingId === image.id}
                              disabled={deletingId === image.id}
                              onClick={(e) => e.stopPropagation()}
                            >
                              Delete
                            </Button>
                          </Popconfirm>,
                        ]
                      : []
                  }
                >
                  <Image
                    src={imageSrc}
                    width="100%"
                    height={184}
                    style={{
                      display: "block",
                      objectFit: "contain",
                    }}
                    preview={{}}
                  />
                  <Card.Meta
                    title={
                      <div
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          marginTop: 8,
                        }}
                      >
                        {image.fileName}
                      </div>
                    }
                  />
                </Card>
              );
            })}
          </div>
        </Image.PreviewGroup>
      )}
    </Card>
  );
};

export default AlbumImageGallery;
