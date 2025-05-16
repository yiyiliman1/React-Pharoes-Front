import { useQuery, UseQueryResult } from "react-query";
import { useEffect, useState } from 'react';
import {AccountRun, AccountRuns} from '../types';
import { getAccountRuns } from '../api/getAccountRuns'
import {AxiosResponse} from "axios";


export interface UseAccountRuns {
    accountRuns: AccountRuns
    getAccountRunsResponse: UseQueryResult<AxiosResponse<string> | undefined>
}

export default function useAccountRuns(cursor: string): UseAccountRuns {
    const accountRunsDefault: AccountRuns = {
        Cursor: {
            next: "",
            prev: "",
            has_next: false,
            has_prev: false,
            amount: 0,
            self: "",
        },
        Data: []
    }
    const [accountRuns, setAccountRuns] = useState<AccountRuns>(accountRunsDefault);
    const getAccountRunsResponse = useQuery(["getAccountRuns", cursor],() => getAccountRuns(cursor));


    useEffect(() => {
        if (!getAccountRunsResponse.data?.data) return
        setAccountRuns(JSON.parse(getAccountRunsResponse.data.data))
    }, [getAccountRunsResponse.data])


    return {
        accountRuns,
        getAccountRunsResponse
    }
}
