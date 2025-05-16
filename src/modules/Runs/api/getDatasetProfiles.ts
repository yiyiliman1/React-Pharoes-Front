import { AxiosResponse } from "axios";
import { API } from "../../../common/services/api";
import { Project } from "../../Projects/types";

export const getDataSetProfiles = async (project?: Project, runId?: string): Promise<AxiosResponse<string> | undefined> => {
  if (!project || !runId) return;
  const URL = `${import.meta.env.VITE_API_URL2}/projects/${project.projectid}/runs/${runId}/all-profiles`;
  return API.call<string>("GET", URL, true);
};
