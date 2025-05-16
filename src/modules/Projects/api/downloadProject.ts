import {AxiosResponse} from 'axios';
import { API } from '../../../common/services/api';


export const getPresignedURL = async (projectId: string): Promise<AxiosResponse<string>> => {
  const url= `${import.meta.env.VITE_API_URL2}/projects/${projectId}/data-full`

    return API.call("GET", url, true);
}
