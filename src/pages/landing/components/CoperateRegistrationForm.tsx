import Select, { SelectOption } from "@/components/custom/Select";
import { useState, useEffect, useCallback } from "react";
import TextBox from "@/components/custom/TextBox";
import Button from "@/components/custom/Button";
import { useForm, SubmitHandler } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { coperateRegistrationFormData } from "@/lib/formData";
import { apiCall } from "@/services/endpoints";
import { constructDropdownOptions, handleAPIError, handleAPIErrorResponse } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import { corporateJtbValidationTable } from "@/lib/constants";
import { showAlert, showHtmlAlert } from "@/lib/alert";
import { merchantCode } from "@/lib/env";
import { CHANNEL_CODE, PLATFORM_CODE } from "@/lib/constants";

const CoperateRegistrationForm: React.FC<{
  states: SelectOption[];
  businessTypes: SelectOption[];
  revenueOffices: SelectOption[];
  businessOwnerships: SelectOption[];
  payerType: number;
  onSuccess?: () => void;
}> = ({
  states,
  businessTypes,
  revenueOffices,
  businessOwnerships,
  payerType,
  onSuccess,
}) => {
  const [coperateNo, setCoperateNo] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [lgaLoader, setLGALoader] = useState(false);
  const [formLoader, setFormLoader] = useState(false);
  const [coperateNoLoader, setCoperateNoLoader] = useState(false);
  const [lgas, setLgas] = useState<SelectOption[]>([]);
  const [jtbtinNo, setJtbtinNo] = useState("");
  const [jtbtinLoader, setJtbtinLoader] = useState(false);
  const [jtbtinValidated, setJtbtinValidated] = useState(false);

  const schema = Yup.object().shape({
    businessOwnershipID: Yup.number().required(
      "Business Ownership is required"
    ),
    businessTypeId: Yup.number().required("Business Type is required"),
    lgaId: Yup.number().required("LGA is required"),
    stateId: Yup.number().required("State is required"),
    companyAddress: Yup.string().required("Company Address is required"),
    operationalStateId: Yup.string().required("Company Town is required"),
    contactName: Yup.string().required("Contact Name is required"),
    contactPhoneNo: Yup.string()
      .matches(/^[0-9]+$/, "Contact Phone No must contain only numbers")
      .required("Contact Phone No is required"),
    companyName: Yup.string().required("Corporate Name is required"),
    revenueOfficeId: Yup.string().required("Revenue Office is required"),
    contactEmail: Yup.string()
      .email("Invalid email address")
      .required("Contact Email is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<coperateRegistrationFormData>({
    resolver: yupResolver(schema),
  });
  const stateId = watch("stateId");
  const lgaId = watch("lgaId");
  const businessTypeId = watch("businessTypeId");
  const businessOwnershipID = watch("businessOwnershipID");
  const revenueOfficeId = watch("revenueOfficeId");

  const fetchLGAInfo = async () => {
    try {
      setLGALoader(true);
      const response = await apiCall.getLGALists(stateId);
      setLGALoader(false);
      if (response?.data?.data?.length > 0) {
        const lgaList = constructDropdownOptions(
          response?.data?.data,
          "lgaName",
          "lgaId"
        );
        setLgas(lgaList);
      }
    } catch (error) {
      setLGALoader(false);
      handleAPIError(error);
    }
  };

  useEffect(() => {
    if (stateId) {
      fetchLGAInfo();
    }
  }, [stateId]);

  const handleJtbtinError = (error: any) => {
    const responseData =  handleAPIErrorResponse(error?.response?.data) || error?.response?.data;
    //     if(responseData?.error && responseData?.message){
    //   const parsed = JSON.parse(responseData.message);
    //   if( parsed?.message) {
    //     responseData.message = parsed.message;
    //     responseData.data = parsed.data;
    //   }
    // }

    const inputOrganisationName = watch("companyName");

    if (responseData?.data !== null) {
      const htmlTable = corporateJtbValidationTable(
        {
          organisationName: inputOrganisationName,
        },
        responseData.data,
        responseData.message
      );
      showHtmlAlert(htmlTable, "JTB Validation");
    }
    setJtbtinLoader(false);
  };

  const validateCorporateJtbtin = async (data: { jtb: string }) => {
    setJtbtinLoader(true);
    try {
      const payload = {
        jtb: data.jtb,
        payerType,
        organisationName: watch("companyName"),
      };

      const response = await apiCall.postValidateJtbtinCorporate(payload);

      if (response?.data?.succeeded === true) {
        showToast(`Congratulations! ${response?.data?.message}`, "success");
        setJtbtinNo(data.jtb);
        setJtbtinValidated(true);
        setJtbtinLoader(false);
      }
    } catch (error: any) {
      setJtbtinValidated(false);
      handleJtbtinError(error);
      handleAPIError(error);
      setJtbtinLoader(false);
    }
  };

  const validateAndSearch = useCallback(async () => {
    if (coperateNo.trim() === "") {
      showToast("Please enter a valid RC/CAC number.", "error");
      setShowForm(false);
      return;
    }

    try {
      setCoperateNoLoader(true);
      const response = await apiCall.postSearchCorporateRecord({
        RcNo: coperateNo,
      });

      if (response?.data?.data !== null) {
        setShowForm(false);
        showAlert(response?.data?.message, "warning", "Notification!");
        setCoperateNo("");
      } else {
        showToast(
          "No record matches your search, Kindly request for a registration by filling the form below. Thank you.",
          "info"
        );
        setShowForm(true);
      }

      setCoperateNoLoader(false);
    } catch (error: any) {
      handleAPIError(error);
      setCoperateNoLoader(false);
      setShowForm(false);
    }
  }, [coperateNo]);

  // Click handler
  const handleSearch = useCallback(() => {
    validateAndSearch();
  }, [validateAndSearch]);

  // Key press handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      validateAndSearch();
    }
  };

  const handleCancel = useCallback(() => {
    setCoperateNo("");
    setShowForm(false);
    setJtbtinNo("");
    setJtbtinValidated(false);
    reset();
  }, [reset]);

  const handleJtbtinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setJtbtinNo(value);

    if (value.length === 10) {
      validateCorporateJtbtin({ jtb: value });
    }
  };

  const onSubmit: SubmitHandler<coperateRegistrationFormData> = async (
    data
  ) => {
    try {
      if (jtbtinNo !== "" && jtbtinNo.length < 10) {
      showToast("Please enter a valid 10-digit JTB-TIN or leave field empty if JTB-TIN is unavailable.", "error");
      return
}
      setFormLoader(true);

      const registeragentparameters: any = {
        CompanyAddress: data.companyAddress,
        CompanyTown: data.operationalStateId,
        ContactPhoneNo: data.contactPhoneNo,
        ContactEmail: data.contactEmail,
        ContactName: data.contactName,
        jtbTin: jtbtinNo,
        BusinessTypeId: data.businessTypeId,
        BusinessOwnerShipID: data.businessOwnershipID,
        revenueOfficeId: data.revenueOfficeId,
        merchantCode: merchantCode,
        CorporateName: data.companyName,
        CACRegNumber: coperateNo,
        platFormCode: PLATFORM_CODE,
        StateId: data.stateId,
        lgaId: data.lgaId,
        updatePreviousRecord: false,
        channelCode: CHANNEL_CODE,
        designation: data.contactName,
        createdBy: data.companyName,
      };

      const response = await apiCall.postCoperateRegistrationForm(
        registeragentparameters
      );

      setFormLoader(false); // Set form loader to false after submission

      if (response?.status === 200) {
        const message = response?.data?.message;
        showAlert(message, "success", "Successful!");
        onSuccess && onSuccess();
        setCoperateNo("");
        setShowForm(false);
        setJtbtinNo("");
        setJtbtinValidated(false);
        reset(); // Reset all form fields to their default values
      }
    } catch (error: any) {
      if (error?.status === 400 && error?.response?.data?.data === null) {
        showAlert(error?.response?.data?.message, "error", "Error!");
        setShowForm(false);
        setCoperateNo("");
        reset();
      }
      setFormLoader(false);
      handleAPIError(error);
      setJtbtinNo("");
      setJtbtinValidated(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      <h1 className="text-left text-lg font-semibold">Corporate Details</h1>
      <div className="w-full items-center flex">
        <div className="w-full col-span-12 md:col-span-9">
          <TextBox
            value={coperateNo}
            onChange={(e) => setCoperateNo(e.target.value)}
            placeholder="Enter a valid RC/CAC. as written in your CAC Certificate"
            disabled={showForm}
            onKeyDown={handleKeyDown}
            suffixIcon="search"
          />
        </div>
        <div className="col-span-3  ml-3">
          <Button onClick={handleSearch} loading={coperateNoLoader}>
            Search
          </Button>
        </div>
        <div className="col-span-6 md:col-span-2 ml-3">
          {coperateNo && (
            <Button
              onClick={handleCancel}
              loading={false}
              variant="secondary"
              className="w-full">
              Reset
            </Button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="w-full items-center mt-3 text-sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full grid grid-cols-1 gap-4 ">
              <TextBox
                label="Incorporated/ Business Name"
                {...register("companyName")}
                error={errors.companyName?.message}
                required
                disabled={jtbtinValidated || formLoader}
                placeholder="Kindly enter Fullname"
                className="text-sm "
              />

              <Select
                label="Operational State"
                placeholder="Click to select state"
                error={errors.stateId?.message}
                required
                options={states}
                {...register("stateId")}
                value={stateId}
              />

              <Select
                label="Operational LGA"
                placeholder="Click to select LGA"
                error={errors.lgaId?.message}
                required
                disabled={stateId ? false : true}
                loading={lgaLoader}
                options={lgas}
                {...register("lgaId")}
                value={lgaId}
              />

              <TextBox
                label="Address"
                {...register("companyAddress")}
                error={errors.companyAddress?.message}
                required
                placeholder="Enter company's address"
                disabled={formLoader}
                className="text-sm"
              />

              <Select
                label="Business Sector"
                placeholder="Click to select business sector"
                error={errors.businessTypeId?.message}
                required
                options={businessTypes}
                {...register("businessTypeId")}
                value={businessTypeId}
              />

              <Select
                label="Business OwnerShip"
                placeholder="Click to select business ownership"
                error={errors.businessOwnershipID?.message}
                required
                options={businessOwnerships}
                {...register("businessOwnershipID")}
                value={businessOwnershipID}
              />

              <TextBox
                label="Town"
                {...register("operationalStateId")}
                error={errors.operationalStateId?.message}
                required
                placeholder="Enter company's town"
                disabled={formLoader}
                className="text-sm"
              />

              <TextBox label="Rc No." disabled value={coperateNo} />

              <TextBox
                label="Contact Name"
                {...register("contactName")}
                error={errors.contactName?.message}
                required
                placeholder="Enter contact person's name"
                className="text-sm"
                disabled={formLoader}
              />

              <TextBox
                label="Contact Phone No."
                {...register("contactPhoneNo")}
                error={errors.contactPhoneNo?.message}
                required
                placeholder="Enter contact person's phone no"
                className="text-sm"
                maxLength={11}
                disabled={formLoader}
              />

              <TextBox
                label="Contact Email"
                {...register("contactEmail")}
                error={errors.contactEmail?.message}
                required
                placeholder="Enter contact person's email"
                className="text-sm"
                disabled={formLoader}
              />

              <Select
                label="Nearest Tax Office "
                placeholder="Click to select revenue office"
                error={errors.revenueOfficeId?.message}
                required
                options={revenueOffices}
                {...register("revenueOfficeId")}
                value={revenueOfficeId}
              />

              <TextBox
                label="JTB-TIN"
                loading={jtbtinLoader}
                value={jtbtinNo}
                onChange={handleJtbtinChange}
                disabled={jtbtinValidated || formLoader}
                placeholder="Enter your Joint Tax Board TIN"
                className="text-sm"
              />

              <Button type="submit" loading={formLoader}>
                Register
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CoperateRegistrationForm;
