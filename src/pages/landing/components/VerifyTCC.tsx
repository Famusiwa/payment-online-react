import { useState, useEffect } from "react";
import TextBox from "@/components/custom/TextBox";
import Button from "@/components/custom/Button";
import { showToast } from "@/lib/toast";
import { apiCall } from "@/services/endpoints";
import { handleAPIError, formatCurrency } from "@/lib/utils";
import { assessmentRepositoryBaseUrl } from "@/lib/env";
import { isValidEmail } from "@/lib/utils";
import { showAlert } from "@/lib/alert";


type TccDetail = {
  name: string;
  utin: string;
  tccNo: string;
  taxYears: {
    year: string;
    income: string;
    tax: string;
    receipt: string;
  }[];
};

const VerifyTCC: React.FC = () => {
  const [tccNo, setTccNo] = useState("");
  const [showTcc, setShowTcc] = useState(false);
  const [verifyData, setVerifyData] = useState<any>({});
  const [tccDetail, setTccDetail] = useState<TccDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSendMail, setShowSendMail] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSenderName, setEmailSenderName] = useState("");
  const [loader2, setLoader2] = useState(false);
  const [sendMailName, setSendMailName] = useState("");

  const handleVerify = async () => {
    if (tccNo.trim() === "") {
      showToast("Field cannot be empty.", "error");
      setShowTcc(false);
      return;
    }
    let name = "N/A";
    let utin = "N/A";

    try {
      setLoading(true);
      const verifyResponse = await apiCall.getVerifyTCCDetails({
        payerId: tccNo,
      });
      if (verifyResponse?.data?.RecordResponseObject) {
        const verifyDataTemp = verifyResponse.data.RecordResponseObject;
        setVerifyData(verifyDataTemp);
        name = verifyDataTemp.PayerName || verifyDataTemp.Name || "N/A";
        utin = verifyDataTemp.Utin || verifyDataTemp.UTIN || "N/A";
      }
    } catch (error: any) {
      setLoading(false);
      handleAPIError(error);
    }

    try {
      setLoading(true);
      const response: any = await apiCall.getTCCDetails({ tccNo });
      setLoading(false);
      if (
        response?.data &&
        (response.data.tccNo ||
          response.data.TccNo ||
          (Array.isArray(response.data.taxYears) &&
            response.data.taxYears.length > 0) ||
          (Array.isArray(response.data.data) && response.data.data.length > 0))
      ) {
        const apiData = response.data;

        let taxYears: any[] = [];
        if (Array.isArray(apiData.taxYears)) {
          taxYears = apiData.taxYears;
        } else if (Array.isArray(apiData.data)) {
          taxYears = apiData.data;
        } else if (
          apiData.Income !== undefined ||
          apiData.ReceiptNo !== undefined ||
          apiData.Tax !== undefined ||
          apiData.Year !== undefined
        ) {
          taxYears = [apiData];
        }

        const formattedData: TccDetail = {
          name,
          utin,
          tccNo: apiData.tccNo || apiData.TccNo || tccNo,
          taxYears: taxYears.map((item: any) => ({
            year: item.Year?.toString() || item.year?.toString() || "N/A",
            income: item.Income?.toString() || item.income?.toString() || "N/A",
            tax: item.Tax?.toString() || item.tax?.toString() || "N/A",
            receipt: item.ReceiptNo || item.receiptNo || item.receipt || "N/A",
          })),
        };

        setEmailSenderName(formattedData.name);
        setTccDetail(formattedData);
        setShowTcc(true);
        showToast(apiData?.message || "TCC details found.", "success");
      } else {
        setShowTcc(false);
        setTccDetail(null);
        showAlert(response?.data?.message, "error", "TCC details not found.");
      }
    } catch (error: any) {
      setLoading(false);
      handleAPIError(error, true, true);
      setShowTcc(false);
      setTccDetail(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  const handleCancel = () => {
    setTccNo("");
    setShowTcc(false);
    setTccDetail(null);
    setShowSendMail(false);
  };

  const handleSendMailClick = async () => {
    if (!sendMailName?.trim()) {
      showToast("Recipient name is required.", "error");
      return;
    }
    if (!email) {
      showToast("Email is required.", "error");
      return;
    }
    if (!isValidEmail(email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    setLoader2(true);
    try {
      const senderName = sendMailName?.trim() || "User";
      const senderMail = email;
      const TccNo = tccDetail?.tccNo || tccNo;

      const model = { senderName, senderMail, TccNo };

      const response = await apiCall.sendTCCDetailsToMail(model);
      setLoader2(false);
      if (response?.data?.Status === true) {
        showAlert(
          response?.data?.StatusMessage ||
            "Request has been submitted and will be processed immediately",
          "success"
        );
        setShowSendMail(false);
        setEmail("");
        setSendMailName("");
      } else {
        showToast(response?.data?.message || "Failed to send mail.", "error");
      }
    } catch (error: any) {
      setLoader2(false);
      handleAPIError(error);
    }
  };

  useEffect(() => {
    if (tccDetail?.name) {
      setSendMailName(tccDetail.name);
    }
  }, [tccDetail]);

  return (
    <div className="w-full min-h-16 bg-white">
      <div className="flex flex-col gap-2">
        <div className="w-full items-center gap-1.5 flex flex-row">
          <div className="w-full col-span-12 md:col-span-9">
            <TextBox
              value={tccNo}
              onChange={(e) => setTccNo(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter TCC No. to search"
              disabled={showTcc || loading}
            />
          </div>
          <div className="col-span-3">
            <Button
              onClick={handleVerify}
              loading={loading}
              disabled={loading || showTcc} // <-- Disable when loading or details are displayed
            >
              Verify
            </Button>
          </div>
          {tccNo && (
            <div className="col-span-6 md:col-span-2">
              <Button
                onClick={handleCancel}
                loading={false}
                variant="secondary"
                className="w-full"
              >
                Reset
              </Button>
            </div>
          )}
        </div>
        {showTcc && tccDetail && (
          <div className="text-right">
            <p className="text-center font-bold text-2xl mb-3 mt-3">
              TCC Details
            </p>
            <div className="mt-3 bg-white rounded-lg p-6">
              <div className="grid grid-cols-2 gap-y-2 gap-x-8 mb-6">
                <div className="text-gray-600 font-medium text-left">Name</div>
                <div className="text-right font-semibold">{tccDetail.name}</div>
                <div className="text-gray-600 font-medium text-left">S-TIN</div>
                <div className="text-right font-semibold">{tccDetail.utin}</div>
                <div className="text-gray-600 font-medium text-left">
                  TCC No.
                </div>
                <div className="text-right font-semibold">
                  {tccDetail.tccNo}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow border border-gray-100 mt-3">
                <table className="table-auto w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border-r border-gray-200 px-6 py-4 text-left font-semibold">
                        Tax Year
                      </th>
                      <th className="border-r border-gray-200 px-6 py-4 text-left font-semibold">
                        Total Income (₦)
                      </th>
                      <th className="border-r border-gray-200 px-6 py-4 text-left font-semibold">
                        Tax Paid (₦)
                      </th>
                      <th className="px-6 py-4 text-left font-semibold">
                        Receipt Issued
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tccDetail.taxYears.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-4 text-center text-gray-400 border-t border-gray-200"
                        >
                          No tax year data available.
                        </td>
                      </tr>
                    ) : (
                      tccDetail.taxYears.map((item) => (
                        <tr
                          className="text-left"
                          key={item.year + item.receipt}
                        >
                          <td
                            className={`px-6 py-4 border-t border-gray-200 border-r`}
                          >
                            {item.year}
                          </td>
                          <td
                            className={`px-6 py-4 border-t border-gray-200 border-r text-right `}>
                            {formatCurrency(Number(item.income))}
                          </td>
                          <td
                            className={`px-6 py-4 border-t border-gray-200 border-r text-right`}>
                            {formatCurrency(Number(item.tax))}
                          </td>
                          <td className="px-6 py-4 border-t border-gray-200">
                            {item.receipt}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="gap-2 mt-5 flex flex-row justify-end">
              <Button onClick={() => setShowSendMail((prev) => !prev)}>
                {showSendMail ? "Close send mail" : "Send to mail"}
              </Button>
              <a
                href={`${assessmentRepositoryBaseUrl}/api/v1/Invoice/int/view-tcc-certificate?&P0dTUM4S=${verifyData.ItemKey}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button variant="secondary">View/Print Certificate</Button>
              </a>
            </div>
            {/* Show the send mail form if showSendMail is true */}
            {showSendMail && (
              <div className="mt-8 border rounded bg-white p-6">
                <div className="font-bold text-center mb-4">
                  Send Tax Certificate to Email Address
                </div>
                <div className="flex flex-col gap-4 items-center justify-center">
                  <div className="w-full max-w-md">
                    <div className="mb-1 text-left">Recipient Name</div>
                    <input
                      type="text"
                      value={sendMailName}
                      onChange={(e) => setSendMailName(e.target.value)}
                      className="border rounded px-4 py-2 bg-blue-50 w-full"
                    />
                  </div>
                  <div className="w-full max-w-md">
                    <div className="mb-1 text-left">Email Address</div>
                    <input
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border rounded px-4 py-2 bg-blue-50 w-full"
                    />
                  </div>
                  <Button
                    className="w-full max-w-md mt-2"
                    onClick={handleSendMailClick}
                    loading={loader2}
                  >
                    Send Mail
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyTCC;
