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
      
      {/* Default Route - Redirect to Dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
