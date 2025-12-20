import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "../../Common/Loading";
import API from "../../../Configs/ApiEndpoints";

/**
 * FlowRoute protects routes that require specific session data
 * Works with both location.state AND server-side PHP sessions
 * 
 * @param {string} requiredState - The state key to check in location.state
 * @param {string} storageKey - The session key name on the server
 */
const FlowRoute = ({ children, requiredState, storageKey }) => {
  const location = useLocation();
  const [canAccess, setCanAccess] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      // First check location.state (for fresh navigation)
      if (location.state?.[requiredState]) {
        setCanAccess(true);
        setLoading(false);
        return;
      }

      // If no location.state, check server session
      const response = await fetch(
        API.CHECK_SESSION,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await response.json();

      // Check if the required session data exists on server
      if (result[storageKey]) {
        setCanAccess(true);
      } else {
        setCanAccess(false);
      }
    } catch (error) {
      console.error("Session check failed:", error);
      setCanAccess(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Verifying access..." />;
  }

  if (!canAccess) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default FlowRoute;