import { API } from "../../../common/services/api";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { template } from "lodash";

const URL_TEMPLATE = template(`${import.meta.env.VITE_API_URL2}/projects/<%= projectId %>/data-fields/<%= field %>/rows`);

export const deleteItems = async (projectId: string, field: string, ids: string[]): Promise<AxiosResponse<string>> => {
  const url = URL_TEMPLATE({ projectId, field });
  const config: AxiosRequestConfig = {
    data: { ids },
  };
  return API.call<any>("DELETE", url, true, config);
};
