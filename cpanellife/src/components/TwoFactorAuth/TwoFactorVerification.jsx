import React, { useState } from "react";
import { Card, Input, Button, Alert, Typography, Space, Divider, message } from "antd";
import { SafetyOutlined, KeyOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { COLORS } from "../../constants/colors";

const { Title, Text } = Typography;

const TwoFactorVerification = ({ onVerify, onBackupCodeVerify, onBack, loading, error }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCode, setBackupCode] = useState("");
  const [showBackupCode, setShowBackupCode] = useState(false);

  const handleVerify = () => {
    if (showBackupCode) {
      if (!backupCode.trim()) {
        message.error("Please enter a backup code");
        return;
      }
      onBackupCodeVerify(backupCode.trim());
    } else {
      if (verificationCode.length !== 6) {
        message.error("Please enter a valid 6-digit code");
        return;
      }
      onVerify(verificationCode);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setVerificationCode(value);
  };

  const handleBackupCodeChange = (e) => {
    setBackupCode(e.target.value.replace(/\s/g, ""));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: COLORS.WHITESMOKE,
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <SafetyOutlined style={{ fontSize: "48px", color: COLORS.STEELBLUE }} />
          <Title level={3} style={{ marginTop: "16px" }}>
            Two-Factor Authentication
          </Title>
          <Text type="secondary">{showBackupCode ? "Enter one of your backup codes" : "Enter the 6-digit code from your authenticator app"}</Text>
        </div>

        {error && <Alert message="Verification Failed" description={error} type="error" showIcon style={{ marginBottom: "20px" }} />}

        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {!showBackupCode ? (
            <Input
              value={verificationCode}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="000000"
              style={{
                fontSize: "24px",
                textAlign: "center",
                letterSpacing: "8px",
                height: "60px",
              }}
              maxLength={6}
              autoFocus
            />
          ) : (
            <Input
              value={backupCode}
              onChange={handleBackupCodeChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter backup code"
              style={{
                fontSize: "16px",
                textAlign: "center",
                height: "50px",
              }}
              autoFocus
            />
          )}

          <Button type="primary" block size="large" onClick={handleVerify} loading={loading} disabled={showBackupCode ? !backupCode.trim() : verificationCode.length !== 6}>
            Verify
          </Button>

          <Divider>or</Divider>

          <Button type="link" block icon={<KeyOutlined />} onClick={() => setShowBackupCode(!showBackupCode)} style={{ marginBottom: "10px" }}>
            {showBackupCode ? "Use Authenticator App" : "Use Backup Code"}
          </Button>

          <Button type="link" block icon={<ArrowLeftOutlined />} onClick={onBack}>
            Back to Login
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default TwoFactorVerification;
