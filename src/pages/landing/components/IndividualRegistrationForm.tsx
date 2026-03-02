import Select, { SelectOption } from "@/components/custom/Select";
import { useState, useEffect, useCallback, useMemo } from "react";
import TextBox from "@/components/custom/TextBox";
import Button from "@/components/custom/Button";
import { useForm, SubmitHandler } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { individualRegistrationFormData } from "@/lib/formData";
import { apiCall } from "@/services/endpoints";
import {
  constructDropdownOptions,
  handleAPIError,
  handleAPIErrorResponse,
} from "@/lib/utils";
import { showToast } from "@/lib/toast";
import { showAlert, showHtmlAlert } from "@/lib/alert";
import { individualJtbValidationTable, PLATFORM_CODE } from "@/lib/constants";
import DevExpressTable from "@/components/custom/DevExpressTable";

const individualRegistrationForm: React.FC<{
  states: SelectOption[];
  revenueOffices: SelectOption[];
  payerType: any;
  onSuccess?: () => void;
}> = ({ states, revenueOffices, payerType, onSuccess }) => {
  const [individualNo, setindividualNo] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [lgaLoader, setLGALoader] = useState(false);
  const [lgas, setLgas] = useState<SelectOption[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<
    SelectOption[]
  >([]);
  const [isResetDisabled, setIsResetDisabled] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [jtbtinNo, setJtbtinNo] = useState("");
  const [jtbtinLoader, setJtbtinLoader] = useState(false);
  const [jtbtinValidated, setJtbtinValidated] = useState(false);
  const [individualNoloader, setIndividualNoLoader] = useState(false);
  const [disableSearch, setDisableSearch] = useState(true);

  const schema = Yup.object().shape({
    title: Yup.string().required("Courtesy Title is required"),
    surname: Yup.string().required("Surname is required"),
    firstName: Yup.string().required("First Name is required"),
    genderId: Yup.string().required("Gender is required"),
    phoneNo: Yup.string().required("Phone No. is required"),
    ContactEmail: Yup.string().required("Email is required"),
    streetNo: Yup.string().required("Street No. is required"),
    streetName: Yup.string().required("Street Name is required"),
    cityName: Yup.string().required("City Name is required"),
    stateOfResidence: Yup.string().required("State of Residence is required"),
    lga: Yup.string().required("LGA is required"),
    revenueOfficeId: Yup.string().required("Nearest Tax Office is required"),
    regTypeCode: Yup.string().required("Payer Type is required"),
    dateOfBirth: Yup.string().required("Date of Birth is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<individualRegistrationFormData>({
    resolver: yupResolver(schema),
  });

  const sex = watch("genderId");
  const stateOfResidence = watch("stateOfResidence");
  const lga = watch("lga");
  const revenueOfficeId = watch("revenueOfficeId");
  const regTypeCode = watch("regTypeCode");

  const fetchLGAInfo = async () => {
    try {
      setLGALoader(true);
      const response = await apiCall.getLGALists(stateOfResidence);
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
    if (stateOfResidence) {
      fetchLGAInfo();
    }
  }, [stateOfResidence]);

  const handleJtbtinError = (error: any) => {
    // let responseData = error?.response?.data;
    let responseData =
      handleAPIErrorResponse(error?.response?.data) || error?.response?.data;

    // if(responseData?.error && responseData?.message){
    //   const parsed = JSON.parse(responseData.message);
    //   if( parsed?.message) {
    //     responseData.message = parsed.message;
    //     responseData.data = parsed.data;
    //   }
    // }

    const inputFirstName = watch("firstName");
    const inputLastName = watch("surname");
    const inputMiddleName = watch("otherName");

    if (responseData?.data != null) {
      const htmlTable = individualJtbValidationTable(
        {
          firstName: inputFirstName,
          lastName: inputLastName,
          middleName: inputMiddleName ?? "",
        },
        responseData.data,
        responseData.message
      );
      showHtmlAlert(htmlTable, "JTB Validation");
    }

    setJtbtinLoader(false);
    // handleAPIError(error);
  };

  const validateJtbtin = async (data: { jtb: string }) => {
    try {
      const payload = {
        jtb: data.jtb,
        payerType,
        firstName: watch("firstName"),
        lastName: watch("surname"),
        otherName: watch("otherName") || "",
      };

      setJtbtinLoader(true);
      const response = await apiCall.postValidateJtbtinIndividual(payload);
      if (response?.data?.succeeded === true) {
        const { first_Name, last_Name, middle_Name } =
          response.data?.data || {};

        setValue("firstName", first_Name || "");
        setValue("surname", last_Name || "");
        setValue("otherName", middle_Name || "");

        showToast(`Congratulations! ${response?.data?.message}`, "success");
        setJtbtinNo(data.jtb);
        setJtbtinValidated(true);
        setJtbtinLoader(false);
      }
    } catch (error: any) {
      setJtbtinValidated(false);
      handleJtbtinError(error);
      setJtbtinNo("");
      handleAPIError(error);
      setJtbtinLoader(false);
    }
  };

  const validateAndSearch = useCallback(async () => {
    if (individualNo.length !== 11) {
      showToast("Please enter a valid 11-digit phone number.", "error");
      setShowForm(false);
      return;
    }

    try {
      setIndividualNoLoader(true);
      const response = await apiCall.postSearchIndividualRecord({
        phoneNo: individualNo,
      });

      if (response?.data?.data !== null) {
        setShowForm(false);
        showAlert(response?.data?.message, "warning", "Notification!");
      } else {
        showToast(
          `No record matches your search for this phone number - ${individualNo}. Kindly request for a registration by filling the form below. Thank you.`,
          "info"
        );
        setShowForm(true);
      }

      setIndividualNoLoader(false);
    } catch (error: any) {
      handleAPIError(error);
      setIndividualNoLoader(false);
      setShowForm(false);
    }
  }, [individualNo]);

  // Click handler
  const handleSearchClick = useCallback(() => {
    validateAndSearch();
  }, [validateAndSearch]);

  // Key press handler
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      validateAndSearch();
    }
  };

  const handleCancel = useCallback(() => {
    setindividualNo("");
    setShowForm(false);
    setIsResetDisabled(true);
    setJtbtinNo("");
    setJtbtinValidated(false);
    reset();
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setindividualNo(value);
    setIsResetDisabled(value.trim() === "");
    if (value.trim().length === 11) {
      setDisableSearch(false);
    }
  };

  const handleJtbtinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setJtbtinNo(value);

    if (value.length === 10) {
      validateJtbtin({ jtb: value });
    }
  };

  const taxAgentsDataSource = useMemo(
    () => ({
      load: async (loadOptions: any) => {
        try {
          const response = await apiCall.getTaxAgents(loadOptions);
          return response.data || [];
        } catch (error) {
          return [];
        }
      },
    }),
    []
  );

  const onSubmit: SubmitHandler<individualRegistrationFormData> = async (
    data
  ) => {
    try {
      if (jtbtinNo !== "" && jtbtinNo.length < 10) {
        showToast(
          "Please enter a valid 10-digit JTB-TIN or leave field empty if JTB-TIN is unavailable.",
          "error"
        );
        return;
      }
      if (data.regTypeCode === "PA") {
        if (!selectedOrganization || selectedOrganization.length === 0) {
          showToast(
            "Please select an organization before submitting.",
            "error"
          );
          return;
        }

        if (selectedOrganization.length > 1) {
          showToast("Please select only one organization.", "error");
          return;
        }
        data.taxAgentReferenceNumber = (
          selectedOrganization[0] as any
        ).taxAgentReferenceNumber;
      } else {
        data.taxAgentReferenceNumber = "";
      }
      data.contactPhoneNo = individualNo;
      data.contactAddress = `${data.streetNo} ${data.streetName}, ${data.cityName}, ${data.stateOfResidence}`;
      data.platFormCode = PLATFORM_CODE;
      setSubmitting(true);
      const response = await apiCall.postIndividualRegistration(data);
      setSubmitting(false);
      if (response?.status === 200) {
        const message = response?.data?.message;
        showAlert(message, "success", "Successful!");
        onSuccess && onSuccess();
        setindividualNo("");
        setShowForm(false);
        setIsResetDisabled(true);
        setJtbtinNo("");
        setJtbtinValidated(false);
        reset();
      }
    } catch (error: any) {
      if (error?.status === 400 && error?.response?.data?.data === null) {
        showAlert(error?.response?.data?.message, "error", "Error!");
        setShowForm(false);
      }
      setSubmitting(false);
      handleAPIError(error);
      // setindividualNo("");
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      <h1 className="text-left text-lg font-semibold">Individual Details</h1>
      <div className="w-full items-center flex">
        <div className="w-full col-span-12 md:col-span-9">
          <TextBox
            value={individualNo}
            onChange={handleTextChange}
            onKeyDown={handleKeyPress}
            placeholder="Enter valid Phone No."
            disabled={showForm}
            suffixIcon="search"
            maxLength={11}
          />
        </div>
        <div className="col-span-3 ml-3">
          <Button
            onClick={handleSearchClick}
            loading={individualNoloader}
            disabled={disableSearch}>
            Search
          </Button>
        </div>
        <div className="col-span-6 md:col-span-2 ml-3">
          {!isResetDisabled && (
            <Button
              onClick={handleCancel}
              loading={false}
              variant="secondary"
              disabled={isResetDisabled}>
              Reset
            </Button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="w-full items-center mt-3 text-sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full grid grid-cols-1 gap-4">
              <TextBox
                label="Courtesy Title"
                {...register("title")}
                error={errors.title?.message}
                placeholder="Enter your title (Chief, Mr. Mrs.)"
                className="text-sm"
              />

              <TextBox
                label="Surname"
                {...register("surname")}
                error={errors.surname?.message}
                required
                disabled={jtbtinValidated}
                placeholder="Enter your surname"
                className="text-sm"
              />

              <TextBox
                label="First Name"
                {...register("firstName")}
                error={errors.firstName?.message}
                required
                disabled={jtbtinValidated}
                placeholder="Enter your first name"
                className="text-sm"
              />

              <TextBox
                label="Other Name"
                {...register("otherName")}
                error={errors.otherName?.message}
                disabled={jtbtinValidated}
                placeholder="Enter your other name"
                className="text-sm"
              />

              <TextBox
                label="Date of Birth"
                type="date"
                {...register("dateOfBirth")}
                error={errors.dateOfBirth?.message}
                required
                placeholder="mm/dd/yyyy"
                className="text-sm"
              />

              <Select
                label="Sex"
                placeholder="Click to Select Gender"
                error={errors.genderId?.message}
                required
                options={[
                  { value: 1, label: "Female" },
                  { value: 2, label: "Male" },
                ]}
                {...register("genderId")}
                value={sex}
              />

              <TextBox
                label="Phone No."
                {...register("phoneNo")}
                value={individualNo}
                error={errors.phoneNo?.message}
                required
                disabled
                placeholder="Enter your Phone No."
                className="text-sm"
              />

              <TextBox
                label="Email"
                {...register("ContactEmail")}
                error={errors.ContactEmail?.message}
                required
                placeholder="example@domain.com"
                className="text-sm"
              />

              <TextBox
                label="Street No."
                {...register("streetNo")}
                error={errors.streetNo?.message}
                required
                placeholder="Enter your your street no."
                className="text-sm"
              />

              <TextBox
                label="Street Name"
                {...register("streetName")}
                error={errors.streetName?.message}
                required
                placeholder="Enter your your street name"
                className="text-sm"
              />

              <TextBox
                label="City Name"
                {...register("cityName")}
                error={errors.cityName?.message}
                required
                placeholder="Enter your city name"
                className="text-sm"
              />

              <Select
                label="State of Residence"
                placeholder="Click to select state name"
                error={errors.stateOfResidence?.message}
                required
                options={states}
                {...register("stateOfResidence")}
                value={stateOfResidence}
              />

              <Select
                label="L.G.A"
                placeholder="Click here to select Lga name"
                error={errors.stateOfResidence?.message}
                required
                disabled={stateOfResidence ? false : true}
                loading={lgaLoader}
                options={lgas}
                {...register("lga")}
                value={lga}
              />

              <TextBox
                label="JTB-TIN"
                loading={jtbtinLoader}
                onChange={handleJtbtinChange}
                value={jtbtinNo}
                maxLength={10}
                disabled={jtbtinValidated}
                // {...register("jtbtin")}
                // error={errors.jtbtin?.message}
                placeholder="Enter your Joint Tax Board TIN"
                className="text-sm"
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

              <Select
                label="Payer Type"
                placeholder="Click to Select Payer Type"
                error={errors.regTypeCode?.message}
                required
                options={[
                  { value: "DA", label: "Self Employed" },
                  { value: "PA", label: "Employed" },
                  { value: "PEN", label: "Pensioner" },
                  { value: "ST", label: "Student" },
                ]}
                {...register("regTypeCode")}
                value={regTypeCode}
              />

              {regTypeCode === "PA" && (
                <div className="gap-4 w-full grid grid-cols-12">
                  <label className="mb-1 text-left col-span-12 md:col-span-12 self-end font-medium text-gray-600">
                    Organization Name
                    <span className="text-red-500">*</span>:
                  </label>

                  <div className="col-span-12 md:col-span-12">
                    <DevExpressTable
                      columns={[
                        {
                          dataField: "organizationName",
                          caption: "Business Name",
                        },
                      ]}
                      allowSelectionCheckboxes={true}
                      showSerialNumber={false}
                      selectedRowKeys={selectedOrganization}
                      dataSource={taxAgentsDataSource}
                      onSelectionChanged={(selectedRows) =>
                        setSelectedOrganization(selectedRows)
                      }
                      pageSize={10}
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                loading={submitting}>
                Register
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default individualRegistrationForm;
