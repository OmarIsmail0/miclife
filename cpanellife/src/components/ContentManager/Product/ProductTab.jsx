import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import TabsComponent from "./TabsComponent";
import { productService } from "../../../api";
import LoadingSpinner from "../../LoadingSpinner";
import { setProductData } from "../../../store/contentManagerSlice";

const ProductTab = () => {
  const dispatch = useDispatch();
  const tabsComponentRef = useRef();
  const { data: productDataList, needsRefresh } = useSelector((state) => state.contentManager.tabData.products);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await productService.getAll({ PageNumber: 1, PageSize: 1000 });
      dispatch(setProductData(response.data));
    } catch (err) {
      message.error(err?.message || "Failed to load Products");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    // Only fetch if data is empty or needs refresh
    if (productDataList.length === 0 || needsRefresh) {
      fetchProducts();
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
        <h3>Products</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
          Add New
        </Button>
      </div>

      {loading && productDataList.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <TabsComponent ref={tabsComponentRef} data={productDataList} onUpdate={fetchProducts} />
      )}
    </div>
  );
};

export default ProductTab;
