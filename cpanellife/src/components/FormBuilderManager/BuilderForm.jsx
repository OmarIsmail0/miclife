import "./jquery-setup";
import React, { Component, createRef } from "react";
import "./style.css";
import "jquery-ui-sortable";
import "formBuilder";
import { Button, Space, Modal, Input, Table, message, Spin, Select, Popconfirm } from "antd";
import { FileAddOutlined, FolderOpenOutlined, SaveOutlined, SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { formTemplateService } from "../../api";

// eslint-disable-next-line no-unused-vars
const $ = window.jQuery;

/* 
The order of the imports and requires is very important, especially in the online enviornment.
The two jQuery libraries must be imported using Node's require(), and not ES6 import.
Also, these two requires MUST come after setting the global jQuery and $ symbols.

In my Babel/Webpack project, the type and order of the imports is a little less sensitive.
For my project, the following alternative works:

    import $ from 'jquery';
    import React from 'react';
    import ReactDOM from 'react-dom';
    import 'jquery-ui-sortable';

    window.jQuery = $;
    window.$ = $;

    require('formBuilder');
*/

class FormBuilder extends Component {
  fb = createRef();
  formBuilderInstance = null;
  onSaveCallback = null;
  state = {
    openModalVisible: false,
    saveModalVisible: false,
    forms: [],
    loading: false,
    selectedRowKeys: [],
    currentFormId: null,
    currentFormName: null,
    saveFormValues: {
      name: "",
      direction: "en",
    },
    saveFormErrors: {},
    searchText: {
      id: "",
      name: "",
    },
  };

  componentDidMount() {
    // // Store the onSave callback
    // this.onSaveCallback = (evt, formData) => {
    //   // Log form data to console when Save button is clicked
    //   console.log("Form Data:", formData);
    //   console.log("Form Data (JSON):", JSON.stringify(formData, null, 2));

    //   // Also get data using the API method
    //   const data = this.formBuilderInstance.actions.getData();
    //   console.log("Form Data (via getData()):", data);
    // };

    this.formBuilderInstance = window.jQuery(this.fb.current).formBuilder({
      disabledActionButtons: ["data", "clear", "save"], // Hide the [{...}], Clear, and Save buttons
      //   onSave: this.onSaveCallback,
    });
  }

  handleNew = () => {
    if (this.formBuilderInstance) {
      this.formBuilderInstance.actions.clearFields();
      this.setState({ currentFormId: null, currentFormName: null });
      message.success("New form created");
    }
  };

  handleOpen = async () => {
    this.setState({ openModalVisible: true, loading: true, selectedRowKeys: [], searchText: { id: "", name: "" } });

    try {
      const response = await formTemplateService.getAll({ PageNumber: 1, PageSize: 1000 });
      const forms = response.data || response || [];
      this.setState({ forms, loading: false });
    } catch (error) {
      console.error("Error fetching forms:", error);
      message.error("Failed to load forms");
      this.setState({ loading: false, forms: [] });
    }
  };

  handleCloseOpenModal = () => {
    this.setState({ openModalVisible: false, selectedRowKeys: [], searchText: { id: "", name: "" } });
  };

  handleOk = async () => {
    const { selectedRowKeys, forms } = this.state;

    if (selectedRowKeys.length === 0) {
      message.warning("Please select a form to load");
      return;
    }

    const selectedForm = forms.find((f) => f.id === selectedRowKeys[0]);
    if (selectedForm) {
      await this.loadFormFromAPI(selectedForm.id);
      this.handleCloseOpenModal();
    }
  };

  handleSearch = (field, value) => {
    this.setState({
      searchText: {
        ...this.state.searchText,
        [field]: value,
      },
    });
  };

  handleSave = () => {
    if (!this.formBuilderInstance) {
      message.error("Form builder not initialized. Please refresh the page.");
      return;
    }
    const formData = this.formBuilderInstance.actions.getData("json");

    if (!formData || formData.length === 0) {
      message.warning("Form is empty. Please add some fields before saving.");
      return;
    }

    // If form is already saved, update it
    if (this.state.currentFormId) {
      message.loading("Updating form...", 0);
      this.updateForm(this.state.currentFormId, this.state.currentFormName, this.state.currentFormDirection, formData);
    } else {
      // First time saving - show modal for name and direction
      this.setState({ saveModalVisible: true });
    }
  };

  handleSaveModalOk = async () => {
    const { saveFormValues } = this.state;

    // Validate
    const errors = {};
    if (!saveFormValues.name || saveFormValues.name.trim() === "") {
      errors.name = "Please enter a form name";
      message.warning("Please enter a form name");
    }
    if (!saveFormValues.direction) {
      errors.direction = "Please select a direction";
      if (!errors.name) {
        message.warning("Please select a direction");
      }
    }

    if (Object.keys(errors).length > 0) {
      this.setState({ saveFormErrors: errors });
      return;
    }

    try {
      message.loading("Saving form...", 0);
      const formData = this.formBuilderInstance.actions.getData("json");
      await this.createForm(saveFormValues.name.trim(), saveFormValues.direction, formData);
      this.setState({
        saveModalVisible: false,
        saveFormValues: { name: "", direction: "en" },
        saveFormErrors: {},
      });
      message.destroy(); // Clear loading message
    } catch (error) {
      console.error("Error saving form:", error);
      message.destroy(); // Clear loading message
      message.error("Failed to save form. Please try again.");
    }
  };

  handleSaveModalCancel = () => {
    this.setState({
      saveModalVisible: false,
      saveFormValues: { name: "", direction: "en" },
      saveFormErrors: {},
    });
  };

  handleSaveFormChange = (field, value) => {
    this.setState({
      saveFormValues: {
        ...this.state.saveFormValues,
        [field]: value,
      },
      saveFormErrors: {
        ...this.state.saveFormErrors,
        [field]: undefined,
      },
    });
  };

  createForm = async (name, direction, design) => {
    try {
      this.setState({ loading: true });
      const designString = typeof design === "string" ? design : JSON.stringify(design);

      const response = await formTemplateService.create({
        name,
        language: direction,
        design: designString,
      });

      const newForm = response.data || response;
      this.setState({
        currentFormId: newForm.id,
        currentFormName: newForm.name,
        loading: false,
      });

      message.success(`Form "${name}" saved successfully`, 3);
    } catch (error) {
      console.error("Error creating form:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to save form";
      message.error(`Failed to save form: ${errorMessage}`, 4);
      this.setState({ loading: false });
      throw error; // Re-throw to handle in calling function
    }
  };

  updateForm = async (formId, name, direction, design) => {
    try {
      this.setState({ loading: true });
      const designString = typeof design === "string" ? design : JSON.stringify(design);

      console.log("formId", formId);
      console.log("designString", designString);
      console.log("name", name);
      console.log("direction", direction);

      await formTemplateService.update({
        id: formId,
        name: name,
        design: designString,
        language: direction,
      });

      this.setState({ loading: false });
      message.destroy(); // Clear loading message
      message.success("Form updated successfully", 3);
    } catch (error) {
      console.error("Error updating form:", error);
      message.destroy(); // Clear loading message
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update form";
      message.error(`Failed to update form: ${errorMessage}`, 4);
      this.setState({ loading: false });
    }
  };

  handleDelete = async () => {
    const { currentFormId, currentFormName } = this.state;

    if (!currentFormId) {
      message.warning("No form loaded to delete", 2);
      return;
    }

    try {
      this.setState({ loading: true });
      message.loading("Deleting form...", 0);
      await formTemplateService.delete(currentFormId);

      if (this.formBuilderInstance) {
        this.formBuilderInstance.actions.clearFields();
      }

      this.setState({
        currentFormId: null,
        currentFormName: null,
        loading: false,
      });

      message.destroy(); // Clear loading message
      const formName = currentFormName ? `"${currentFormName}"` : "Form";
      message.success(`${formName} deleted successfully`, 3);
    } catch (error) {
      console.error("Error deleting form:", error);
      message.destroy(); // Clear loading message
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete form";
      message.error(`Failed to delete form: ${errorMessage}`, 4);
      this.setState({ loading: false });
    }
  };

  loadFormFromAPI = async (formId) => {
    try {
      this.setState({ loading: true });
      const response = await formTemplateService.getById(formId);
      const form = response.data || response;

      if (!form || !form.design) {
        message.error("Form design not found");
        this.setState({ loading: false });
        return;
      }

      // Parse the design JSON if it's a string
      let designData;
      if (typeof form.design === "string") {
        designData = JSON.parse(form.design);
      } else {
        designData = form.design;
      }

      if (this.formBuilderInstance) {
        this.formBuilderInstance.actions.setData(designData);
        message.success(`Form "${form.name}" loaded successfully`);
      }

      this.setState({
        loading: false,
        currentFormId: form.id,
        currentFormName: form.name,
        currentFormDirection: form.language,
      });
    } catch (error) {
      console.error("Error loading form:", error);
      message.error("Failed to load form");
      this.setState({ loading: false });
    }
  };

  render() {
    const {
      openModalVisible,
      saveModalVisible,
      forms,
      loading,
      selectedRowKeys,
      searchText,
      currentFormId,
      saveFormValues,
      saveFormErrors,
    } = this.state;

    // Filter forms based on search text
    const filteredForms = forms.filter((form) => {
      const idMatch = searchText.id === "" || String(form.id).toLowerCase().includes(searchText.id.toLowerCase());
      const nameMatch =
        searchText.name === "" || (form.name && form.name.toLowerCase().includes(searchText.name.toLowerCase()));
      return idMatch && nameMatch;
    });

    const columns = [
      {
        title: (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>Id</span>
            <Input
              size="small"
              placeholder="Search"
              prefix={<SearchOutlined />}
              value={searchText.id}
              onChange={(e) => this.handleSearch("id", e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{ width: 120 }}
            />
          </div>
        ),
        dataIndex: "id",
        key: "id",
        width: 150,
      },
      {
        title: (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>Name</span>
            <Input
              size="small"
              placeholder="Search"
              prefix={<SearchOutlined />}
              value={searchText.name}
              onChange={(e) => this.handleSearch("name", e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{ width: 120 }}
            />
          </div>
        ),
        dataIndex: "name",
        key: "name",
      },
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedKeys) => {
        this.setState({ selectedRowKeys: selectedKeys });
      },
      type: "radio",
    };

    return (
      <div>
        <div
          style={{
            background: "#fff",
            padding: "12px 16px",
            borderBottom: "1px solid #e8e8e8",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Space>
            <Button icon={<FileAddOutlined />} onClick={this.handleNew} type="default">
              New
            </Button>
            <Button icon={<FolderOpenOutlined />} onClick={this.handleOpen} type="default">
              Open
            </Button>
            <Button icon={<SaveOutlined />} onClick={this.handleSave} type="default">
              {currentFormId ? "Update" : "Save"}
            </Button>
            <Popconfirm
              title="Delete Form"
              description="Are you sure you want to delete this form?"
              onConfirm={this.handleDelete}
              okText="Yes"
              cancelText="No"
              disabled={!currentFormId}
            >
              <Button icon={<DeleteOutlined />} type="default" danger disabled={!currentFormId}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        </div>
        <div id="fb-editor" ref={this.fb} />
        <Modal
          title="Load Form"
          open={openModalVisible}
          onCancel={this.handleCloseOpenModal}
          onOk={this.handleOk}
          okText="OK"
          cancelText="Cancel"
          width={600}
          confirmLoading={loading}
        >
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={filteredForms}
              rowKey="id"
              rowSelection={rowSelection}
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
              }}
              scroll={{ y: 400 }}
              size="small"
            />
          </Spin>
        </Modal>
        <Modal
          title="Save Form"
          open={saveModalVisible}
          onOk={this.handleSaveModalOk}
          onCancel={this.handleSaveModalCancel}
          okText="Save"
          cancelText="Cancel"
          confirmLoading={loading}
        >
          <div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>Form Name</label>
              <Input
                placeholder="Enter form name"
                value={saveFormValues.name}
                onChange={(e) => this.handleSaveFormChange("name", e.target.value)}
                status={saveFormErrors.name ? "error" : ""}
              />
              {saveFormErrors.name && (
                <div style={{ color: "#ff4d4f", fontSize: 14, marginTop: 4 }}>{saveFormErrors.name}</div>
              )}
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>Direction</label>
              <Select
                placeholder="Select direction"
                value={saveFormValues.direction}
                onChange={(value) => this.handleSaveFormChange("direction", value)}
                style={{ width: "100%" }}
                status={saveFormErrors.direction ? "error" : ""}
              >
                <Select.Option value="en">Left to right</Select.Option>
                <Select.Option value="ar">Right to left</Select.Option>
              </Select>
              {saveFormErrors.direction && (
                <div style={{ color: "#ff4d4f", fontSize: 14, marginTop: 4 }}>{saveFormErrors.direction}</div>
              )}
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default function BuilderForm() {
  return <FormBuilder />;
}
