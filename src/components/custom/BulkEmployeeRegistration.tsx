import React, { useRef, useState } from "react";
import Button from "@/components/custom/Button";
import { apiCall } from "@/services/endpoints";
import { handleAPIError } from "@/lib/utils";
import { showAlert, showConfirmation } from "@/lib/alert";
import { showToast } from "@/lib/toast";

interface Props {
  payerUtin?: string;
  onSuccess?: () => void;
}

const BulkEmployeeRegistration: React.FC<Props> = ({
  payerUtin,
  onSuccess,
}) => {
  const [regFile, setRegFile] = useState<File | null>(null);
  const [regFileName, setRegFileName] = useState("");
  const [regLoader, setRegLoader] = useState(false);
  const regFileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setRegFile(null);
    setRegFileName("");
    if (regFileInputRef.current) {
      regFileInputRef.current.value = "";
    }
  };

  const handleRegFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isExcel = file.name.endsWith(".xls") || file.name.endsWith(".xlsx");
    if (!isExcel) {
      showToast("Only Excel files (.xls, .xlsx) are allowed.", "error");
      e.target.value = "";
      return;
    }

    setRegFile(file);
    setRegFileName(file.name);
  };

  const handleSubmit = async () => {
    if (!regFile) {
      showToast("Please select a file to upload.", "error");
      return;
    }

    const confirmation = await showConfirmation(
      "You are about to upload employee registration information. Please confirm.",
      "Confirm Submission",
      "Yes, Upload",
      "Cancel"
    );

    if (!confirmation.confirmed) {
      showToast("Your action has been cancelled.", "info");
      return;
    }

    try {
      setRegLoader(true);

      const fd = new FormData();
      fd.append("file", regFile);
      fd.append("description", "Employee registration");

      const headers = {
        registerPayerParameters: JSON.stringify({ PayerUtin: payerUtin }),
        registerPayerUtin: JSON.stringify(payerUtin),
      };

      const response = await apiCall.postProcessImportedEmployeeRegistration(
        fd,
        headers
      );


      if (response?.data?.isSuccessful) {
        showAlert(response.data.statusMessage, "success");
        onSuccess?.();
        resetState();
      } else {
        showAlert(response.data?.statusMessage ||response?.data|| "Upload failed", "error");
      }
    } catch (error) {
      handleAPIError(error, true, true);
    } finally {
      setRegLoader(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Attach File{" "}
          <span className="text-red-600">
            (Only Excel files: .xls, .xlsx)
          </span>
        </label>

        <div className="flex">
          <input
            type="text"
            value={regFileName}
            readOnly
            className="flex-1 border border-gray-300 rounded-l px-3 py-2 bg-gray-100"
            placeholder="No file selected"
          />

          <Button
            type="button"
            onClick={() => regFileInputRef.current?.click()}
          >
            {regFileName ? "Change File" : "Select File"}
          </Button>

          {regFileName && (
            <Button
              type="button"
              variant="secondary"
              className="ml-1 bg-red-600"
              onClick={resetState}
            >
              Remove
            </Button>
          )}
        </div>

        <input
          type="file"
          accept=".xls,.xlsx"
          ref={regFileInputRef}
          onChange={handleRegFileChange}
          className="hidden"
        />
      </div>

      <div className="flex justify-center">
        <Button loading={regLoader} onClick={handleSubmit}>
          Upload File
        </Button>
      </div>
    </div>
  );
};

export default BulkEmployeeRegistration;
