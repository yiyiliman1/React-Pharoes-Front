import { AxiosResponse } from "axios";
import { API } from "../../../common/services/api";
import { Project } from "../../Projects/types";

export const getRunDetails = async (project: Project, runId: string): Promise<AxiosResponse<string>> => {
  const URL = `${import.meta.env.VITE_API_URL2}/projects/${project.projectid}/runs/${runId}`;
  return API.call<string>("GET", URL, true);
};
