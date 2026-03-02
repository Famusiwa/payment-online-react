import { payerTypes } from "@/lib/constants";
import Select from "@/components/custom/Select";
import { useState, useEffect } from "react";
import CoperateRegistrationForm from "./CoperateRegistrationForm";
import IndividualRegistrationForm from "./IndividualRegistrationForm";
import { apiCall } from "@/services/endpoints";
import { constructDropdownOptions, handleAPIError } from "@/lib/utils";

const PayerRegistrationForm: React.FC<{
  states?: any;
  setStates?: any;
  businessTypes?: any;
  setBusinessTypes?: any;
  revenueOffices?: any;
  setRevenueOffices?: any;
  businessOwnerships?: any;
  setBusinessOwnerships?: any;
}> = ({
  states,
  setStates,
  businessTypes,
  setBusinessTypes,
  revenueOffices,
  setRevenueOffices,
  businessOwnerships,
  setBusinessOwnerships,
}) => {
  const [payerType, setPayerType] = useState<number | undefined>(0);  

  const fetchStateInfo = async () => {
    try {
      const response = await apiCall.getStateLists();
      if (response?.data?.data?.length > 0) {
        const stateList = constructDropdownOptions(
          response?.data?.data,
          "stateName",
          "stateId"
        );
        setStates(stateList);
      }
    } catch (error) {
      handleAPIError(error);
    }
  };

  const fetchBusinessInfo = async () => {
    try {
      const response = await apiCall.getBusinessTypeLists();
      if (response?.data?.data?.length > 0) {
        const list = constructDropdownOptions(
          response?.data?.data,
          "businessTypeName",
          "businessTypeId"
        );
        setBusinessTypes(list);
      }
    } catch (error) {
      handleAPIError(error);
    }
  };

  const fetchRevenueOfficeInfo = async () => {
    try {
      const response = await apiCall.getRevenueOfficeLists();
      if (response?.data?.data?.length > 0) {
        const list = constructDropdownOptions(
          response?.data?.data,
          "revenueOfficeName",
          "revenueOfficeId"
        );
        setRevenueOffices(list);
      }
    } catch (error) {
      handleAPIError(error);
    }
  };

  const fetchBusinessOwnership = async () => {
    try {
      const response = await apiCall.getBusinessOwnerShipLists();
      if (response?.data?.data?.length > 0) {
        const list = constructDropdownOptions(
          response?.data?.data,
          "businessOwnshipName",
          "businessOwnshipID"
        );
        setBusinessOwnerships(list);
      }
    } catch (error) {
      handleAPIError(error);
    }
  };

  useEffect(() => {
    states.length === 0 && fetchStateInfo();
    businessTypes.length === 0 && fetchBusinessInfo();
    revenueOffices.length === 0 && fetchRevenueOfficeInfo();
    businessOwnerships.length === 0 && fetchBusinessOwnership();
  }, []);

  

  return (
    <div className="w-full min-h-16">
      <div className="flex flex-col gap-2">
        <div className="grid w-full items-center gap-1.5">
          <Select
            options={payerTypes}
            value={payerType}
            onChange={(e: any) => setPayerType(e.target.value)}
            placeholder="Click to select a payer type"
          />
        </div>
      </div>
      {payerType === 2 && (
        <CoperateRegistrationForm
          businessTypes={businessTypes}
          states={states}
          revenueOffices={revenueOffices}
          businessOwnerships={businessOwnerships}
          payerType={payerType}
          onSuccess={() => setPayerType(undefined)}
                />
      )}
      {payerType === 1 && (
        <IndividualRegistrationForm
          states={states}
          revenueOffices={revenueOffices}
          payerType={payerType}
          onSuccess={() => setPayerType(undefined)}
        />
      )}
    </div>
  );
};

export default PayerRegistrationForm;
