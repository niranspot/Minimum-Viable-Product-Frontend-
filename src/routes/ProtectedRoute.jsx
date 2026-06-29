import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CircularProgress, Box } from "@mui/material";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, sessionChecked } = useSelector(
    (state) => state.auth,
  );

  // Never decide to redirect until the one-time startup session check has
  // actually committed to the store. Without this, isAuthenticated can still
  // read as its initial `false` for a render or two while restoreSession is
  // in flight — causing a brief bounce to /login before it self-corrects.
  if (!sessionChecked) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;