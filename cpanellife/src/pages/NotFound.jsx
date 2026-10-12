import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { AUTH_CONFIG } from "../constants/config";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
        padding: "20px",
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={() => navigate(AUTH_CONFIG.HOME_PATH)}>
            Back Home
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;


