import { useQuery, UseQueryResult } from "react-query";
import { useEffect, useState } from 'react';
import { getConsumptionByMonth } from '../api/getConsumptionByMonth';
import {Consumptions, MonthConsumptions} from '../types';
import {AxiosResponse} from "axios";

export interface UseMonthConsumption {
  monthConsumptions: MonthConsumptions
  response: UseQueryResult<AxiosResponse<string> | undefined>
}

export default function useMonthConsumption(cursor: string, yearMonth: string): UseMonthConsumption {
  const monthConsumptionsDefault: MonthConsumptions = {
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
  const [monthConsumptions, setMonthConsumptions] = useState<MonthConsumptions>(monthConsumptionsDefault);
  const response = useQuery(["getConsumptionByMonth", cursor, yearMonth], () => getConsumptionByMonth(cursor, yearMonth));

  useEffect(() => {
    if (!response.data?.data) return
    setMonthConsumptions(JSON.parse(response.data.data))
  }, [response.data])

  return {
    monthConsumptions,
    response
  }
}
