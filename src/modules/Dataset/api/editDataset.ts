import { API } from '../../../common/services/api';
import { AxiosResponse } from 'axios';
import { template } from 'lodash';

const URL_TEMPLATE = template(`${import.meta.env.VITE_API_URL2}/projects/<%= projectId %>/data-fields/<%= field %>/rows/<%= rowId %>`)

export const editItem = async (projectId: string, field: string, rowId: string, body: any): Promise<AxiosResponse<Response> | undefined> => {
    const url = URL_TEMPLATE({ projectId, field, rowId })
    return API.call<any>('PUT', url, true, {
        data: {
            ...body
        }
    })
}
