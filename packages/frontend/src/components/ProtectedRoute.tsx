import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface ProtectedRouteProps {
  allowedRoles: string[]; // Roles that can access this route
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const auth: any = useSelector((state: RootState) => state.auth);

  if (!auth.user.isLoggedIn) {
    // Redirect to login if user is not logged in
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(auth.user.role)) {
    // Redirect to login if user doesn't have the correct role
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
