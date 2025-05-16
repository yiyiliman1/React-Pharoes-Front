import { AxiosRequestConfig, AxiosResponse } from "axios";
import { API } from "../../../common/services/api";
import { Project } from "../../Projects/types";
import { RunFormData } from "../types";

export const updateRunDetails = async (project: Project, runId: string, data: RunFormData): Promise<AxiosResponse<string>> => {
  const url = `${import.meta.env.VITE_API_URL2}/projects/${project.projectid}/runs/${runId}`;

  const config: AxiosRequestConfig = {
    data: { endrun: false, timemax: data.maxTime, tolerance: data.tolerance },
  };
  return API.call("PUT", url, true, config);
};
