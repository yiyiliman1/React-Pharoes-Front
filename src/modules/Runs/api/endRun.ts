import { AxiosRequestConfig, AxiosResponse } from "axios";
import { API } from "../../../common/services/api";
import { Project } from "../../Projects/types";
import { RunDetails } from "../types";

export const endRun = async (project: Project, run: RunDetails): Promise<AxiosResponse<string>> => {
  const url = `${import.meta.env.VITE_API_URL2}/projects/${project.projectid}/runs/${run.runid}`;

  const config: AxiosRequestConfig = {
    data: { endrun: true, timemax: parseInt(run.timemax!), tolerance: parseFloat(run.tolerance!) },
  };
  return API.call("PUT", url, true, config);
};
