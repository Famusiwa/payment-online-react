import React, { useState } from "react";

const StatusSection: React.FC<{
  isOpen: boolean;
  onClick: (ref: string) => void;
}> = ({ isOpen }) => {
  if (!isOpen) return null;
  const [statusRef, setStatusRef] = useState("");
  //   const [showResult, setShowResult] = useState(false);

  return (
    <div className="w-full max-w-xl bg-white rounded-xl border border-slate-200 px-5 py-5 mt-2">
      <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-2">
        Enter Transaction Ref Number
      </h3>
      <p className="text-xs sm:text-sm text-red-500 mb-3">
        Check your email for your transaction reference number
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={statusRef}
          onChange={(e) => setStatusRef(e.target.value)}
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Transaction Ref Number"
        />
        <button className="inline-flex justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
          Query
        </button>
      </div>
    </div>
  );
};

export default StatusSection;

{
  /* <div className="w-full max-w-xl bg-white rounded-xl border border-slate-200 px-5 py-5 mt-2">
        <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-2">
          Enter Transaction Ref Number
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mb-3">
          Check your email for your transaction reference number
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={statusRef}
            onChange={(e) => setStatusRef(e.target.value)}
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Transaction Ref Number"
          />
          <button
            onClick={() => setShowResult(true)}
            className="inline-flex justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Query
          </button>
        </div>

        {showResult && (
          <div className="mt-4 text-sm text-slate-700">
            Showing mock result for Transaction Ref:{" "}
            <span className="font-semibold">{statusRef || "N/A"}</span>
          </div>
        )}
      </div> */
}
