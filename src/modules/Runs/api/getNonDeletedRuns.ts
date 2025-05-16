import { AxiosResponse } from "axios";
import { API } from "../../../common/services/api";
import { Project } from "../../Projects/types";

export const getNonDeletedRuns = async (project?: Project): Promise<AxiosResponse<string> | undefined> => {
  if (!project) return;
  const URL = `${import.meta.env.VITE_API_URL2}/projects/${project.projectid}/runs/non-deleted`;
  return API.call<string>("GET", URL, true);
};
