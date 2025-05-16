import { API } from '../../../common/services/api';
import { AxiosResponse } from 'axios';
import { template } from 'lodash';
import { Project } from '../../Projects/types';

const URL_TEMPLATE = template(`${import.meta.env.VITE_API_URL2}/projects/<%= projectId %>/data-fields/<%= field %>/related-values-array`)
type Response = string



export const getRelatedField = async (projectId?: string, field?: string): Promise<AxiosResponse<Response> | undefined> => {
  if (!projectId || !field) return
  const url = URL_TEMPLATE({ projectId, field })
  return await API.call<Response>('get', url, true)
}

export const getDatasetRelatedValues = async (project: Project, field: string): Promise<AxiosResponse<string>> => {
  const url = URL_TEMPLATE({ projectId: project.projectid, field })
  return await API.call<Response>('get', url, true)
}
