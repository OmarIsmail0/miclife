import React, { useEffect, useState, useCallback } from "react";
import { App, Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import QuotationTemplatesTable from "../components/QuotationTemplates/QuotationTemplatesTable";
import QuotationTemplateCreateModal from "../components/QuotationTemplates/QuotationTemplateCreateModal";
import QuotationTemplateEditModal from "../components/QuotationTemplates/QuotationTemplateEditModal";
import JsonViewModal from "../components/QuotationTemplates/JsonViewModal";
import LoadingSpinner from "../components/LoadingSpinner";
import { quotationTemplateService } from "../api";

const QuotationTemplatesPage = () => {
  const { message } = App.useApp();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [jsonViewModalOpen, setJsonViewModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [jsonViewData, setJsonViewData] = useState(null);
  const [jsonViewTitle, setJsonViewTitle] = useState("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await quotationTemplateService.getAll({ PageNumber: 1, PageSize: 1000 });
      const templatesList = response.data || response || [];
      setTemplates(templatesList);
    } catch (error) {
      console.error("Error fetching quotation templates:", error);
      message.error("Failed to load quotation templates");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = useCallback(() => {
    setCreateModalOpen(true);
  }, []);

  const handleCreateSuccess = useCallback(async (payload) => {
    try {
      await quotationTemplateService.create(payload);
      message.success("Quotation template created successfully");
      await fetchTemplates();
    } catch (error) {
      console.error("Error creating quotation template:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create quotation template";
      message.error(errorMessage);
      throw error;
    }
  }, []);

  const handleEdit = useCallback((template) => {
    setSelectedTemplate(template);
    setEditModalOpen(true);
  }, []);

  const handleEditSuccess = useCallback(async (payload) => {
    try {
      await quotationTemplateService.update(payload);
      message.success("Quotation template updated successfully");
      await fetchTemplates();
    } catch (error) {
      console.error("Error updating quotation template:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update quotation template";
      message.error(errorMessage);
      throw error;
    }
  }, []);

  const handleDelete = useCallback(async (templateId) => {
    try {
      message.loading("Deleting template...", 0);
      await quotationTemplateService.delete(templateId);
      message.destroy();
      message.success("Quotation template deleted successfully");
      await fetchTemplates();
    } catch (error) {
      message.destroy();
      console.error("Error deleting quotation template:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete quotation template";
      message.error(errorMessage);
    }
  }, []);

  const handleViewTemplate = useCallback((designData) => {
    setJsonViewData(designData);
    setJsonViewTitle("View Template Design");
    setJsonViewModalOpen(true);
  }, []);

  const handleViewResponse = useCallback((replyJson) => {
    setJsonViewData(replyJson);
    setJsonViewTitle("View Response");
    setJsonViewModalOpen(true);
  }, []);

  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedTemplate(null);
  };

  const handleJsonViewModalClose = () => {
    setJsonViewModalOpen(false);
    setJsonViewData(null);
    setJsonViewTitle("");
  };

  if (loading && templates.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Quotation Templates</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Create Quotation
        </Button>
      </div>

      <QuotationTemplatesTable
        templates={templates}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewTemplate={handleViewTemplate}
        onViewResponse={handleViewResponse}
      />

      <QuotationTemplateCreateModal
        open={createModalOpen}
        onCancel={handleCreateModalClose}
        onSuccess={handleCreateSuccess}
      />

      <QuotationTemplateEditModal
        open={editModalOpen}
        onCancel={handleEditModalClose}
        template={selectedTemplate}
        onSuccess={handleEditSuccess}
      />

      <JsonViewModal
        open={jsonViewModalOpen}
        onCancel={handleJsonViewModalClose}
        title={jsonViewTitle}
        jsonData={jsonViewData}
        isFormBuilder={jsonViewTitle === "View Template Design"}
      />
    </div>
  );
};

export default QuotationTemplatesPage;
