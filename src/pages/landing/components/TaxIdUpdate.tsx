import { useState } from "react";
import TextBox from "@/components/custom/TextBox";
import Button from "@/components/custom/Button";
import { showToast } from "@/lib/toast";
import { apiCall } from "@/services/endpoints";
import { handleAPIError } from "@/lib/utils";
import { showAlert } from "@/lib/alert";

const TaxIdUpdate: React.FC = () => {
  const [stin, setStin] = useState("");
  const [taxIdNo, setTaxIdNo] = useState("");
   const [loading, setLoading] = useState(false);

  const isSubmitDisabled =
  loading ||
  stin.trim().length < 10 ||
  taxIdNo.trim().length < 10;


  const handleSubmit = async () => {
    if (stin.trim() === "") {
      showToast("State TIN cannot be empty.", "error");
      return;
    }
    if (taxIdNo.trim() === "") {
      showToast("JRB Tax ID cannot be empty.", "error");
        return;
    }
    if (stin.length < 10) {
      showToast("Invalid STIN format.", "error");
      return;
    }

    try {
      const model = {
        sTin: stin,
        jtbTin: taxIdNo,
      };
      setLoading(true);
      const response = await apiCall.updateTaxID(model);

      if (response?.data?.succeeded || response?.data?.success) {
        showAlert(response.data?.message || "Tax ID updated successfully.", "success");
        setStin("");
        setTaxIdNo("");

      
      } else {
        showToast(response?.data?.message || "Failed to update Tax ID.", "error");
      }
    } catch (error: any) {
      handleAPIError(error, true, true);
    } finally {
      setLoading(false);
    }
  };



  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleCancel = () => {
    setStin("");
    setTaxIdNo("");

  };

  return (
    <div className="w-full min-h-16 bg-white">
      <div className="flex flex-col gap-2">

        <div className="w-full flex flex-col gap-3">
          <div className="w-full">
            <TextBox
            label="STIN"
              value={stin}
              required
              onChange={(e) => setStin(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter STIN to search"
              disabled={loading}
            />
          </div>

          <div className="w-full">
            <TextBox
            label="JRB Tax ID"
              value={taxIdNo}
              required
              onChange={(e) => setTaxIdNo(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter JRB Tax Id to search"
              disabled={ loading}
            />
          </div>
        </div>


        <div className="mt-4 flex items-center gap-3 justify-end">
          <Button
            onClick={handleSubmit}
            loading={loading}
            disabled={isSubmitDisabled}>
            Submit
          </Button>

          {(stin || taxIdNo) && (
            <Button
              onClick={handleCancel}
              variant="secondary">
              Reset
            </Button>
          )}
        </div>


      </div>
    </div>
  );
};

export default TaxIdUpdate;
