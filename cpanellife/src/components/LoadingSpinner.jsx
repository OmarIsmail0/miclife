import { Spin } from "antd";

const LoadingSpinner = ({ size = "large", style = {} }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "200px",
      ...style,
    }}
  >
    <Spin size={size} />
  </div>
);

export default LoadingSpinner;
