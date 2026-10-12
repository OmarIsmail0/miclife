import React, { useState } from "react";
import {
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  LeftOutlined,
  RightOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  UndoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { Image, Space, Card, App, Pagination, Popconfirm, Tooltip } from "antd";
import { API_CONFIG } from "../api";

const ImagePreview = ({
  imageList,
  data,
  total,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading,
  onDelete,
}) => {
  const [current, setCurrent] = useState(0);
  const [deletingId, setDeletingId] = useState(null);
  const { message } = App.useApp();

  const onCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.success({
          content: "Copied to clipboard!",
          duration: 2,
        });
      })
      .catch(() => {
        message.error({
          content: "Failed to copy to clipboard",
          duration: 2,
        });
      });
  };

  const onDownload = () => {
    const url = imageList?.[current];
    const suffix = url.slice(url.lastIndexOf("."));
    const filename = Date.now() + suffix;
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(blobUrl);
        link.remove();
      });
  };
  return (
    <div style={{ width: "100%", height: "60vh", display: "flex", flexDirection: "column" }}>
      <Image.PreviewGroup
        preview={{
          toolbarRender: (
            _,
            {
              transform: { scale },
              actions: { onActive, onFlipY, onFlipX, onRotateLeft, onRotateRight, onZoomOut, onZoomIn, onReset },
            }
          ) => (
            <Space size={12} className="toolbar-wrapper">
              <LeftOutlined disabled={current === 0} onClick={() => onActive?.(-1)} />
              <RightOutlined disabled={current === (data?.length || 0) - 1} onClick={() => onActive?.(1)} />
              <DownloadOutlined onClick={onDownload} />
              <SwapOutlined rotate={90} onClick={onFlipY} />
              <SwapOutlined onClick={onFlipX} />
              <RotateLeftOutlined onClick={onRotateLeft} />
              <RotateRightOutlined onClick={onRotateRight} />
              <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
              <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
              <UndoOutlined onClick={onReset} />
            </Space>
          ),
          onChange: (index) => {
            setCurrent(index);
          },
        }}
      >
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
          {data?.map((item) => {
            const extension = item.filePath.split(".").at(-1)?.toLowerCase();
            let imageSrc;
            if (extension === "docx") {
              imageSrc = "./files/docx_icon.svg";
            } else if (extension === "pdf") {
              imageSrc = "./files/PDF_file_icon.svg";
            } else {
              imageSrc = `${API_CONFIG.BASE_URL}${item.filePath}`;
            }

            return (
              <Card
                key={item.id}
                style={{
                  width: "100%",
                  maxWidth: "100%",
                }}
                bodyStyle={{
                  padding: 8,
                  display: "flex",
                  flexDirection: "column",
                }}
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
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        <Tooltip title={item.fileName}>{item.fileName}</Tooltip>
                      </span>
                      <Space size={8} style={{ marginLeft: 8, flexShrink: 0 }}>
                        <CopyOutlined
                          onClick={(e) => {
                            e.stopPropagation();
                            onCopy(`${item.filePath}`);
                          }}
                          style={{ cursor: "pointer", color: "#1890ff" }}
                        />
                        <Popconfirm
                          title="Delete file"
                          description="Are you sure you want to delete this file?"
                          onConfirm={async (e) => {
                            e?.stopPropagation();
                            setDeletingId(item.id);
                            try {
                              await onDelete?.(item.id);
                            } catch {
                              // Error handling is done in FileManager
                            } finally {
                              setDeletingId(null);
                            }
                          }}
                          onCancel={(e) => e?.stopPropagation()}
                          okText="Yes"
                          cancelText="No"
                          okButtonProps={{ loading: deletingId === item.id }}
                        >
                          <DeleteOutlined
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            style={{
                              cursor: deletingId === item.id ? "not-allowed" : "pointer",
                              color: deletingId === item.id ? "#d9d9d9" : "#ff4d4f",
                              opacity: deletingId === item.id ? 0.5 : 1,
                            }}
                          />
                        </Popconfirm>
                      </Space>
                    </div>
                  }
                  style={{ marginTop: 8 }}
                />
              </Card>
            );
          })}
        </div>
      </Image.PreviewGroup>
      {total > 0 && (
        <div style={{ marginTop: "auto", display: "flex", justifyContent: "center", padding: "24px 16px" }}>
          <Pagination
            current={currentPage}
            total={total}
            pageSize={pageSize}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            pageSizeOptions={["6", "8", "12", "16", "20", "24", "32"]}
            onChange={(page, size) => {
              onPageChange?.(page, size);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onShowSizeChange={(current, size) => {
              onPageSizeChange?.(size);
              onPageChange?.(1, size);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            responsive
            disabled={loading}
          />
        </div>
      )}
    </div>
  );
};
export default ImagePreview;
