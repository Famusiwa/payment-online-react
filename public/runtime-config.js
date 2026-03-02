/**
 * Runtime Configuration File
 *
 * IMPORTANT: This file can be edited AFTER BUILD/DEPLOYMENT to change runtime values.
 * Simply edit this file on your server and reload the application - no rebuild needed!
 *
 * The values here will override the build-time environment variables.
 * If a value is not specified here, the build-time value will be used as fallback.
 *
 * For JSON values (arrays/objects), use valid JSON string format.
 */
window.__RUNTIME_CONFIG__ = {
  // API Base URLs
  VITE_BFF_Auth_BaseURL:
    "https://services.deltabir.com/Administrator/api/v1/Auth",
  VITE_BFF_Manager_BaseURL:
    "https://services.deltabir.com/Administrator/api/v1/Manager",
  VITE_PayerRegistration_BaseURL:
    "http://services.deltabir.com/PayerRegistrationService/api/v1/PayerRegistration/",
  VITE_Collection_BaseURL:
    "http://services.deltabir.com/PaymentCollectionsService/api/v1/PaymentCollections/",
  VITE_AssessmentRepository_BaseURL:
    "http://liveservices.deltabir.com/AssessmentRepositoryService",
  VITE_PaymentNormalization_BaseURL:
    "https://services.deltabir.com/PaymentNormalization",
  VITE_TaxSmartForTest_BaseURL: "https://srcs.deltabir.com/TaxSmartForTest",
  VITE_PaymentOnline_BaseURL: "http://payment.icmaservices.com",

  // Contact Information (JSON arrays)
  VITE_HomePage_Phone: ["+ (234) 90-539-641-20", "+ (234) 90-539-641-18"],
  VITE_HomePage_Email: ["solutions@deltairs.com"],
  VITE_HomePage_Address: [
    "Revenue House, 105 Airport Road,<br />",
    "Opposite Total Filling Station,<br />",
    "Warri Delta State",
  ],

  // UI Configuration
  VITE_Background_Image: "/src/assets/images/backgroundDelta.jpg",
  VITE_Logo_Image: "/src/assets/images/state-logo.png",
  VITE_Login_Text:
    "To generate optimum revenue for Delta State Government to enable it provide outstanding social services for the people",
  VITE_Homepage_Text:
    "Experience seamless tax management with our modern self-service platform. Fast, secure, and always available.",
  VITE_HomePage_BIR_Text: "Internal Revenue Service",
  VITE_Cookie_Text:
    "We use cookies to improve your experience. By using our site, you agree to our use of cookies.",

  // Feature Flags
  VITE_Data_Form_Submission_Required: "true",

  // Other Settings
  VITE_Merchant_Code: "DTSS",
  VITE_State_Name: "Delta State",
  VITE_Signatory_Signature:
    "https://liveservices.oyostatebir.com/AssessmentRepositoryService/stateimage/chairmanSignature.png",
  VITE_Signatory_Position: "Executive Chairman",
  VITE_Signatory_Name: "Rt. HON. SHERRIF OBOREVWORI",
  VITE_Toast_Timer: "10000",
};
