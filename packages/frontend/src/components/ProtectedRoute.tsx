import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface ProtectedRouteProps {
  allowedRoles: string[]; // Roles that can access this route
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const user: any = useSelector((state: RootState) => state.user);

  if (!user.isLoggedIn) {
    // Redirect to login if user is not logged in
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(user.type)) {
    // Redirect to login if user doesn't have the correct role
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
