import { API } from '../../../common/services/api';
import { AxiosResponse } from 'axios';
import { template } from 'lodash';

const URL_TEMPLATE = template(`${import.meta.env.VITE_API_URL2}/projects/<%= projectId %>/copy`)

export const duplicateProject = async (projectId: string): Promise<AxiosResponse<Response> | undefined> => {
    const url = URL_TEMPLATE({ projectId })
    return API.call<any>('post', url, true)
}
