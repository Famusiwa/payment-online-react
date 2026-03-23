import React from "react";
import type { ModalType } from "@/pages/Landingpage";
import PayerIdCard from "./PayeridCard";
import AssessmentCard from "@/components/custom/AssessmentCardl";
import PayerNameCard from "@/components/custom/PayerNameCard";
import PayerIdModal from "./PayerIdModal";
import AssessmentModal from "@/components/custom/AssessmentModal";
import PayerNameModal from "@/components/custom/PayerNameModal";

type Props = {
  openModal: ModalType;
  setOpenModal: (value: ModalType) => void;
};

const PaymentSection: React.FC<Props> = ({ openModal, setOpenModal }) => {
  return (
    <section className="mb-8 sm:mb-10">
      <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
        <PayerIdCard onClick={() => setOpenModal("payerId")} />
        <AssessmentCard onClick={() => setOpenModal("assessment")} />
        <PayerNameCard onClick={() => setOpenModal("payerName")} />
      </div>

      <PayerIdModal
        isOpen={openModal === "payerId"}
        onClose={() => setOpenModal(null)}
      />
      <AssessmentModal
        isOpen={openModal === "assessment"}
        onClose={() => setOpenModal(null)}
      />
      <PayerNameModal
        isOpen={openModal === "payerName"}
        onClose={() => setOpenModal(null)}
      />
    </section>
  );
};

export default PaymentSection;
