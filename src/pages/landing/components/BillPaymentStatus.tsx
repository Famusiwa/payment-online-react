import { useMemo, useState } from "react";
import { showToast } from "@/lib/toast";
import { formatCurrency, handleAPIError } from "@/lib/utils";
import { apiCall } from "@/services/endpoints";
import Modal from "@/components/custom/Modal";
import PaymentStatus from "./PaymentStatus";
import Select from "@/components/custom/Select";
import DevExpressTable from "@/components/custom/DevExpressTable";
import Button from "@/components/custom/Button";

const BillPaymentStatus: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [taxYear, setTaxYear] = useState(String(currentYear));
  const [checkLoader, setCheckLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>({});
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [paymentStatusModal, setPaymentStatusModal] = useState(false);

  const taxYearOptions = Array.from(
    { length: currentYear - 2015 + 1 },
    (_, i) => {
      const year = currentYear - i;
      return { label: String(year), value: String(year) };
    }
  );

  const handlePaymentStatusCheck = async (rowData: any) => {
    try {
      setSelectedRow(rowData);
      setLoader(true);
      const data = rowData.data;
      const model = {
        invoiceNo: data.paymentCode,
        isVerificationPurpose: true,
      };
      const response = await apiCall.validateInvoiceNo(model);
      // const model = {
      //   invoiceNo: data.paymentCode,
      //   payerId: data.payerId,
      // };
      // const response = await apiCall.validateInvoiceNoPDMS(model);
      if (response.data.succeeded) {
        const data = response.data.data;
        setPaymentDetails(data);
        setPaymentStatusModal(true);
      } else {
        showToast(response.data.message, "error");
      }
    } catch (error) {
      handleAPIError(error, true, true);
    } finally {
      setLoader(false);
    }
  };

  const detailsDataSource = useMemo(() => {
    return {
      load: async (loadOptions: any) => {
        setCheckLoader(true);
        const payload = {
          loadOptions,
          taxYear: taxYear,
        };

        try {
          const response = await apiCall.getAssessmentPDMS(payload);
          return response.data || [];
        } catch (error) {
          handleAPIError(error);
          return { data: [], totalCount: 0 };
        } finally {
          setCheckLoader(false);
        }
      },
    };
  }, [taxYear]);

  return (
    <div className="w-full min-h-16">
      <div className="flex flex-col gap-2">
        <div className="grid w-full items-center gap-1.5">
          <div className="flex flex-col gap-4 mt-4">
            <div className="w-full grid grid-cols-12 items-center gap-4">
              <div className="col-span-12 md:col-span-10">
                <Select
                  label="Tax Year"
                  placeholder="Select Tax Year"
                  options={taxYearOptions}
                  loading={checkLoader}
                  value={taxYear}
                  onChange={(e) => setTaxYear(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="grid w-full">
          <div className="mt-4">
            <DevExpressTable
              columns={[
                { dataField: "payerName", caption: "Name" },
                { dataField: "payerId", caption: "S-TIN" },
                {
                  dataField: "totalAmount",
                  caption: "Assessed (₦)",
                  cellRender: (rowData: any) => {
                    return formatCurrency(rowData.data.totalAmount, false);
                  },
                },
                {
                  dataField: "amountPaid",
                  caption: "Paid (₦)",
                  cellRender: (rowData: any) => {
                    return formatCurrency(rowData.data.amountPaid, false);
                  },
                },
                {
                  dataField: "assessmentBalance",
                  caption: "Balance (₦)",
                  cellRender: (rowData: any) => {
                    return formatCurrency(
                      rowData.data.assessmentBalance,
                      false
                    );
                  },
                },
                {
                  dataField: "status",
                  caption: "Status",
                  allowFiltering: false,
                  allowSearch: false,
                  allowHeaderFiltering: false,
                  cellRender: (cellData: any) => {
                    const rawValue = cellData.data.status;

                    return (
                      <div className="flex justify-center">
                        <span
                          className={`text-xs badge text-white p-1 mt-1 whitespace-nowrap inline-block rounded-md ${
                            rawValue.toLowerCase() === "paid part"
                              ? "bg-yellow-300"
                              : rawValue.toLowerCase() === "fully paid"
                              ? "bg-primary-500"
                              : "bg-red-400"
                          }`}>
                          {rawValue}
                        </span>
                      </div>
                    );
                  },
                },
                {
                  dataField: "unPaidCount",
                  caption: "Unpaid",
                  allowFiltering: false,
                  allowSearch: false,
                  allowHeaderFiltering: false,
                  cellRender: (cellData: any) => {
                    const {unPaidCount, totalPaymentCount} = cellData.data;                    
                    return (
                      <div className="flex justify-center">
                        <span
                          className={`text-sm p-1 mt-1 whitespace-nowrap inline-block rounded-md`}>
                          {`${unPaidCount} of ${totalPaymentCount === 0 ? 1 : totalPaymentCount}`}
                        </span>
                      </div>
                    );
                  },
                },
                {
                dataField: "",
                caption: "View",
                allowFiltering: false,
                allowSearch: false,
                allowHeaderFiltering: false,
                width: 100,
                cellRender: (rowData: any) => {
                  return (
                    <div className="flex justify-center items-center space-x-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="default"
                        loading={
                          loader &&
                          selectedRow?.rowIndex === rowData?.rowIndex
                        }
                        onClick={() => handlePaymentStatusCheck(rowData)}>
                        Details
                      </Button>
                    </div>
                  );
                },
              },

              ]}
              dataSource={detailsDataSource}
            />
          </div>
        </div>
      </div>
      <Modal
        isOpen={paymentStatusModal}
        onClose={() => setPaymentStatusModal(false)}
        size="full"
        title="Payment Status"
        closeOnOutsideClick={false}
      >
        <PaymentStatus paymentDetails={paymentDetails} />
      </Modal>
    </div>
  );
};

export default BillPaymentStatus;
