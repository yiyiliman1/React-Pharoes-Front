import axios, {AxiosResponse} from 'axios';

import {API} from "../../../common/services/api";

export const getConsumptionByMonth = async (cursor: string, yearMonth: string): Promise<AxiosResponse<string> | undefined> => {
  let url = `${import.meta.env.VITE_API_URL2}/costs/${yearMonth}`
  if (cursor !== ""){
    url = cursor
  }
  return API.call<string>("GET", url, true)
}
