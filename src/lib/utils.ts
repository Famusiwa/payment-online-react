import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { showToast } from "./toast";
import { showAlert } from "./alert";
import { useLocation } from "react-router-dom";
import { MenuState } from "@/store/features/auth/menuSlice";
import { paymentOnlineBaseUrl } from "./env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleAPIError = (
  error: any,
  displayMessage: boolean = true,
  useAlert: boolean = false
) => {
  let parsed =
    handleAPIErrorResponse(error?.response?.data) || error?.response?.data;
  // console.log("parsed", parsed);
  // console.log("error", error);
  let message: string =
    parsed?.message ||
    parsed?.Message ||
    parsed?.title ||
    error?.response?.message ||
    error?.response?.data ||
    error?.response?.data?.title ||
    "An error occurred";

  let validationErrors =
    (error?.response?.status === 400 && error?.response?.data?.errors) ||
    parsed?.errors;

  if (validationErrors && typeof validationErrors === "object") {
    (Object.values(validationErrors).flat() as string[]).forEach((msg) => {
      useAlert ? showAlert(msg, "error") : showToast(msg, "error");
    });
  } else {
    if (displayMessage) {
      useAlert ? showAlert(message, "error") : showToast(message, "error");
    }
  }
};

export const handleAPIErrorResponse = (responseData: any) => {
  if (
    responseData?.error &&
    responseData?.message &&
    Object.keys(responseData).length == 2
  ) {
    let parsed: any = {};
    try {
      parsed = JSON.parse(responseData.message);
    } catch (error) {
      return null;
    }
    if (parsed?.message || parsed?.Message || parsed?.detail) {
      responseData.message =
        parsed?.message || parsed?.Message || parsed?.detail;
      responseData.data = parsed?.data;
      responseData.title = parsed?.title;
    }
    if (parsed?.errors) {
      responseData.validationErrors = parsed.errors;
    }
    return responseData;
  }
  return null;
};

export const constructDropdownOptions = (
  data: any,
  labelKey: string,
  valueKey: string,
  numericalValue: boolean = false
) => {
  return data.map((item: any) => ({
    label: String(item[labelKey]),
    value: numericalValue ? Number(item[valueKey]) : String(item[valueKey]),
    ...item,
  }));
};

export const getInitials = (text: string): string => {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

export const formatCurrency = (amount: any, showCurrency = true): string => {
  const numericAmount = typeof amount === "number" ? amount : Number(amount);
  if (isNaN(numericAmount)) {
    return "";
  }
  return new Intl.NumberFormat("en-NG", {
    style: showCurrency ? "currency" : "decimal",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-NG", options);
};

export const formatDateTime = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-NG", options);
};

export const base64UrlEncode = (input: string): string => {
  const inputBytes = new TextEncoder().encode(input);
  return btoa(String.fromCharCode(...inputBytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, ""); // no padding
};

export const convertToTimestamp = (dateString: string): number => {
  // dateString = dateString.replace("Z", "");
  const date = new Date(dateString);
  // console.log("convertToTimestamp", dateString, date.getTime());
  return date.getTime();
};

// Email validation function
export const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const getQueryParameters = () => {
  const search = useLocation().search;
  if (!search) return null;
  const params = new URLSearchParams(search);
  if (!Array.from(params.keys()).length) return null;
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

export function getFileData(file: File): Promise<{
  base64: string;
  extension: string;
  filename: string;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result?.toString().split(",")[1] || "";
      const extension = file.name.split(".").pop()?.toLowerCase() || "";
      resolve({
        base64,
        extension,
        filename: file.name,
      });
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}

export const monthNames: Record<string, string> = {
  "1": "January",
  "2": "February",
  "3": "March",
  "4": "April",
  "5": "May",
  "6": "June",
  "7": "July",
  "8": "August",
  "9": "September",
  "10": "October",
  "11": "November",
  "12": "December",
};

export const downloadFile = (
  data: BlobPart,
  filename: string,
  type: "excel" | "xlsx" | "pdf" | "csv" | "txt" = "excel",
  openInNewTab: boolean = false
) => {
  const mimeTypes: Record<string, string> = {
    excel: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    pdf: "application/pdf",
    csv: "text/csv",
    txt: "text/plain",
  };

  const blob = new Blob(
    [data instanceof ArrayBuffer ? new Uint8Array(data) : data],
    { type: mimeTypes[type] }
  );
  if (openInNewTab) {
    const viewUrl = window.URL.createObjectURL(blob);
    const newTab = window.open(viewUrl, "_blank", "noopener,noreferrer");
    if (!newTab) {
      // fallback: navigate current window to the resource
      window.location.href = viewUrl;
    }
    setTimeout(() => window.URL.revokeObjectURL(viewUrl), 1500);
    return;
  }
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const groupPermissions = (permissions: any[]): MenuState[] => {
  // First, separate parents and children
  const parents = permissions.filter((p) => p.parentPermissionCode === "*");
  const children = permissions.filter((p) => p.parentPermissionCode !== "*");

  const menus: MenuState[] = parents.map((parent) => {
    const submenu = children
      .filter((child) => child.parentPermissionCode === parent.permissionCode)
      .sort((a, b) => a.permissionOrder - b.permissionOrder)
      .map((child) => ({
        label: child.permissionName,
        path: child.permissionUrl || "",
      }));

    return {
      icon: parent.imgClass || "",
      label: parent.permissionName,
      section: parent.sectionName || "",
      submenu: submenu.length > 0 ? submenu : undefined,
      path: parent.permissionUrl || "",
    };
  });

  // Optional: sort parents by their permissionOrder if needed
  return menus.sort((a, b) => {
    const parentA = parents.find((p) => p.permissionName === a.label);
    const parentB = parents.find((p) => p.permissionName === b.label);
    return (parentA?.permissionOrder || 0) - (parentB?.permissionOrder || 0);
  });
};

export const extractPaths = (menus: MenuState[]): string[] => {
  const paths: string[] = [];

  menus.forEach((menu) => {
    // include the parent path if valid
    if (menu.path && menu.path !== "*") {
      paths.push(menu.path.toLowerCase());
    }

    // check submenu paths
    if (menu.submenu && Array.isArray(menu.submenu)) {
      menu.submenu.forEach((sub: any) => {
        if (sub.path && sub.path !== "*") {
          paths.push(sub.path.toLowerCase());
        }
      });
    }
  });

  return paths;
};

export const generateDashboardURL = (type: string): string => {
  switch (type.toLowerCase()) {
    case "staff":
      return "/Registered-Staff-List";
    case "bill":
      return "/Bills-History";
    case "withholding returns":
      return "/Withholding-Return-History";  
    case "remittance":
      return "/Payments-History";  
    case "tcc issued":
      return "/tcc-history";  
    default:
      return "/dashboard";
  } 
};

export const generatePaymentOnlineURL = (payerUTIN: string, payerType: string): string => {
  if(payerUTIN && (payerType.toLowerCase() === "pa" || payerType.toLowerCase() === "da" || payerType.toLowerCase() === "ag")) {
    return `${paymentOnlineBaseUrl}/?&ref=${getPayerUTINItemKey(payerUTIN)}&id=2`;
  }
  return paymentOnlineBaseUrl;
};

export const getPayerUTINItemKey = (payerUTIN?: string | null): string => {
  if (!payerUTIN) return "";
  return base64UrlEncode(String(payerUTIN));
};

export const toQueryParams = (data: Record<string, any>): string => {
  if (!data) return "";
  const params = Object.entries(data)
    .filter(([_, v]) => v !== undefined && v !== null)
    .map(
      ([k, v]) =>
        `${encodeURIComponent(k)}=${encodeURIComponent(
          typeof v === "object" ? JSON.stringify(v) : v
        )}`
    )
    .join("&");
  return params ? `?${params}` : "";
}
