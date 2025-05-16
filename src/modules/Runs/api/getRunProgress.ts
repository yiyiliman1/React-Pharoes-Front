import { API } from "../../../common/services/api";
import { Project } from "../../Projects/types";
import { AxiosResponse } from "axios";

export const getRunProgress = async (project: Project, runId: string): Promise<AxiosResponse<string>> => {
  const URL = `${import.meta.env.VITE_API_URL2}/projects/${project.projectid}/runs/${runId}/progress`;
  return API.call<string>("GET", URL, true);
};