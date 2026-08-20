import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const { user, loading } = useAuth();

//   if (loading) return null;

//   if (!user) return <Navigate to="/login" replace />;

//   return <>{children}</>;
// };

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth();

  console.log("ProtectedRoute:", {
    user,
    loading,
    pathname: window.location.pathname,
  });

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
