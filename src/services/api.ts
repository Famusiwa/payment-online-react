import {
  BffAuthBaseUrl,
  BffManagerBaseUrl,
  merchantCode,
  paymentNormalizationBaseUrl,
  taxSmartForTestBaseUrl,
  unprotectedUrls,
} from "@/lib/env";
import { showToast } from "@/lib/toast";
import { convertToTimestamp } from "@/lib/utils";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("token");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    //   config.headers.SB = `${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const resp = error?.response;
    // console.log("API Error:", error);
    const finalUrl = resp?.request?.responseURL;
    const currentPageUrl = window.location.pathname;
    if (status === 401 ||
      (finalUrl &&
      finalUrl.includes("auth/login") &&
      currentPageUrl !== "/login")
    ) {
      console.log("Request redirected to login page");
      if (unprotectedUrls.includes(currentPageUrl)) {
        registerNewToken();
      } else {
        showToast("Session expired. Please log in again.", "error");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;

const registerNewToken = async () => {
  const response = await fetch(`${BffAuthBaseUrl}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ clientId: "SSSC" }),
  });
  if (response.ok) {
    const content = await response.text();
    const data = JSON.parse(content);
    if (data?.succeeded) {
      const expiredTime = data?.data?.expiresAt;
      localStorage.setItem(
        "expiredTime",
        convertToTimestamp(expiredTime).toString()
      );
    }
  }
};

export const request = async (
  method: "get" | "post" | "put" | "delete",
  url: string,
  service: string,
  data = {},
  headers = {},
  isformData = false,
  isDownload = false
) => {
  const token = localStorage.getItem("token") || "";

  // Taxsmart use normal flow call
  // ...existing code...
  if (service === "TSSC") {
    const headersValues: any = {
      ...headers,
      "Tss-Merchant": merchantCode,
    };

    // apply form-data header if requested
    if (isformData) {
      headersValues["Content-Type"] = "multipart/form-data";
    }

    const config: any = {
      method,
      url,
      data,
      baseURL: taxSmartForTestBaseUrl,
      headers: headersValues,
    };

    // handle downloads without adding custom properties to the axios config object
    if (isDownload) {
      config.responseType = "arraybuffer";
    }

    return api(config);
  }
// ...existing code...

  if (service === "PNSC") {
    return api({
      method,
      url,
      data,
      baseURL: paymentNormalizationBaseUrl,
      headers: {
        ...headers,
        "Tss-Merchant": merchantCode,
      },
    });
  }

  // if (service === "SSSC") {
  //   const headersValues: any = {
  //     ...headers,
  //     XI: service,
  //     Authorization: `Bearer ${token}`,
  //     SB: `${token}`,
  //   };

  //   if (isformData) {
  //     headersValues["Content-Type"] = "multipart/form-data";
  //   }
  //   const config: any = {
  //     method,
  //     url,
  //     data,
  //     // baseURL: "https://devservices.ogunstaterevenue.com/SelfServicePro",
  //     // baseURL: "https://1bbsqjcp-7140.usw3.devtunnels.ms",
  //     baseURL: "https://v8n7lvhs-44370.use.devtunnels.ms/",
  //     // baseURL: "https://ktkh4q8d-7140.usw3.devtunnels.ms",
  //     // baseURL: "https://2g5tw5w2-44360.use.devtunnels.ms",
  //     // baseURL: "https://services.deltabir.com/SelfServiceProApi",
  //     headers: headersValues,
  //   };

  //   if (isDownload) {
  //     config.responseType = "arraybuffer";
  //   }

  //   return api(config);
  // }

  // if (service === "PRSC") {
  //   const headersValues: any = {
  //     ...headers,
  //     XI: service,
  //     Authorization: `Bearer ${token}`,
  //     SB: `${token}`,
  //   };

  //   if (isformData) {
  //     headersValues["Content-Type"] = "multipart/form-data";
  //   }

  //   return api({
  //     method,
  //     url,
  //     data,
  //     // baseURL: "https://2g5tw5w2-44360.use.devtunnels.ms",
  //     // baseURL: "https://ktkh4q8d-7140.usw3.devtunnels.ms",
  //     // baseURL: "https://1bbsqjcp-7140.usw3.devtunnels.ms",
  //     baseURL: "https://v8n7lvhs-44370.use.devtunnels.ms/",
  //     // baseURL: "https://ktkh4q8d-7140.usw3.devtunnels.ms",
  //     // baseURL: "https://services.deltabir.com/SelfServiceProApi",
  //     headers: headersValues,
  //   });
  // }

  // if (service === "PCSC") {
  //   const headersValues: any = {
  //     ...headers,
  //     XI: service,
  //     Authorization: `Bearer ${token}`,
  //     SB: `${token}`,
  //   };

  //   if (isformData) {
  //     headersValues["Content-Type"] = "multipart/form-data";
  //   }

  //   return api({
  //     method,
  //     url,
  //     data,
  //     // baseURL: "https://2g5tw5w2-44360.use.devtunnels.ms",
  //     // baseURL: "https://ktkh4q8d-7140.usw3.devtunnels.ms",
  //     // baseURL: "https://1bbsqjcp-7140.usw3.devtunnels.ms",
  //     // baseURL: "https://ktkh4q8d-7140.usw3.devtunnels.ms",
  //     baseURL: "https://v8n7lvhs-44370.use.devtunnels.ms/",
  //     // baseURL: "https://services.deltabir.com/SelfServiceProApi",
  //     // https://wtv3jc6l-7140.use.devtunnels.ms/swagger/index.html
  //     headers: headersValues,
  //   });
  // }

  // // Check if the URL is unprotected
  const currentPageUrl = window.location.pathname;
  // Check if there's access to call the API
  const currentTimeStamp = Date.now();
  const expiredTime = localStorage.getItem("expiredTime");

  if (
    currentTimeStamp >= Number(expiredTime) - 10000 &&
    currentPageUrl !== "/login"
  ) {
    if (unprotectedUrls.includes(currentPageUrl)) {
      registerNewToken();
    } else {
      showToast("Session expired. Please log in again.", "error");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }

  const headersValues: any = {
    ...headers,
    XI: service,
    Authorization: `Bearer ${token}`,
    SB: `${token}`,
  };

  if (isformData) {
    headersValues["Content-Type"] = "multipart/form-data";
  }

  const config: any = {
    method,
    url,
    data,
    baseURL: url.includes("/login") ? BffAuthBaseUrl : BffManagerBaseUrl,
    headers: headersValues,
    withCredentials: true,
  };

  if (isDownload) {
    config.responseType = "arraybuffer";
  }

  return api(config);
};
