import React from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../api";
import { AUTH_CONFIG } from "../constants/config";

function ProtectedRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();

  return isAuthenticated ? children : <Navigate to={AUTH_CONFIG.LOGIN_PATH} replace />;
}

export default ProtectedRoute;
