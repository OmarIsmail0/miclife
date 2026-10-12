import { Form, Input, Button, Layout, Image, Alert, message, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import img from "../assets/logo.svg";
import { authService } from "../api";
import { AuthService } from "../utils/auth";
import { AUTH_CONFIG, VALIDATION_MESSAGES } from "../constants/config";
import { COLORS } from "../constants/colors";

const { Title } = Typography;

const AuthPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [twoFactorError, setTwoFactorError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");

  const onFinish = async (values) => {
    setLoading(true);
    setError("");
    setUserEmail(values.email);

    try {
      const response = await authService.login({
        email: values.email,
        password: values.password,
      });

      // Check if 2FA is required
      if (response.data.isFactorAuth) {
        setShowTwoFactor(true);
        message.info("Please enter your 2FA code to continue");
      } else {
        // Complete login without 2FA
        AuthService.setAuthData(response.data.token, response.data.isAuthenticated, response.data.user);

        message.success("Login successful!");
        navigate(AUTH_CONFIG.HOME_PATH, { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.data) {
        setError(error.response.data.message || error.response.data);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorVerify = async () => {
    if (!twoFactorCode || twoFactorCode.length !== 6) {
      setTwoFactorError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setTwoFactorError("");

    try {
      await authService.verify2FA({
        email: userEmail,
        code: twoFactorCode,
      });

      message.success("2FA verification successful!");
      navigate(AUTH_CONFIG.HOME_PATH, { replace: true });
    } catch (error) {
      console.error("2FA verification error:", error);
      setTwoFactorError("Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowTwoFactor(false);
    setTwoFactorError("");
    setUserEmail("");
    setTwoFactorCode("");
  };

  // Show 2FA Verification if required
  if (showTwoFactor) {
    return (
      <Layout className="App">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <div className="formAuth">
            {/* Logo Section */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <Image width={200} src={img} preview={false} />
            </div>

            {/* Title Section */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Title level={4} style={{ color: COLORS.STEELBLUE, margin: 0 }}>
                Two-Factor Authentication
              </Title>
              <Typography.Text type="secondary">Enter the 6-digit code from your authenticator app</Typography.Text>
            </div>

            {/* Error Alert */}
            {twoFactorError && (
              <Alert message={twoFactorError} type="error" style={{ marginBottom: "20px" }} showIcon />
            )}

            {/* 2FA Code Input */}
            <div style={{ marginBottom: "20px" }}>
              <Input
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
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
            </div>

            {/* Verify Button */}
            <Button
              loading={loading}
              block
              type="primary"
              onClick={handleTwoFactorVerify}
              size="large"
              disabled={twoFactorCode.length !== 6}
              style={{ marginBottom: "16px" }}
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>

            {/* Back to Login Button */}
            <Button block type="link" onClick={handleBackToLogin}>
              Back to Login
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Show login form
  return (
    <Layout className="App">
      <Form className="formAuth" name="login" onFinish={onFinish} autoComplete="off" layout="vertical">
        {/* Logo Section */}
        <Form.Item style={{ textAlign: "center" }}>
          <Image width={200} src={img} preview={false} />
        </Form.Item>

        {/* Title Section */}
        <Form.Item style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={4} style={{ color: COLORS.STEELBLUE, margin: 0 }}>
            CPanel
          </Title>
        </Form.Item>

        {/* Error Alert */}
        {error && (
          <Form.Item>
            <Alert message={error} type="error" closable onClose={() => setError("")} showIcon />
          </Form.Item>
        )}

        {/* Email Field */}
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: VALIDATION_MESSAGES.EMAIL,
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" size="large" />
        </Form.Item>

        {/* Password Field */}
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: VALIDATION_MESSAGES.PASSWORD_REQUIRED,
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Password"
            size="large"
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button loading={loading} block type="primary" htmlType="submit" size="large" style={{ marginTop: 16 }}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default AuthPage;
