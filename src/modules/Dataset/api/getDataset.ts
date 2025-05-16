import { API } from "../../../common/services/api";
import { AxiosResponse } from "axios";
import { forEach, pickBy, template } from "lodash";
import { useState } from "react";
import { Project } from "../../Projects/types";

const URL_TEMPLATE = template(`${import.meta.env.VITE_API_URL2}/projects/<%= projectId %>/data-fields/<%= field %>`);
const URL_RUN_TEMPLATE = template(`${import.meta.env.VITE_API_URL2}/projects/<%= projectId %>/runs/<%= currentRunId %>/data-fields/<%= field %>`);
type Response = string;

// TODO: hay que pasar los filtros a la llamada
export const getDataset = async (
  projectId?: string,
  field?: string,
  currentRunId?: string,
  cursor?: string,
  filters?: any
): Promise<AxiosResponse<Response> | undefined> => {
  if (!projectId || !field) return;
  /*  const url = (currentRunId)
    ? URL_RUN_TEMPLATE({ projectId, field, currentRunId })
    : URL_TEMPLATE({ projectId, field })*/

  let url: string = "";
  if (cursor && cursor !== "") {
    url = cursor;
  } else if (currentRunId) {
    url = URL_RUN_TEMPLATE({ projectId, field, currentRunId });
  } else {
    url = URL_TEMPLATE({ projectId, field });
  }

  // const url = URL_TEMPLATE({ projectId, field })
  return API.call<Response>("POST", url, true, { data: {} });
};

export const getProjectDataset = async (
  project: Project,
  field: string,
  currentRunId?: string,
  cursor?: string,
  filters?: any
): Promise<AxiosResponse<string>> => {
  const filterArray = filters.filter((el: any) => !!!el.sort);
  const { sort } = filters.find((el: any) => !!el.sort) || {};
  const url = currentRunId
    ? URL_RUN_TEMPLATE({ projectId: project.projectid, field, currentRunId })
    : URL_TEMPLATE({ projectId: project.projectid, field });

  return API.call<Response>("POST", url, true, {
    data: {
      filters: filterArray,
      sort,
    },
    params: { cursor }
  });
};
