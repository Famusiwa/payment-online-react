/**
 * Runtime-aware Environment Configuration
 *
 * This module prefers values from window.__RUNTIME_CONFIG__ (loaded from /public/runtime-config.js)
 * over build-time import.meta.env values. This allows you to edit runtime-config.js on the server
 * after deployment without rebuilding the application.
 *
 * To change values after deployment:
 * 1. Edit /public/runtime-config.js on your server
 * 2. Reload the application - changes take effect immediately
 */

// TypeScript declaration for runtime config
declare global {
  interface Window {
    __RUNTIME_CONFIG__?: Record<string, string>;
  }
}

// Get runtime config object (from public/runtime-config.js)
const runtime =
  (typeof window !== "undefined" && window.__RUNTIME_CONFIG__) || {};

/**
 * Get a string value from runtime config or fall back to build-time env
 */
function getString(key: string, fallback = ""): string {
  const runtimeValue = runtime[key];
  if (runtimeValue !== undefined && runtimeValue !== "") return runtimeValue;
  // @ts-ignore
  return import.meta.env[key] ?? fallback;
}

/**
 * Parse a JSON value from runtime config or fall back to build-time env
 */
function getJson<T = any>(key: string, fallback?: T): T {
  const value = getString(key);
  if (!value) return (fallback ?? (Array.isArray(fallback) ? [] : {})) as T;
  try {
    return value as T;
  } catch (error) {
    console.warn(`Failed to parse JSON for ${key}:`, error);
    return (fallback ?? (Array.isArray(fallback) ? [] : {})) as T;
  }
}

/**
 * Get a boolean value from runtime config or fall back to build-time env
 */
function getBool(key: string, fallback = false): boolean {
  const value = getString(key);
  if (!value) return fallback;
  return value.toLowerCase() === "true";
}

/**
 * Get an integer value from runtime config or fall back to build-time env
 */
function getInt(key: string, fallback = 0): number {
  const value = getString(key);
  if (!value) return fallback;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
}

// Export all configuration values
export const baseUrl =
  getString("VITE_Application_BaseURL") ||
  import.meta.env.VITE_Application_BaseURL;
export const BffAuthBaseUrl =
  getString("VITE_BFF_Auth_BaseURL") || import.meta.env.VITE_BFF_Auth_BaseURL;
export const BffManagerBaseUrl =
  getString("VITE_BFF_Manager_BaseURL") ||
  import.meta.env.VITE_BFF_Manager_BaseURL;
export const payerRegistrationBaseUrl =
  getString("VITE_PayerRegistration_BaseURL") ||
  import.meta.env.VITE_PayerRegistration_BaseURL;
export const collectionBaseUrl =
  getString("VITE_Collection_BaseURL") ||
  import.meta.env.VITE_Collection_BaseURL;
export const assessmentRepositoryBaseUrl =
  getString("VITE_AssessmentRepository_BaseURL") ||
  import.meta.env.VITE_AssessmentRepository_BaseURL;
export const paymentNormalizationBaseUrl =
  getString("VITE_PaymentNormalization_BaseURL") ||
  import.meta.env.VITE_PaymentNormalization_BaseURL;
export const homePageContactNumbers =
  getJson<string[]>("VITE_HomePage_Phone", []) ||
  JSON.parse(import.meta.env.VITE_HomePage_Phone || "[]");
export const homePageContactEmails =
  getJson<string[]>("VITE_HomePage_Email", []) ||
  JSON.parse(import.meta.env.VITE_HomePage_Email || "[]");
export const homePageContactAddress =
  getJson<string[]>("VITE_HomePage_Address", []) ||
  JSON.parse(import.meta.env.VITE_HomePage_Address || "[]");
export const unprotectedUrls =
  getJson<string[]>("VITE_Unprotected_Url", []) ||
  JSON.parse(import.meta.env.VITE_Unprotected_Url || "[]");
export const apiServices = JSON.parse(import.meta.env.VITE_API_Services || "{}");
export const taxSmartForTestBaseUrl =
  getString("VITE_TaxSmartForTest_BaseURL") ||
  import.meta.env.VITE_TaxSmartForTest_BaseURL;
export const paymentOnlineBaseUrl =
  getString("VITE_PaymentOnline_BaseURL") ||
  import.meta.env.VITE_PaymentOnline_BaseURL;
export const backgroundImage =
  getString("VITE_Background_Image") || import.meta.env.VITE_Background_Image;
export const logoImage =
  getString("VITE_Logo_Image") || import.meta.env.VITE_Logo_Image;
export const loginText =
  getString("VITE_Login_Text") || import.meta.env.VITE_Login_Text;
export const dataFormSubmissionRequired =
  getBool("VITE_Data_Form_Submission_Required", false) ||
  import.meta.env.VITE_Data_Form_Submission_Required === "true";
export const homepageText =
  getString("VITE_Homepage_Text") || import.meta.env.VITE_Homepage_Text;
export const homepageBIRText =
  getString("VITE_HomePage_BIR_Text") || import.meta.env.VITE_HomePage_BIR_Text;
export const cookieText =
  getString("VITE_Cookie_Text") || import.meta.env.VITE_Cookie_Text;
export const encryptionKey =
  getString("VITE_Encryption_Key") || import.meta.env.VITE_Encryption_Key;
export const merchantCode =
  getString("VITE_Merchant_Code") || import.meta.env.VITE_Merchant_Code;
export const stateName =
  getString("VITE_State_Name") || import.meta.env.VITE_State_Name;
export const signatorySignature =
  getString("VITE_Signatory_Signature") ||
  import.meta.env.VITE_Signatory_Signature;
export const signatoryPosition =
  getString("VITE_Signatory_Position") ||
  import.meta.env.VITE_Signatory_Position;
export const signatoryName =
  getString("VITE_Signatory_Name") || import.meta.env.VITE_Signatory_Name;
export const toastTimer =
  getInt("VITE_Toast_Timer", 10000) ||
  parseInt(import.meta.env.VITE_Toast_Timer || "10000");
