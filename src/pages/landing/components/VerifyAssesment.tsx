import React, { useState } from "react";
import Button from "../../../components/custom/Button";
import TextBox from "@/components/custom/TextBox";
import { showToast } from "@/lib/toast";
import { apiCall } from "@/services/endpoints";
import { formatCurrency, handleAPIError } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

interface InvoiceDetails {
  assessmentRefNo: string;
  payerName: string;
  payerId: string;
  address: string;
  assessedPeriod: string;
  amountPaid: string;
  assessmentBalance: string;
  agencyName: string;
  narration: string;
  assessedYear?: string;
  dateAssessed: string;
  revenueName: string;
  totalAmount: number;
  invoiceDetailsResponse: Array<{
    itemAmount: number;
    narration: string;
  }>;
}

interface VerifyAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VerifyAssessmentModal: React.FC<VerifyAssessmentModalProps> = () => {
  const [searchInvoiceId, setSearchInvoiceId] = useState("");
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails | null>(
    null
  );
  const [isVerified, setIsVerified] = useState(false);
  const [isResetDisabled, setIsResetDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (searchInvoiceId.trim() === "") return;

    setLoading(true);

    try {
      const model = {
        invoiceNo: searchInvoiceId,
        isVerificationPurpose: true,
      };
      const response = await apiCall.validateInvoiceNo(model);
      setLoading(false);
      if (response.data.succeeded) {
        const data: InvoiceDetails = response.data.data;
        showToast(response.data.message, "success");
        setInvoiceDetails(data);
        setIsVerified(true);
      } else {
        showToast(response.data.message, "error");
      }
    } catch (error) {
      setLoading(false);
      handleAPIError(error);
    }
  };

  const handleCancel = () => {
    setSearchInvoiceId("");
    setInvoiceDetails(null);
    setIsVerified(false);
    setIsResetDisabled(true);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInvoiceId(value);
    setIsResetDisabled(value.trim() === "");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <TextBox
          type="text"
          id="invoiceId"
          value={searchInvoiceId}
          onChange={handleTextChange}
          placeholder="Enter Invoice Number to Search"
          disabled={isVerified}
          className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm ${
            isVerified
              ? "bg-gray-300"
              : "focus:ring-primary focus:border-primary"
          }`}
        />

        <Button
          type="button"
          onClick={handleVerify}
          variant="default"
          size="default"
          disabled={isVerified || loading}
          loading={loading}
        >
          Verify
        </Button>

        {!isResetDisabled && (
          <Button
            type="button"
            onClick={handleCancel}
            loading={false}
            variant="secondary"
            size="default"
            disabled={isResetDisabled}
          >
            Reset
          </Button>
        )}
      </div>

      {invoiceDetails && (
        <div>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Category
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">Invoice Number</td>
                <td className="border px-4 py-2">
                  {invoiceDetails.assessmentRefNo}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Payer Name</td>
                <td className="border px-4 py-2">{invoiceDetails.payerName}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Payer ID</td>
                <td className="border px-4 py-2">{invoiceDetails.payerId}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Payer Address</td>
                <td className="border px-4 py-2">{invoiceDetails.address}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Invoice Amount</td>
                <td className="border px-4 py-2">
                  {formatCurrency(invoiceDetails.totalAmount)}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Amount Paid</td>
                <td className="border px-4 py-2">
                  {formatCurrency(invoiceDetails.amountPaid)}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Balance</td>
                <td className="border px-4 py-2">
                  {formatCurrency(invoiceDetails.assessmentBalance)}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Ministry</td>
                <td className="border px-4 py-2">
                  {invoiceDetails.agencyName}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Description</td>
                <td className="border px-4 py-2">{invoiceDetails.narration}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Assessed Period/Year</td>
                <td className="border px-4 py-2">
                  {invoiceDetails.assessedYear}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Assessed Date</td>
                <td className="border px-4 py-2">
                  {formatDate(invoiceDetails.dateAssessed)}
                </td>
              </tr>
            </tbody>
          </table>
          {invoiceDetails.invoiceDetailsResponse &&
            invoiceDetails.invoiceDetailsResponse.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Details</h3>
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Revenue Name
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceDetails.invoiceDetailsResponse.map(
                      (item, index) => (
                        <tr key={index}>
                          <td className="border px-4 py-2">{item.narration}</td>
                          <td className="border px-4 py-2">
                            {formatCurrency(item.itemAmount)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default VerifyAssessmentModal;
