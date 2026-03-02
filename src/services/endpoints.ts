import { request } from "./api";
import { apiServices } from "@/lib/env";


export const apiCall = {
  getStateLists: () =>
    request(
      "get",
      "/api/v1/PayerRegistration/get-state-lists",
      apiServices.payerRegistration
    ),
  getLGALists: (stateId: any) =>
    request(
      "get",
      `/api/v1/PayerRegistration/get-lga-lists?stateId=${stateId}`,
      apiServices.payerRegistration
    ),
  getBusinessTypeLists: () =>
    request(
      "get",
      "/api/v1/PayerRegistration/get-businessType-lists",
      apiServices.payerRegistration
    ),
  updatePayerProfile: (data: any) =>
    request(
      "post",
      "/api/v1/users/update-view-payer-info",
      apiServices.selfService,
      data
    ),
};
