import { API } from '../../../common/services/api';
import { AxiosResponse } from 'axios';
import { template } from 'lodash';

const URL_TEMPLATE = template(`${import.meta.env.VITE_API_URL2}/projects/<%= projectId %>/data-fields/<%= field %>/rows/<%= rowId %>/copy`)

export const duplicateItem = async (projectId: string, field: string, rowId: string): Promise<AxiosResponse<string>> => {
  const url = URL_TEMPLATE({ projectId, field, rowId })
  return API.call<any>('post', url, true)
}
