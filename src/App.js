import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Superlogin from "./components/login/superlogin.jsx";
import Signup from "./components/login/signup.jsx";
import Superpanel from "./components/superpanel.jsx";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isLogged = localStorage.getItem("isLogged") === "true";
  return isLogged ? children : <Navigate to="/login" />;
};

// Catch-all route that redirects based on auth status to prevent loops
const CatchAllRoute = () => {
  const isLogged = localStorage.getItem("isLogged") === "true";
  return <Navigate to={isLogged ? "/dashboard" : "/login"} replace />;
};

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Superlogin />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Superpanel />
          </ProtectedRoute>
        } 
      />
      
      {/* Default Route - Redirect based on auth status */}
      <Route path="/" element={<CatchAllRoute />} />
      <Route path="*" element={<CatchAllRoute />} />
    </Routes>
  );
}
