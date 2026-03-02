import React from "react";
import { Outlet } from "react-router-dom";
import Logo from "../../assets/images/eServiceLogo.png";
import CookieConsent from "@/pages/landing/components/CookieConsent";
import { FadeIn } from "../custom/Animation";
import { logoImage } from "@/lib/env";

const LandingLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1>Header</h1>
        </div>
      </header>
      <main>
        <Outlet />
        {/* Cookie Consent */}
        <CookieConsent />
      </main>
      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
          Footer
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;
