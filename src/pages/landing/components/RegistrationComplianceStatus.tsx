import { useState } from "react";
import TextBox from "@/components/custom/TextBox";
import Button from "@/components/custom/Button";
import { showToast } from "@/lib/toast";
import { apiCall } from "@/services/endpoints";
import { handleAPIError } from "@/lib/utils";

interface Props {
  onOpenTaxIdUpdate: () => void;
}

const RegistrationComplianceStatus: React.FC<Props> = ({
  onOpenTaxIdUpdate,
}) => {
  const [stin, setStin] = useState("");
  const [showStinRecords, setShowStinRecords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifiedStinRecords, setVerifiedStinRecords] = useState<any>({});

  const handleVerify = async () => {
    if (stin.trim() === "") {
      showToast("Field cannot be empty.", "error");
      setShowStinRecords(false);
      return;
    }
    if (stin.length < 10) {
      showToast("Invalid STIN format.", "error");
      return;
    }

    try {
      const model = {
        STIN: stin,
      };
      setLoading(true);
      const response = await apiCall.validateStinCompliance(model);

      if (response?.data?.succeeded === true && response?.data?.data) {
        setVerifiedStinRecords(response.data.data);
        setShowStinRecords(true);
      } else if (response?.data?.succeeded === false) {
        showToast(response.data?.message || "An error occurred.", "error");
      } else {
        showToast(response.data?.message || "An error occurred.", "error");
      }
    } catch (error: any) {
      handleAPIError(error);
    } finally {
      setLoading(false);
    }
  };

  const recordList = [
    { key: "taxId", label: "Tax ID" },
    { key: "email", label: "Email" },
    { key: "phoneNo", label: "Phone No." },
  ];

  const getRemark = (key: string, status: boolean) => {
    if (status) return "No Further Action Required";

    if (key === "taxId") {
      return (
        <Button
          id="openTaxIdUpdate"
          variant="link"
          className="text-blue-500"
          onClick={onOpenTaxIdUpdate}>
          Click here to update
        </Button>
      );
    }

    return "Update with employer or at the nearest tax office";
  };

  const getComplianceStatus = () => {
    const { taxId, email, phoneNo } = verifiedStinRecords || {};

    const values = [taxId, email, phoneNo];
    const trueCount = values.filter(Boolean).length;

    if (trueCount === 3) return "Compliant";
    if (trueCount === 0) return "Not Compliant";
    return "Missing Records - Partially Compliant";
  };

  const getComplianceIcon = () => {
    const status = getComplianceStatus();

    if (status === "Compliant")
      return (
        <span className="material-icons text-green-700 text-4xl align-middle mx-1">
          done_all
        </span>
      );

    if (status === "Missing Records - Partially Compliant")
      return (
        <span className="material-icons text-secondary-600 text-4xl align-middle mx-1">
          dangerous
        </span>
      );

    return (
      <span className="material-icons text-red-600 text-4xl align-middle mx-1">
        cancel
      </span>
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  const handleCancel = () => {
    setStin("");
    setShowStinRecords(false);
    setVerifiedStinRecords({});
  };

  return (
    <div className="w-full min-h-16 bg-white">
      <div className="flex flex-col gap-2">
        <div className="w-full items-center gap-1.5 flex flex-row">
          <div className="w-full col-span-12 md:col-span-9">
            <TextBox
              value={stin}
              onChange={(e) => setStin(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter STIN to search"
              disabled={showStinRecords || loading}
            />
          </div>
          <div className="col-span-3">
            <Button
              onClick={handleVerify}
              loading={loading}
              disabled={loading || showStinRecords}>
              Verify
            </Button>
          </div>
          {stin && (
            <div className="col-span-6 md:col-span-2">
              <Button
                onClick={handleCancel}
                loading={false}
                variant="secondary"
                className="w-full">
                Reset
              </Button>
            </div>
          )}
        </div>
        {showStinRecords && (
          <div className="text-left">
            <p className="text-center font-bold text-2xl mb-3 mt-3">
              Status: {getComplianceIcon()}
              {getComplianceStatus()}
            </p>

            <div className="mt-3 bg-white rounded-lg p-6">
              <div className="bg-white rounded-2xl p-6 shadow border-gray-300 border-2 mt-3">
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border-r border-gray-200 px-6 py-4 text-left font-semibold">
                          Record
                        </th>
                        <th className="border-r border-gray-200 px-6 py-4 text-left font-semibold w-28 sm:w-36 lg:w-44 whitespace-nowrap">
                          Status
                        </th>
                        <th className="border-r border-gray-200 px-6 py-4 text-left font-semibold">
                          Required Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recordList.map((item) => {
                        const status = verifiedStinRecords?.[item.key] ?? false;

                        return (
                          <tr
                            key={item.key}
                            className="text-left odd:bg-gray-100">
                            <td className="px-4 py-4 border-t border-gray-200 border-r">
                              {item.label}
                            </td>

                            <td className="px-4 py-4 border-t border-gray-200 border-r whitespace-nowrap w-28 sm:w-36 lg:w-44">
                              {status ? (
                                <>
                                  <span className="material-icons text-green-700 text-4xl align-middle mx-1">
                                    check
                                  </span>
                                  FOUND
                                </>
                              ) : (
                                <>
                                  <span className="material-icons text-red-700 text-4xl align-middle mx-1">
                                    close
                                  </span>
                                  NOT FOUND
                                </>
                              )}
                            </td>

                            <td className="px-6 py-4 border-t border-gray-200 border-r whitespace-normal">
                              {getRemark(item.key, status)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div
              className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 p-4"
              role="alert">
              <b>IMPORTANT NOTICE</b>: The items above are needed for payments,
              correspondences, notifications and alerts. If necessary, Kindly
              update with us as soon as possible
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationComplianceStatus;
