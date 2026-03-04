import React from "react";
import TextBox from "./TextBox";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const AssessmentModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h3 className="text-lg font-semibold mb-4">
          Assessment or Payment Code
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Enter assessment/payment code details here.
        </p>
        <TextBox
          label="Assessment Code"
          placeholder="Enter your Assessment Code"
        />
        <div className="flex flex-col gap-2 mt-4 sm:flex-row-reverse">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
          <button
            onClick={() => alert("Proceed to payment (Assessment).")}
            className="px-4 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentModal;
