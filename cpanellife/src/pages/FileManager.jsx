import React, { useEffect, useMemo, useState } from "react";
import { Upload, Spin, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import documentService from "../api/services/documentService";
import ImagePreview from "../components/ImagePreview";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchFiles, deleteFile, invalidateCache } from "../store/fileManagerSlice";

const { Dragger } = Upload;

const FileManager = () => {
  const dispatch = useDispatch();
  const { data, fileList, pagination, loading } = useSelector((state) => state.fileManager);
  const [uploading, setUploading] = useState(false);

  // Only fetch if data is empty or cache is invalid
  useEffect(() => {
    if (data.length === 0 || !fileList.length) {
      dispatch(fetchFiles({ page: pagination.current, pageSize: pagination.pageSize }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (page, size) => {
    dispatch(fetchFiles({ page, pageSize: size }));
  };

  const handlePageSizeChange = (size) => {
    dispatch(fetchFiles({ page: 1, pageSize: size }));
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteFile(id)).unwrap();
      message.success({
        content: "File deleted successfully",
        duration: 2,
      });
    } catch (err) {
      message.error({
        content: err || "Failed to delete file",
        duration: 2,
      });
      throw err; // Re-throw to let ImagePreview know it failed
    }
  };

  const uploadProps = useMemo(
    () => ({
      name: "file",
      //   multiple: true,
      showUploadList: false,
      customRequest: async ({ file, onSuccess, onError, onProgress }) => {
        try {
          setUploading(true);
          const formData = new FormData();
          formData.append("entityType", "7");
          formData.append("file", file);
          const res = await documentService.create(formData);
          onProgress?.({ percent: 100 });
          onSuccess?.(res, file);
        } catch (e) {
          onError?.(e);
        } finally {
          setUploading(false);
        }
      },
      onChange(info) {
        const { status } = info.file;
        if (status === "done") {
          message.success(`${info.file.name} uploaded successfully`);
          // Invalidate cache and refetch
          dispatch(invalidateCache());
          dispatch(fetchFiles({ page: pagination.current, pageSize: pagination.pageSize }));
        } else if (status === "error") {
          message.error(`${info.file.name} upload failed`);
        }
      },
      beforeUpload: () => true,
    }),
    [dispatch, pagination]
  );

  return (
    <div style={{ padding: 16 }}>
      <div style={{ position: "relative" }}>
        <Spin spinning={uploading} tip="Uploading...">
          <Dragger {...uploadProps} disabled={uploading} style={{ marginBottom: 16 }}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag files to this area to upload</p>
            <p className="ant-upload-hint">Support for multiple files. Files will upload immediately.</p>
          </Dragger>
        </Spin>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <ImagePreview
          imageList={fileList}
          data={data}
          total={pagination.total}
          currentPage={pagination.current}
          pageSize={pagination.pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          loading={loading}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default FileManager;
