import {
  base64UrlEncode,
  formatCurrency,
  formatDate,
} from "@/lib/utils";
import { Link } from "react-router-dom";
import { homePageContactEmails, homePageContactNumbers, logoImage, paymentOnlineBaseUrl, signatoryName, signatoryPosition, signatorySignature, stateName } from "@/lib/env";
import { QRCodeCanvas } from "qrcode.react";

type props = {
  paymentDetails: any;
}

const PaymentStatus: React.FC<props> = ({paymentDetails}) => {
  console.log("paymentDetails", paymentDetails);
  const isFullyPaid = paymentDetails?.assessmentBalance === 0;
  const verificationLink = `${window.location.origin}?payerId=${paymentDetails?.payerId}&paymentCode=${paymentDetails?.paymentCode&&paymentDetails?.paymentCode}`;  
  const paymentLink = `${paymentOnlineBaseUrl}/?&ref=${base64UrlEncode(paymentDetails?.paymentCode)}&id=1`
  const qrcodeValue = isFullyPaid ? verificationLink : paymentLink;
  console.log('qrcodeValue', qrcodeValue);
  return (
    <div className="w-full min-h-16">
      <div className="flex flex-col gap-2">
        <div className="grid w-full items-center gap-1.5">
          <div className="flex flex-col gap-4 mt-4">
            {Object.keys(paymentDetails).length > 0 ? (
              <>
                <div>
                  <div className="w-full flex flex-col text-center border-b-2 border-b-primary mb-3 pb-2">
                    <img src={`${logoImage}`} className="relative w-32 m-auto" />
                    <h2 className="text-2xl font-semibold m-auto">
                      {stateName} Payment & Data Management System
                    </h2>
                    <p>{ isFullyPaid ? "Bill Payment Clearance" : " Bill Status Confirmation"}</p>
                  </div>

                  <div className="w-full grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-6">
                      <div className="">
                        <h3 className="text-[1.17em] text-primary font-medium mt-4 mb-2 border-b border-b-solid border-b-[#ddd]">
                          Payer Details
                        </h3>
                      </div>
                      <div>
                        <div className="mt-1 text-[1em]">
                          <p>
                            <strong>Name:</strong>{" "}
                            {paymentDetails?.payerName || " "}
                          </p>
                        </div>
                        <div className="mt-1">
                          <p>
                            <strong>Address:</strong>{" "}
                            {paymentDetails?.address || " "}
                          </p>
                        </div>
                        <div className="mt-1">
                          <p>
                            <strong>Assessment Year:</strong>{" "}
                            {paymentDetails?.assessedYear || " "}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <div className="">
                        <h3 className="text-[1.17em] text-primary font-medium mt-4 mb-2 border-b border-b-solid border-b-[#ddd]">
                          Payment Control Details
                        </h3>
                      </div>
                      <div>
                        <div className="mt-1">
                          <p>
                            <strong>Assessment Date:</strong>{" "}
                            {formatDate(paymentDetails?.dateAssessed)}
                          </p>
                        </div>
                        <div className="mt-1">
                          <p>
                            <strong>S-TIN:</strong>{" "}
                            {paymentDetails?.payerId || " "}
                          </p>
                        </div>
                        <div className="mt-1">
                          <p>
                            <strong>Payment Code:</strong>{" "}
                            {isFullyPaid ?
                            paymentDetails?.paymentCode
                            :
                            <Link
                              to={paymentLink}
                              target="_blank"
                              className="text-blue-600 underline"
                            >
                              {paymentDetails?.paymentCode}
                            </Link>
                          } 
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full text-[0.9em] p-3 my-3 bg-primary-100 border-l-4 border-l-solid border-l-primary rounded-md">
                    Please find below the status of Bill Payments Details as at {" "} 
                    <strong>{formatDate(new Date().toLocaleString())}</strong>:
                  </div>

                  {paymentDetails?.invoiceDetailsResponse?.length > 0 && (
                    <>
                      <table className="min-w-full text-[1em] text-left border-collapse border-gray-300 rounded-md">
                        <thead className="text-white bg-primary font-[200]">
                          <tr>
                            <th className="p-2 border">S/N</th>
                            <th className="p-2 border">Agency Name</th>
                            <th className="p-2 border">Assessed (₦)</th>
                            <th className="p-2 border">Paid (₦)</th>
                            <th className="p-2 border">Balance (₦)</th>
                            <th className="p-2 border">Payment Code</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentDetails?.invoiceDetailsResponse.map(
                            (entry: any, index: number) => (
                              <tr key={index} className="border-t">
                                <td className="p-2 border">{index + 1}</td>
                                <td className="p-2 border">
                                  {entry.agencyName}
                                </td>
                                <td className="p-2 border">
                                  {formatCurrency(entry.itemAmount, false)}
                                </td>
                                <td className="p-2 border">
                                  {formatCurrency(entry.amountPaid, false)}
                                </td>
                                <td className="p-2 border">
                                  {formatCurrency(
                                    Number(entry.itemAmount - entry.amountPaid),
                                    false
                                  )}
                                </td>
                                <td className="p-2 border">
                                  {isFullyPaid ?
                                      entry.itemPaymentCode
                                      : 
                                      <Link
                                        to={`${paymentOnlineBaseUrl}/?&ref=${base64UrlEncode(
                                          entry.itemPaymentCode
                                        )}&id=1`}
                                        target="_blank"
                                        className="text-blue-600 underline"
                                      >
                                        {entry.itemPaymentCode}
                                      </Link>
                                  }
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                        <tfoot>
                          <tr className="font-bold bg-primary-100">
                            <td className="p-2 border text-right" colSpan={2}>
                              Total
                            </td>
                            <td className="p-2 border">
                              {formatCurrency(
                                paymentDetails?.totalAmount
                              )}
                            </td>
                            <td className="p-2 border">
                              {formatCurrency(
                                paymentDetails?.amountPaid
                              )}
                            </td>
                            <td className="p-2 border">
                              {formatCurrency(
                                paymentDetails?.assessmentBalance
                              )}
                            </td>
                            <td className="p-2 border">{" "}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </>
                  )}

                  <p className="mt-2">
                    <strong>Payment Status:</strong>   
                    {isFullyPaid
                      ? " Fully Payment received for the bill."
                      : ` ${formatCurrency(paymentDetails?.assessmentBalance)} yet to be paid.`}
                  </p>

                  <p className="mt-2">
                    {isFullyPaid
                      ? " The above bill has been fully paid, and the payer is officially cleared of all debts associated with this bill"
                      : " To pay for items, click the respective Code. To pay the total, click on the Total code or scan the QR Code below."}                    
                  </p>

                  <p className="mt-2">
                    {isFullyPaid
                      ? ` To verify the authenticity of the payments, scan the QR code below or visit the IRS Self-Service Portal at [State’s Self-Service Portal URL].`
                      :  <span>You can also visit <Link to={paymentOnlineBaseUrl} target="_blank" className="text-blue-600 underline">{paymentOnlineBaseUrl}</Link> to make payments using the Codes.</span>}                    
                  </p>

                  <p className="mt-2">
                    {isFullyPaid
                      ? <span>For enquiries, please call {homePageContactNumbers.join(", ")} or send an email to {homePageContactEmails.join(", ")}, quoting the above Payment Control Details.</span>
                      :  <span>For enquiries, please call {homePageContactNumbers.join(", ")} or send an email to {homePageContactEmails.join(", ")}, quoting the above Payment Control Details.</span>}                    
                  </p>

                  <p className="mt-2">
                    Thank you.
                  </p>

                  {isFullyPaid ?
                    <div className="w-full grid grid-cols-12 gap-4 mt-4">
                      <div className="col-span-12 md:col-span-6">
                        <img
                          src={signatorySignature}
                          alt="Signature"
                          className="w-52 h-24 object-contain"
                        />
                        <p className="mt-2">{signatoryName}</p>
                        <p className="mt-2">{signatoryPosition}</p>
                        <p className="mt-2">{`${stateName} Government Internal Revenue`}</p>
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <div className="flex flex-col items-end gap-0">
                          <QRCodeCanvas
                            value={qrcodeValue}
                            size={200}
                            bgColor="#ffffff"
                            fgColor="#000000"
                            level="H" 
                            marginSize={5} 
                          />
                          <p className="mt-[-20px]">Scan to verify payment</p>
                        </div>                        
                      </div>
                    </div>
                    : 
                    <div className="w-full flex mt-4">
                        <div className="flex flex-col items-end gap-0 m-auto">
                          <QRCodeCanvas
                            value={qrcodeValue}
                            size={200}
                            bgColor="#ffffff"
                            fgColor="#000000"
                            level="H" 
                            marginSize={5} 
                          />
                          <p className="mt-[-20px]">Scan to make payment</p>
                        </div>                        
                    </div>
                  }             
                </div>
              </>
            ) : 
            <h3 className="m-auto text-center">No Record to Display</h3>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;
