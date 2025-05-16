import { API } from '../../../common/services/api';
import { AxiosResponse } from 'axios';
import { template } from 'lodash';

const URL_TEMPLATE = template(`${import.meta.env.VITE_API_URL2}/projects/<%= projectId %>/data-fields/<%= field %>/rows`)
export const addItem = async (projectId: string, field: string, body: any): Promise<AxiosResponse<Response> | undefined> => {
    const url = URL_TEMPLATE({ projectId, field })
    return API.call<any>('POST', url, true, {
        data: {
            ...body
        }
    })
}
