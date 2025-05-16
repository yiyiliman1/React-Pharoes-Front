import { UseQueryResult, useQuery } from "react-query";
import {useEffect, useState} from 'react';
import { AxiosResponse } from 'axios';
import { getDataset } from '../api/getDataset';
import useSelectedProject from '../../Projects/hooks/useSelectedProject';
import {Cursor} from "../../../common/types";

export interface UseGetDataRequest {
  data: any[]
  columns: any[]
  getDataResponse: UseQueryResult<AxiosResponse<string> | undefined>
  cursor: Cursor
}



export function useGetDataRequest(field?: string, filters: any = {}, currentRunId?: string, queryCursor?: string): UseGetDataRequest {
  const { selectedProject } = useSelectedProject()
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [cursor, setCursor] = useState<Cursor>({
    next: "",
    has_next: false,
    has_prev: false,
    prev: "",
    self: "",
    amount: 0,
  },);
  const getDataResponse = useQuery(['getDataset', selectedProject, field, filters, currentRunId, queryCursor], () => getDataset(selectedProject?.projectid, field, filters, currentRunId, queryCursor))

  useEffect(() => {
    if (!getDataResponse.data?.data) return
    const { data, columns, cursor } = JSON.parse(getDataResponse.data.data)
    setColumns(columns)
    setData(Object.keys(data).map(key => ({ ...data[key], id: key })))
    setCursor(cursor)
  }, [getDataResponse.data, field])

  return {
    data,
    columns,
    getDataResponse,
    cursor
  }
}
