import { useEffect, useState } from "react";
import TextBox from "@/components/custom/TextBox";
import Button from "@/components/custom/Button";
import { showToast } from "@/lib/toast";
import {
  handleAPIError,
} from "@/lib/utils";
import { apiCall } from "@/services/endpoints";
import Modal from "@/components/custom/Modal";
import PaymentStatus from "./PaymentStatus";

const CheckPaymentStatus: React.FC = () => {
  const [stin, setStin] = useState("");
  const [paymentCode, setPaymentCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [checkLoader, setCheckLoader] = useState(false);
  const [isResetDisabled, setIsResetDisabled] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>({});
  const [paymentStatusModal, setPaymentStatusModal] = useState(false);

  const handlePaymentStatusCheck = async () => {
    if (!stin) {
      showToast("Please enter S-TIN", "error");
      return;
    }
    if (!paymentCode) {
      showToast("Please enter Payment Code", "error");
      return;
    }
    try {
      setCheckLoader(true);
      const model = {
        invoiceNo: stin,
        isVerificationPurpose: true,
      };
      const response = await apiCall.validateInvoiceNo(model);
      // const model = {
      //   invoiceNo: paymentCode,
      //   payerId: stin, 
      // };
      // const response = await apiCall.validateInvoiceNoPDMS(model);
      if (response.data.succeeded) {
        const data = response.data.data;
        setPaymentDetails(data);
        setPaymentStatusModal(true);
        showToast(response.data.message, "success");
      } else {
        showToast(response.data.message, "error");
      }
    } catch (error) {
      handleAPIError(error, true, true);
    } finally {
      setCheckLoader(false);
    }
  };

  const handleReset = () => {
    setStin("");
    setPaymentCode("");
    setPaymentDetails({});
    setIsVerified(false);
  };

  useEffect(() => {
    if (stin != "" || paymentCode != "") {
      setIsResetDisabled(false);
    } else {
      setIsResetDisabled(true);
    }
  }, [stin, paymentCode]);

  return (
    <div className="w-full min-h-16">
      <div className="flex flex-col gap-2">
        <div className="grid w-full items-center gap-1.5">
          <div className="flex flex-col gap-4 mt-4">
            <div className="w-full grid grid-cols-12 items-center gap-4">
              <div className="col-span-12 md:col-span-4">
                <TextBox
                  label="S-TIN"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                  disabled={isVerified}
                  placeholder="Enter S-TIN"
                  value={stin}
                  onChange={(e) => setStin(e.target.value)}
                />
              </div>
              <div className="col-span-12 md:col-span-5">
                <TextBox
                  label="Payment Code"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                  disabled={isVerified}
                  placeholder="Enter Payment Code"
                  value={paymentCode}
                  onChange={(e) => setPaymentCode(e.target.value)}
                />
              </div>
              <div className="col-span-12 md:col-span-3 flex gap-2">
                <Button
                  type="button"
                  onClick={handlePaymentStatusCheck}
                  disabled={isVerified}
                  loading={checkLoader}
                  className="flex-1"
                >
                  Check
                </Button>
                {!isResetDisabled && (
                  <Button
                    onClick={handleReset}
                    variant="secondary"
                    className="flex-1"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={paymentStatusModal}
        onClose={() => setPaymentStatusModal(false)}
        size="full"
        title="Payment Status"
        closeOnOutsideClick={false}
      >
        <PaymentStatus paymentDetails={paymentDetails} />
      </Modal>

    </div>
  );
};

export default CheckPaymentStatus;
