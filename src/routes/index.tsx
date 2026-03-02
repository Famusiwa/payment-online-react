import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import LandingLayout from "../components/layout/LandingLayout";

// Pages
import HomePage from "../pages/landing/HomePage";


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Landing Routes */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
