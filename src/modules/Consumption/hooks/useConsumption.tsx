import { useQuery, UseQueryResult } from "react-query";
import { useEffect, useState } from 'react';
import { getConsumption } from '../api/getConsumption';
import {Consumption, Consumptions} from '../types';
import {AxiosResponse} from "axios";

export interface UseConsumption {
  consumptions: Consumptions
  getConsumptionResponse: UseQueryResult<AxiosResponse<string> | undefined>
  
  selectedConsumption: Consumption | undefined
  setSelectedConsumption: (consumption: Consumption | undefined) => void
}


export default function useConsumption(cursor: string): UseConsumption {
  const consumptionsDefault: Consumptions = {
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
  const [consumptions, setConsumptions] = useState<Consumptions>(consumptionsDefault);
  const [selectedConsumption, setSelectedConsumption] = useState<Consumption>();
  const getConsumptionResponse = useQuery(["getConsumption", cursor], ()=> getConsumption(cursor));


  useEffect(() => {
    if (!getConsumptionResponse.data?.data) return
    setConsumptions(JSON.parse(getConsumptionResponse.data.data))
  }, [getConsumptionResponse.data])



  return {
    consumptions,
    getConsumptionResponse,
    
    selectedConsumption,
    setSelectedConsumption,
  }
}
