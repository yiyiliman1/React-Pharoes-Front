import axios, {AxiosResponse} from 'axios';
import { API } from '../../../common/services/api';

const URLS = {
  Consumption: `${import.meta.env.VITE_API_URL2}/costs`,
}

export const getConsumption = async (cursor: string): Promise<AxiosResponse<string> | undefined> => {
  let url = URLS.Consumption
  if (cursor !== ""){
    url = cursor
  }
  return API.call<string>("GET", url, true)
}
