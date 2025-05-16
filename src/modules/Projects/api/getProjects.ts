import {AxiosResponse} from 'axios';
import { API } from '../../../common/services/api';

const URLS = {
  Projects: `${import.meta.env.VITE_API_URL2}/projects`,
}

export const getProjects = async (): Promise<AxiosResponse<string> | undefined> => {
  return API.call<string>("GET", URLS.Projects, true);
}
