import React from "react";
import { Calculator } from "lucide-react";

type Props = { onClick: () => void };

const AssessmentCard: React.FC<Props> = ({ onClick }) => (
  <article className="bg-white rounded-xl shadow-sm border border-sky-200 flex flex-col">
    <div className="flex-1 px-6 py-5">
      <div className="inline-flex items-center justify-center rounded-lg bg-sky-50 text-sky-500 mb-4 p-3">
        <Calculator className="text-xl" />
      </div>
      <h2 className="text-lg font-semibold text-slate-900 mb-1">
        ASSESSMENT or PAYMENT CODE
      </h2>
      <p className="text-xs sm:text-sm text-slate-500">
        (Assessment-Based Payments Only)
      </p>
    </div>
    <button
      onClick={onClick}
      className="border-t border-sky-200 px-6 py-3 text-sm font-semibold text-sky-600 hover:bg-sky-50 text-left flex items-center justify-between transition-colors"
    >
      <span>Click Here</span>
      <span aria-hidden>→</span>
    </button>
  </article>
);

export default AssessmentCard;
