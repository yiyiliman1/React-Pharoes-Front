import { AxiosRequestConfig, AxiosResponse } from "axios";
import { API } from "../../../common/services/api";
import { Project } from "../../Projects/types";
import { RunFormData } from "../types";

export const createNewRun = async (project: Project, run: RunFormData): Promise<AxiosResponse<string>> => {
  const url= `${import.meta.env.VITE_API_URL2}/projects/${project.projectid}/runs`
  const config: AxiosRequestConfig = {
    data: {
      name: run.name,
      executionid: run.execution,
      timemax: run.maxTime,
      tolerance: run.tolerance,
    },
  };
  return API.call("POST", url, true, config);
}