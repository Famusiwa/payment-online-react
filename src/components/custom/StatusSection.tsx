import React, { useState } from "react";
import TextBox from "./TextBox";

const StatusSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [statusRef, setStatusRef] = useState("");

  return (
    <section className="flex flex-col items-center mb-10 w-full">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center rounded-md bg-emerald-600 px-6 sm:px-10 py-3 text-sm sm:text-base font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors mb-4"
      >
        Check Payment Status
      </button>

      {isOpen && (
        <div className="w-full max-w-xl bg-white rounded-xl border border-slate-200 px-5 py-5 mt-2">
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-2">
            Enter Transaction Ref Number
          </h3>
          <p className="text-xs sm:text-sm text-red-500 mb-3">
            Check your email for your transaction reference number
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <TextBox
              type="text"
              value={statusRef}
              onChange={(e) => setStatusRef(e.target.value)}
              className="flex-1"
              placeholder="Transaction Ref Number"
            />
            <button className="inline-flex justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
              Query
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default StatusSection;
