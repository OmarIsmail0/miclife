import React, { useState, useEffect } from "react";
import { Modal, Steps, Button, Input, Alert, Typography, Space, Card, Row, Col, message, Spin, Divider } from "antd";
import { QrcodeOutlined, SafetyOutlined, CheckCircleOutlined, CopyOutlined, WarningOutlined } from "@ant-design/icons";
import api from "../../apis/api";
import { AuthService } from "../../utils/auth";
import { TWO_FACTOR_CONFIG } from "../../constants/config";
import { COLORS } from "../../constants/colors";

const { Title, Text, Paragraph } = Typography;

const TwoFactorSetup = ({ visible = true, onClose, onSuccess, isModal = true }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState([]);
  const [error, setError] = useState("");

  const steps = [
    {
      title: "Setup",
      description: "Generate QR Code",
      icon: <QrcodeOutlined />,
    },
    {
      title: "Verify",
      description: "Verify Code",
      icon: <SafetyOutlined />,
    },
    {
      title: "Backup",
      description: "Save Backup Codes",
      icon: <CheckCircleOutlined />,
    },
  ];

  useEffect(() => {
    if (visible) {
      generateQRCode();
    }
  }, [visible]);

  const generateQRCode = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/2fa/generate");
      setQrCode(response.data.qrCode);
      setSecret(response.data.secret);
    } catch (err) {
      setError("Failed to generate QR code. Please try again.");
      console.error("2FA generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/2fa/verify", {
        token: verificationCode,
        secret: secret,
      });

      setBackupCodes(response.data.backupCodes);
      setCurrentStep(2);
      message.success("2FA verified successfully!");
    } catch (err) {
      setError("Invalid verification code. Please try again.");
      console.error("2FA verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const complete2FASetup = async () => {
    setLoading(true);

    try {
      const tempToken = AuthService.getTwoFactorToken();

      if (tempToken) {
        // Complete setup for authenticated user
        const response = await api.post("/auth/2fa/enable", {
          tempToken: tempToken,
        });

        AuthService.complete2FASetup(response.data.token, response.data.user);
      } else {
        // Regular setup enable
        await api.post("/auth/2fa/enable");
        AuthService.set2FAEnabled(true);
      }

      message.success("Two-Factor Authentication enabled successfully!");
      onSuccess();
      handleClose();
    } catch (err) {
      setError("Failed to enable 2FA. Please try again.");
      console.error("2FA enable error:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    message.success("Copied to clipboard!");
  };

  const handleClose = () => {
    if (!TWO_FACTOR_CONFIG.MANDATORY || AuthService.has2FAEnabled()) {
      setCurrentStep(0);
      setQrCode("");
      setSecret("");
      setVerificationCode("");
      setBackupCodes([]);
      setError("");
      onClose();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div style={{ textAlign: "center" }}>
            <Title level={4}>Setup Two-Factor Authentication</Title>
            {TWO_FACTOR_CONFIG.MANDATORY && (
              <Alert
                message="Security Requirement"
                description="Two-Factor Authentication is mandatory for all users. Please complete the setup to continue."
                type="info"
                showIcon
                icon={<SafetyOutlined />}
                style={{ marginBottom: "20px" }}
              />
            )}
            <Paragraph>Scan the QR code below with your authenticator app (Google Authenticator, Authy, etc.)</Paragraph>

            {loading ? (
              <Spin size="large" />
            ) : (
              <Space direction="vertical" size="large">
                <div
                  style={{
                    border: "1px solid #d9d9d9",
                    padding: "20px",
                    borderRadius: "8px",
                    backgroundColor: COLORS.WHITE,
                  }}
                >
                  <img src={qrCode} alt="2FA QR Code" style={{ width: "200px", height: "200px" }} />
                </div>

                <div>
                  <Text strong>Manual Entry Code:</Text>
                  <br />
                  <Input.Group compact>
                    <Input value={secret} readOnly style={{ width: "300px" }} />
                    <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(secret)}>
                      Copy
                    </Button>
                  </Input.Group>
                </div>
              </Space>
            )}
          </div>
        );

      case 1:
        return (
          <div style={{ textAlign: "center" }}>
            <Title level={4}>Verify Your Setup</Title>
            <Paragraph>Enter the 6-digit code from your authenticator app</Paragraph>

            <Space direction="vertical" size="large">
              <Input
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter 6-digit code"
                style={{
                  width: "200px",
                  fontSize: "18px",
                  textAlign: "center",
                  letterSpacing: "5px",
                }}
                maxLength={6}
              />

              <Button type="primary" onClick={verifyCode} loading={loading} disabled={verificationCode.length !== 6}>
                Verify Code
              </Button>
            </Space>
          </div>
        );

      case 2:
        return (
          <div>
            <Title level={4} style={{ textAlign: "center" }}>
              <CheckCircleOutlined style={{ color: COLORS.LIMEGREEN }} /> Setup Complete!
            </Title>

            <Alert
              message="Important: Save Your Backup Codes"
              description="These codes can be used to access your account if you lose your authenticator device. Store them in a safe place."
              type="warning"
              icon={<WarningOutlined />}
              style={{ marginBottom: "20px" }}
            />

            <Card title="Backup Codes" style={{ marginBottom: "20px" }}>
              <Row gutter={[16, 16]}>
                {backupCodes.map((code, index) => (
                  <Col span={12} key={index}>
                    <div
                      style={{
                        padding: "8px 12px",
                        backgroundColor: COLORS.WHITESMOKE,
                        borderRadius: "4px",
                        fontFamily: "monospace",
                        fontSize: "14px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>{code}</span>
                      <Button type="text" size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(code)} />
                    </div>
                  </Col>
                ))}
              </Row>

              <Divider />

              <Button block icon={<CopyOutlined />} onClick={() => copyToClipboard(backupCodes.join("\n"))}>
                Copy All Backup Codes
              </Button>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const content = (
    <>
      <Steps current={currentStep} items={steps} style={{ marginBottom: "30px" }} />

      {error && <Alert message="Error" description={error} type="error" closable onClose={() => setError("")} style={{ marginBottom: "20px" }} />}

      {renderStepContent()}

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        {currentStep === 0 && (
          <Button type="primary" onClick={() => setCurrentStep(1)} disabled={loading || !qrCode}>
            Next: Verify Code
          </Button>
        )}

        {currentStep === 2 && (
          <Button type="primary" onClick={complete2FASetup} loading={loading}>
            Complete Setup
          </Button>
        )}
      </div>
    </>
  );

  if (!isModal) {
    return (
      <Card title="Two-Factor Authentication Setup" style={{ width: "100%" }}>
        {content}
      </Card>
    );
  }

  return (
    <Modal
      title="Two-Factor Authentication Setup"
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={600}
      centered
      closable={!TWO_FACTOR_CONFIG.MANDATORY || AuthService.has2FAEnabled()}
      maskClosable={!TWO_FACTOR_CONFIG.MANDATORY || AuthService.has2FAEnabled()}
    >
      {content}
    </Modal>
  );
};

export default TwoFactorSetup;
