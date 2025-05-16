import {AxiosRequestConfig, AxiosResponse} from 'axios';
import { API } from '../../../common/services/api';
import {Profile} from "../types";
import {template} from "lodash";

export const createFormulaProfile = async (profile: Profile, projectId: string, ): Promise<AxiosResponse<Response> | undefined> => {
    const URL_TEMPLATE = template(`${import.meta.env.VITE_API_URL2}/projects/<%= projectId%>/profiles/formula-profiles`)
    const url = URL_TEMPLATE({projectId})
    const config: AxiosRequestConfig = {
        data: {
            "comments": profile.Comments,
            "name": profile.Name,
            "formula": profile.Formula,
            "rule": profile.Rule
        },
    }
    return API.call<Response>("POST", url, true, config)
}
