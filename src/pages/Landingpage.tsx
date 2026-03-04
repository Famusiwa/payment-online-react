import React, { useState } from "react";
import Hero from "@/components/custom/Hero";
import StatusSection from "@/components/custom/StatusSection";
import PaymentSection from "@/components/custom/Paymentsection";
import mastercard from "@/assets/images/Mastercard.webp";
import visa from "@/assets/images/visa.png";
import verve from "@/assets/images/verve.png";
import express from "@/assets/images/xpress.png";
import Contact from "@/components/Contact";

const partner_logos = [mastercard, visa, verve, express];

export type ModalType =
  | "payerId"
  | "assessment"
  | "payerName"
  | "paymentStatus"
  | null;

const LandingPage: React.FC = () => {
  const [openModal, setOpenModal] = useState<ModalType>(null);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <header className="flex items-center justify-between mb-6 sm:mb-10">
          <div className="flex items-center gap-2"></div>
        </header>

        <Hero />

        {/* 3 cards + 3 modals in same section */}
        <PaymentSection openModal={openModal} setOpenModal={setOpenModal} />

        <StatusSection />
        <Contact />
        <footer className="px-4 sm:px-10 lg:px-20 py-6">
          <div className=" flex items-center justify-around gap-4 flex-wrap">
            {partner_logos.map((logo, index) => (
              <div
                key={index}
                className="flex-1 min-w-30 flex items-center justify-center"
              >
                <img
                  src={logo}
                  alt="Partner Logo"
                  className="h-12 w-auto object-contain opacity-80"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
