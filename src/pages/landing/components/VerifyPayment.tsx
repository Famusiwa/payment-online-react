import TextBox from "@/components/custom/TextBox";
import Button from "@/components/custom/Button";
import { useState } from "react";
import { showToast } from "@/lib/toast";
import { apiCall } from "@/services/endpoints";
import { base64UrlEncode, handleAPIError } from "@/lib/utils";
import { showAlert } from "@/lib/alert";

interface paymentVerificationData {
  payerName: string;
  payerAddress: string;
  amount: string;
  receiptNumber: string;
  ministry: string;
  description: string;
  bankName: string;
  branchName: string;
  paymentMode: string;
}

const VerifyPayment: React.FC = () => {
  const [receiptNo, setReceiptNo] = useState("");
  const [paymentData, setPaymentData] =
    useState<paymentVerificationData | null>(null);
  const [isResetDisabled, setIsResetDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (receiptNo.trim() === "") {
      showToast(`Kindly enter a valid Payment Ref. No. or Receipt No.!`, "error");
      return;
    }

    try {
      setLoading(true); // Start loading
      const response = await apiCall.getVerifyPayment(
        base64UrlEncode(receiptNo)
      ); // Call the API
      setLoading(false); // Stop loading

      if (response?.data?.data?.length > 0) {
        const apiData = response.data.data[0];
        const formattedData: paymentVerificationData = {
          payerName: apiData.payerName || "N/A",
          payerAddress: apiData.payerAddress || "N/A",
          amount: apiData.amountFormatted
            ? `₦${apiData.amountFormatted}`
            : "N/A",
          receiptNumber: apiData.receiptNo || "N/A",
          ministry: apiData.agencyName || "N/A",
          description: apiData.revenueName || "N/A",
          bankName: apiData.bankName || "N/A",
          branchName: apiData.branchName || "N/A",
          paymentMode: apiData.paymentMethodName || "N/A",
        };

        setPaymentData(formattedData); // Set the formatted data
        showToast(response?.data?.message || "Success", "success");
      } else {
        // Handle case where `data` is empty
        const formattedData: paymentVerificationData = {
          payerName: "No Data",
          payerAddress: "No Data",
          amount: "No Data",
          receiptNumber: "No Data",
          ministry: "No Data",
          description: "No Data",
          bankName: "No Data",
          branchName: "No Data",
          paymentMode: "No Data",
        };

        setPaymentData(formattedData);
        showAlert(response?.data?.message, "error", "Payment Not Found");
      }
    } catch (error: any) {
      setLoading(false);
      handleAPIError(error,true, true); 
      setPaymentData(null);
      
    }
  };

  const handleReset = () => {
    setReceiptNo("");
    setPaymentData(null);
    setIsResetDisabled(true);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setReceiptNo(value);
    setIsResetDisabled(value.trim() === "");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <TextBox
          id="receiptNo"
          value={receiptNo}
          onChange={handleTextChange}
          disabled={loading}
          placeholder="Enter Payment Ref. No. or Receipt No."
          className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm ${
            loading ? "bg-gray-300" : "focus:ring-primary focus:border-primary"
          }`}
        />

        <Button
          onClick={handleSubmit}
          loading={loading}
          variant="default"
          disabled={loading || !!paymentData} // Disable if loading or after submit
        >
          Verify
        </Button>
        {!isResetDisabled && (
          <Button
            onClick={handleReset}
            loading={false}
            variant="secondary"
            disabled={isResetDisabled}
          >
            Reset
          </Button>
        )}
      </div>
      {paymentData && (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-400 mt-6">
            <tbody>
              <tr>
                <th className="border border-gray-400 p-3 bg-gray-50 text-left">
                  Payer Name:
                </th>
                <td className="border border-gray-400 p-3">
                  {paymentData.payerName}
                </td>
              </tr>
              <tr>
                <th className="border border-gray-400 p-3 bg-gray-50 text-left">
                  Payer Address:
                </th>
                <td className="border border-gray-400 p-3">
                  {paymentData.payerAddress}
                </td>
              </tr>
              <tr>
                <th className="border border-gray-400 p-3 bg-gray-50 text-left">
                  Amount:
                </th>
                <td className="border border-gray-400 p-3">
                  {paymentData.amount}
                </td>
              </tr>
              <tr>
                <th className="border border-gray-400 p-3 bg-gray-50 text-left">
                  Receipt Number:
                </th>
                <td className="border border-gray-400 p-3">
                  {paymentData.receiptNumber}
                </td>
              </tr>
              <tr>
                <th className="border border-gray-400 p-3 bg-gray-50 text-left">
                  Ministry:
                </th>
                <td className="border border-gray-400 p-3">
                  {paymentData.ministry}
                </td>
              </tr>
              <tr>
                <th className="border border-gray-400 p-3 bg-gray-50 text-left">
                  Description:
                </th>
                <td className="border border-gray-400 p-3">
                  {paymentData.description}
                </td>
              </tr>
              <tr>
                <th className="border border-gray-400 p-3 bg-gray-50 text-left">
                  Bank Name:
                </th>
                <td className="border border-gray-400 p-3">
                  {paymentData.bankName}
                </td>
              </tr>
              <tr>
                <th className="border border-gray-400 p-3 bg-gray-50 text-left">
                  Branch Name:
                </th>
                <td className="border border-gray-400 p-3">
                  {paymentData.branchName}
                </td>
              </tr>
              <tr>
                <th className="border border-gray-400 p-3 bg-gray-50 text-left">
                  Payment Mode:
                </th>
                <td className="border border-gray-400 p-3">
                  {paymentData.paymentMode}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VerifyPayment;
