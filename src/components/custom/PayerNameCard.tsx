import React from "react";
import { Building2 } from "lucide-react";

type Props = { onClick: () => void };

const PayerNameCard: React.FC<Props> = ({ onClick }) => (
  <article className="bg-white rounded-xl shadow-sm border border-emerald-200 flex flex-col">
    <div className="flex-1 px-6 py-5">
      <div className="inline-flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-500 mb-4 p-3">
        <Building2 className="text-xl" />
      </div>
      <h2 className="text-lg font-semibold text-slate-900 mb-1">PAYER NAME</h2>
      <p className="text-xs sm:text-sm text-slate-500">(Other Payments)</p>
    </div>
    <button
      onClick={onClick}
      className="border-t border-emerald-200 px-6 py-3 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 text-left flex items-center justify-between transition-colors"
    >
      <span>Click Here</span>
      <span aria-hidden>→</span>
    </button>
  </article>
);

export default PayerNameCard;
