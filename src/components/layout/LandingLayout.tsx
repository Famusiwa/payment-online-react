import React from "react";
import { Outlet } from "react-router-dom";
import CookieConsent from "@/pages/landing/components/CookieConsent";
import logoImage from "@/assets/images/state-logo.png";

const LandingLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <div className="flex items-center gap-3">
              <img
                src={logoImage}
                alt="Delta State Government"
                className="h-10 sm:h-12 w-auto"
              />
              <p className="text-sm font-semibold text-slate-800 leading-tight">
                Delta State <br /> Government
              </p>
            </div>

            <a
              href="https://selfservice.deltairs.com/"
              className="rounded-md bg-emerald-600 px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Self-Service
            </a>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
        <CookieConsent />
      </main>
    </div>
  );
};

export default LandingLayout;
