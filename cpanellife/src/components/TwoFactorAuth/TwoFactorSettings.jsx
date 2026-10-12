import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Input, Alert, Typography, Space, Divider, message, Spin, Tag } from "antd";
import { SafetyOutlined, KeyOutlined, ReloadOutlined, CheckCircleOutlined } from "@ant-design/icons";
import api from "../../apis/api";
import TwoFactorSetup from "./TwoFactorSetup";
import { TWO_FACTOR_CONFIG } from "../../constants/config";
import { COLORS } from "../../constants/colors";

const { Title, Text, Paragraph } = Typography;

const TwoFactorSettings = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [setupModalVisible, setSetupModalVisible] = useState(false);
  const [regenerateModalVisible, setRegenerateModalVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTwoFactorStatus();
  }, []);

  const fetchTwoFactorStatus = async () => {
    setLoading(true);
    try {
      const response = await api.get("/auth/2fa/status");
      setTwoFactorEnabled(response.data.enabled);
    } catch (err) {
      console.error("Failed to fetch 2FA status:", err);
      message.error("Failed to load 2FA status");
    } finally {
      setLoading(false);
    }
  };

  const regenerateBackupCodes = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/2fa/regenerate-backup-codes", {
        token: verificationCode,
      });

      setBackupCodes(response.data.backupCodes);
      setVerificationCode("");
      message.success("Backup codes regenerated successfully");
    } catch (err) {
      setError("Invalid verification code. Please try again.");
      console.error("Backup codes regeneration error:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    message.success("Copied to clipboard!");
  };

  const handleSetupSuccess = () => {
    setTwoFactorEnabled(true);
    fetchTwoFactorStatus();
  };

  if (loading && !setupModalVisible && !regenerateModalVisible) {
    return (
      <Card>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <Title level={4}>
              <SafetyOutlined style={{ marginRight: "8px", color: COLORS.STEELBLUE }} />
              Two-Factor Authentication
              <Tag color="red" style={{ marginLeft: "8px" }}>
                MANDATORY
              </Tag>
            </Title>

            <Alert
              message="Security Requirement"
              description={TWO_FACTOR_CONFIG.MANDATORY_NOTICE}
              type="info"
              showIcon
              icon={<SafetyOutlined />}
              style={{ marginBottom: "16px" }}
            />

            <Paragraph>
              Two-Factor Authentication (2FA) is mandatory for all users to ensure maximum security. This adds an extra
              layer of protection to your account by requiring a code from your authenticator app in addition to your
              password.
            </Paragraph>

            <div style={{ marginTop: "20px" }}>
              <Text strong>Status: </Text>
              {twoFactorEnabled ? (
                <Tag color="success" icon={<CheckCircleOutlined />}>
                  ENABLED & ACTIVE
                </Tag>
              ) : (
                <Tag color="warning" icon={<SafetyOutlined />}>
                  SETUP REQUIRED
                </Tag>
              )}
            </div>
          </div>
        </div>

        {!twoFactorEnabled && (
          <>
            <Divider />
            <Alert
              message="Setup Required"
              description="You must complete Two-Factor Authentication setup to access all system features."
              type="warning"
              showIcon
              action={
                <Button size="small" type="primary" onClick={() => setSetupModalVisible(true)}>
                  Setup Now
                </Button>
              }
            />
          </>
        )}

        {twoFactorEnabled && (
          <>
            <Divider />
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Alert
                message="Two-Factor Authentication is Active"
                description="Your account is secured with 2FA. You can regenerate backup codes below if needed."
                type="success"
                showIcon
              />

              <div>
                <Button icon={<ReloadOutlined />} onClick={() => setRegenerateModalVisible(true)}>
                  Regenerate Backup Codes
                </Button>
                <Text type="secondary" style={{ marginLeft: "12px" }}>
                  Use backup codes if you lose access to your authenticator app
                </Text>
              </div>
            </Space>
          </>
        )}
      </Card>

      {/* Setup Modal */}
      <TwoFactorSetup
        visible={setupModalVisible}
        onClose={() => setSetupModalVisible(false)}
        onSuccess={handleSetupSuccess}
      />

      {/* Regenerate Backup Codes Modal */}
      <Modal
        title="Regenerate Backup Codes"
        open={regenerateModalVisible}
        onCancel={() => {
          setRegenerateModalVisible(false);
          setVerificationCode("");
          setBackupCodes([]);
          setError("");
        }}
        footer={
          backupCodes.length > 0
            ? [
                <Button key="copy" icon={<KeyOutlined />} onClick={() => copyToClipboard(backupCodes.join("\n"))}>
                  Copy All Codes
                </Button>,
                <Button key="done" type="primary" onClick={() => setRegenerateModalVisible(false)}>
                  Done
                </Button>,
              ]
            : [
                <Button key="cancel" onClick={() => setRegenerateModalVisible(false)}>
                  Cancel
                </Button>,
                <Button
                  key="regenerate"
                  type="primary"
                  onClick={regenerateBackupCodes}
                  loading={loading}
                  disabled={verificationCode.length !== 6}
                >
                  Regenerate
                </Button>,
              ]
        }
      >
        {backupCodes.length === 0 ? (
          <>
            <Paragraph>
              Enter your current 2FA code to regenerate your backup codes. This will invalidate all existing backup
              codes.
            </Paragraph>

            {error && <Alert message={error} type="error" style={{ marginBottom: "20px" }} />}

            <Input
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter 6-digit code"
              style={{
                fontSize: "18px",
                textAlign: "center",
                letterSpacing: "5px",
              }}
              maxLength={6}
            />
          </>
        ) : (
          <>
            <Alert
              message="New Backup Codes Generated"
              description="Save these codes in a secure location. They can be used to access your account if you lose your authenticator device."
              type="success"
              style={{ marginBottom: "20px" }}
            />

            <div
              style={{
                backgroundColor: "#f5f5f5",
                padding: "16px",
                borderRadius: "6px",
                fontFamily: "monospace",
              }}
            >
              {backupCodes.map((code, index) => (
                <div key={index} style={{ marginBottom: "8px" }}>
                  {code}
                </div>
              ))}
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default TwoFactorSettings;
