import {AxiosResponse} from 'axios';
import { API } from '../../../common/services/api';

const URLS = {
    AccountRuns: `${import.meta.env.VITE_API_URL2}/runs`,
}

export const getAccountRuns = async (cursor: string) : Promise<AxiosResponse<string> | undefined> => {
        let url = URLS.AccountRuns
        if (cursor !== ""){
            url = cursor
        }
    return API.call<string>("GET", url, true);
}
