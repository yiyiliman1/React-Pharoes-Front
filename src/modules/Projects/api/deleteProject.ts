import { AxiosResponse } from 'axios';
import { template } from 'lodash';
import { API } from '../../../common/services/api';


const URL_TEMPLATE = template(`${import.meta.env.VITE_API_URL2}/projects/<%= projectId %>`)

export const deleteProject = async (projectId: string): Promise<AxiosResponse<Response> | undefined> => {
    const url = URL_TEMPLATE({ projectId })

    return API.call<Response>('DELETE', url, true)
}
