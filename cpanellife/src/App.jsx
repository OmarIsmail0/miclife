import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";
import { ConfigProvider, App as AntApp } from "antd";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import { Suspense } from "react";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AUTH_CONFIG } from "./constants/config";
import { COLORS } from "./constants/colors";
import HomePage from "./pages/HomePage";
import FormManager from "./pages/FormManager";

function App() {
  return (
    <ErrorBoundary>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: COLORS.STEELBLUE,
            fontFamily: "Roboto, sans-serif",
          },
        }}
      >
        <AntApp>
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner style={{ minHeight: "100vh" }} />}>
              <Routes>
                <Route path={AUTH_CONFIG.LOGIN_PATH} element={<AuthPage />} />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <HomePage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AntApp>
      </ConfigProvider>
    </ErrorBoundary>
  );
}

export default App;
