import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import LandingLayout from "../components/layout/LandingLayout";
import LandingPage from "@/pages/Landingpage";

// Pages
// import HomePage from "../pages/landing/HomePa

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Landing Routes */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
