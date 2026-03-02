import { useState, useEffect } from "react";
import TextBox from "@/components/custom/TextBox";
import Button from "@/components/custom/Button";
import { useForm } from "react-hook-form";
import { showToast } from "@/lib/toast";
import { apiCall } from "@/services/endpoints";
import {
  assessmentRepositoryBaseUrl,
  merchantCode,
  paymentOnlineBaseUrl,
} from "@/lib/env";
import {
  constructDropdownOptions,
  handleAPIError,
  formatCurrency,
} from "@/lib/utils";
import Select, { SelectOption } from "@/components/custom/Select";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Modal from "@/components/custom/Modal";
import { showAlert, showConfirmation } from "@/lib/alert";

type paymentCodeData = {
  agencyId: number;
  revenueCode: string;
  amount: number;
  paymentPeriod: number;
};

const GeneratePaymentCode: React.FC = () => {
  const [searchPayerId, setSearchPayerId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isResetDisabled, setIsResetDisabled] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [agency, setAgency] = useState<SelectOption[]>([]);
  const [revenue, setRevenue] = useState<SelectOption[]>([]);
  const [revLoader, setRevLoader] = useState(false);
  const [showPaymentFields, setShowPaymentFields] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);
  const [payerDetails, setPayerDetails] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Modal state and invoice data
  const [showModal, setShowModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);

  const schema = Yup.object().shape({
    agencyId: Yup.number().required("Agency is required"),
    revenueCode: Yup.string().required("Revenue is required"),
    amount: Yup.number().required("Amount is required"),
    paymentPeriod: Yup.number().required("Payment Period is required"),
  });

  const { watch, register, reset, resetField } = useForm<paymentCodeData>({
    resolver: yupResolver(schema),
  });

  const agencyId = watch("agencyId");
  const revenueCode = watch("revenueCode");
  const amount = watch("amount");
  const paymentPeriod = watch("paymentPeriod");

  const handleAddEntry = () => {
    if (!agencyId) {
      showToast("Please select Agency before adding.", "error");
      return;
    }
    if (!revenueCode) {
      showToast("Please select Revenue before adding.", "error");
      return;
    }
    if (!amount) {
      showToast("Please enter Amount before adding.", "error");
      return;
    }
    if (!paymentPeriod) {
      showToast("Please enter Payment Period before adding.", "error");
      return;
    }

    const selectedAgency = agency.find((a) => a.value === agencyId);
    const selectedRevenue = revenue.find((r) => r.value === revenueCode);

    const newEntry = {
      agencyId,
      agencyName: selectedAgency?.label || "",
      revenueCode,
      revenueName: selectedRevenue?.label || "",
      amount,
      paymentPeriod,
    };

    setEntries((prev) => [...prev, newEntry]);
    resetField("amount");
    resetField("paymentPeriod");
    resetField("agencyId");
    resetField("revenueCode");
  };

  const handleReset = () => {
    setShowForm(false);
    setSearchPayerId("");
    setIsVerified(false);
    setIsResetDisabled(true);
    setAgency([]);
    setRevenue([]);
    reset();
    setEntries([]);
    setPayerDetails(null);
    setShowModal(false);
    setInvoiceData(null);
  };

  const fetchAgency = async () => {
    try {
      const response = await apiCall.getAgencies(merchantCode, true);
      if (response?.data?.data?.length > 0) {
        const agencyList = constructDropdownOptions(
          response?.data?.data,
          "agencyName",
          "agencyId"
        );
        setAgency(agencyList);
      }
    } catch (error) {
      handleAPIError(error);
    }
  };

  const fetchRevenue = async () => {
    try {
      setRevLoader(true);
      const response = await apiCall.getAllAgencyRevenue(agencyId, true);
      setRevLoader(false);
      if (response?.data?.data?.length > 0) {
        const revenueList = constructDropdownOptions(
          response?.data?.data,
          "revenueName",
          "revenueCode"
        );
        setRevenue(revenueList);
      }
    } catch (error) {
      setRevLoader(false);
      handleAPIError(error);
    }
  };

  const handleVerify = async () => {
    if (!searchPayerId) {
      showToast("Field cannot be empty.", "error");
      return;
    }

    try {
      setRevLoader(true);
      const response = await apiCall.getPayerIdDetails(searchPayerId);
      setRevLoader(false);
      if (response.data?.data) {
        setShowForm(true);
        setIsVerified(true);
        setPayerDetails(response.data.data);
        showToast(response.data.message, "success");
      } else {
        showAlert(response.data.message, "error");
        setIsVerified(false);
      }
    } catch (error) {
      setIsVerified(false);
      handleAPIError(error, true, true);
      setRevLoader(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchPayerId(value);
    setIsResetDisabled(value.trim() === "");
  };

  const handleGeneratePaymentCode = async () => {
    if (entries.length === 0) {
      showToast(
        "Please add at least one payment entry before generating.",
        "error"
      );
      return;
    }

    // const result = await Swal.fire({
    //   title: "Generate Payment Code?",
    //   text: "You are about to generate a payment code for Payment. Click Yes to proceed.",
    //   icon: "question",
    //   showCancelButton: true,
    //   confirmButtonColor: 'var(--color-primary)',
    //   cancelButtonColor: 'var(--color-secondary)',
    //   confirmButtonText: "Yes, Generate",
    //   cancelButtonText: "No",
    // });

    // if (!result.isConfirmed) {
    //   showToast("Generate payment code cancelled!", "info");
    //   return;
    // }

    showConfirmation(
      "You are about to generate a payment code for Payment. Click Yes to proceed.",
      "Generate Payment Code?"
    ).then(async (result: any) => {
      if (!result.confirmed) {
        showToast("Generate payment code cancelled!", "info");
        return;
      }

      setIsGenerating(true); // start loader

      try {
        const totalAmount = entries.reduce(
          (sum, entry) => sum + Number(entry.amount || 0),
          0
        );

        const payload = {
          payerId: payerDetails?.payerId || searchPayerId,
          payerName: payerDetails?.fullPayerName || "",
          payerEmail: payerDetails?.email || "",
          telephone: payerDetails?.telephoneNumber || "",
          address: payerDetails?.address || "",
          totalAmount,
          platformCode: merchantCode,
          generateInvoiceRequestDetails: entries.map((entry) => ({
            revenueCode: entry.revenueCode,
            revenueName: entry.revenueName,
            paymentPeriod: entry.paymentPeriod.toString(),
            itemAmount: entry.amount,
            itemPaymentCode: "DTSS",
          })),
        };

        const response = await apiCall.generateInvoiceNumber(payload);

        const data = response?.data?.data;
        if (data?.invoiceNo) {
          showToast(
            `Invoice Number: ${data.invoiceNo}. Payment code generated successfully, Expires After 48hrs if not paid.`,
            "success"
          );
          setInvoiceData({ ...data, entries: [...entries] });
          setShowModal(true);
        } else {
          showToast(
            "Payment code generated, but invoice number missing.",
            "warning"
          );
        }
      } catch (error) {
        handleAPIError(error);
      } finally {
        setIsGenerating(false); // stop loader
      }
    });
  };

  useEffect(() => {
    if (searchPayerId.length >= 10) {
      fetchAgency();
    }
  }, [searchPayerId]);

  useEffect(() => {
    if (agencyId) {
      setShowPaymentFields(true);
      fetchRevenue();
    } else {
      setShowPaymentFields(false);
    }
  }, [agencyId]);

  return (
    <div className="w-full min-h-16">
      <div className="flex flex-col gap-2">
        <div className="grid w-full items-center gap-1.5">
          <div className="flex flex-col gap-4 mt-4">
            <div className="w-full grid grid-cols-12 items-center gap-4">
              <div className="col-span-12 md:col-span-9">
                <TextBox
                  label="Payer ID"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                  disabled={isVerified}
                  placeholder="Enter Valid PayerId"
                  onChange={handleTextChange}
                  value={searchPayerId}
                />
              </div>
              <div className="col-span-12 md:col-span-3 flex gap-2">
                <Button
                  type="button"
                  onClick={handleVerify}
                  disabled={isVerified}
                  loading={revLoader}
                  className="flex-1"
                >
                  Verify
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

            {showForm && payerDetails && (
              <div className="w-full mt-3">
                <form className="w-full grid grid-cols-12 gap-4">
                  <div className="col-span-12 font-bold text-center">
                    <p>{payerDetails.fullPayerName?.toUpperCase()}</p>
                  </div>

                  <div className="col-span-12 items-center w-full">
                    <div className="grid grid-cols-12 w-full">
                      <label className="col-span-12 md:col-span-2 text-left md:text-right pr-3 text-base align-middle mt-2">
                        Address:
                      </label>
                      <div className="col-span-12 md:col-span-9 w-full ml-0 md:ml-6">
                        <TextBox
                          value={payerDetails.address}
                          onChange={(e) =>
                            setPayerDetails({
                              ...payerDetails,
                              address: e.target.value,
                            })
                          }
                          placeholder="Enter Address"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 grid grid-cols-2 gap-4">
                    <TextBox
                      label="Email"
                      type="email"
                      value={payerDetails.email}
                      placeholder="Enter Email"
                    />
                    <TextBox
                      label="Phone"
                      type="tel"
                      value={payerDetails.telephoneNumber}
                      placeholder="Enter Phone"
                    />
                  </div>

                  <div className="col-span-6">
                    <Select
                      label="Agency"
                      placeholder="Select Agency"
                      required
                      options={agency}
                      {...register("agencyId")}
                      value={agencyId}
                    />
                  </div>

                  <div className="col-span-6">
                    <Select
                      label="Revenue"
                      placeholder="Select Revenue"
                      required
                      options={revenue}
                      disabled={!agencyId}
                      loading={revLoader}
                      {...register("revenueCode")}
                      value={revenueCode}
                    />
                  </div>

                  {showPaymentFields && (
                    <div className="col-span-12 grid grid-cols-2 gap-4">
                      <TextBox
                        label="Amount"
                        type="number"
                        {...register("amount")}
                        required
                        placeholder="Enter amount"
                      />
                      <TextBox
                        label="Payment Period"
                        {...register("paymentPeriod")}
                        required
                        placeholder="Enter period"
                      />
                    </div>
                  )}

                  <div className="col-span-12 text-right">
                    <Button type="button" onClick={handleAddEntry}>
                      Add
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {entries.length > 0 && (
              <>
                <table className="min-w-full mt-4 text-left border">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="p-2 border">S/N</th>
                      <th className="p-2 border">Agency Name</th>
                      <th className="p-2 border">Revenue Type/Purpose</th>
                      <th className="p-2 border">Amount</th>
                      <th className="p-2 border">Period</th>
                      <th className="p-2 border">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2 border">{index + 1}</td>
                        <td className="p-2 border">{entry.agencyName}</td>
                        <td className="p-2 border">{entry.revenueName}</td>
                        <td className="p-2 border">
                          {formatCurrency(Number(entry.amount))}
                        </td>
                        <td className="p-2 border">{entry.paymentPeriod}</td>
                        <td className="p-2 border">
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setEntries(entries.filter((_, i) => i !== index));
                            }}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="text-right mt-4">
                  <Button
                    onClick={handleGeneratePaymentCode}
                    loading={isGenerating}
                  >
                    {isGenerating ? "Generating..." : "Generate Payment Code"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal for invoice preview */}
     {invoiceData && (
  <Modal
    isOpen={showModal}
    onClose={handleReset}
    title="Generate Payment Code For Payment Across All Payment Channels"
    size="xl"
    closeOnOutsideClick={false}
  >
    <div className="mb-4 text-center">
      <p><strong>Invoice Number:</strong> {invoiceData.invoiceNo}</p>
      <p><strong>Total Amount:</strong> {formatCurrency(Number(invoiceData.totalAmount))}</p>
    </div>

    {/* Only show table if invoiceDetailsResponse exists and has items */}
    {invoiceData.invoiceDetailsResponse && invoiceData.invoiceDetailsResponse.length > 0 && (
      <table className="w-full border-collapse border border-gray-300 mb-4 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">Revenue Code</th>
            <th className="border border-gray-300 p-2 text-right">Amount</th>
            <th className="border border-gray-300 p-2 text-right">Invoice No.</th>
            <th className="border border-gray-300 p-2 text-right">Payment</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.invoiceDetailsResponse.map((entry: any, idx: number) => (
            <tr key={idx}>
              <td className="border border-gray-300 p-2">{entry.revenueCode}</td>
              <td className="border border-gray-300 p-2 text-right">
                {formatCurrency(Number(entry.itemAmount))}
              </td>
              <td className="border border-gray-300 p-2 text-right">
                {entry.itemInvoiceNo}
              </td>
              <td className="border border-gray-300 p-2 text-right">
                <Button
                  variant="outline"
                  onClick={() => window.open(
                    `${paymentOnlineBaseUrl}${entry.itemPaymentLink}`,
                    "_blank",
                    "noopener,noreferrer"
                  )}
                >
                  Pay Online
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}

    {/* Show message if no invoice details */}
    {(!invoiceData.invoiceDetailsResponse || invoiceData.invoiceDetailsResponse.length === 0) && (
      <div className="text-center py-4 text-gray-500">
        No invoice details available
      </div>
    )}

    <div className="flex justify-end gap-3">
      <Button variant="default" onClick={handleReset}>Close</Button>
      {invoiceData.printInvoiceLink && (
        <a
          href={`${assessmentRepositoryBaseUrl}${invoiceData.printInvoiceLink}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        
              >
                <Button variant="secondary">Print Invoice</Button>
              </a>
            )}
            <Button onClick={handleReset} variant="outline">
              Get New Payment Code
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GeneratePaymentCode;
