import { useEffect, useState } from 'react';
import { getRelatedField } from '../api/getRelatedField';
import { useQuery } from 'react-query';
import useSelectedProject from '../../Projects/hooks/useSelectedProject';

export interface UseRelatedField {
  allData: any;
  data: any;
  filteredData: any;
  fetching: boolean;
  loading: boolean;
  error?: any;
  refetch: () => Promise<any>;
}

export function useRelatedField(
  field: string,
  searchValue?: string
): UseRelatedField {
  const { selectedProject } = useSelectedProject();
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [allData, setAllData] = useState<any[]>();
  let handleSearchChange: any;

  const getProfilesResponse = useQuery(
    ['getRelatedField', selectedProject?.projectid, field],
    () => getRelatedField(selectedProject?.projectid, field)
  );

  useEffect(() => {
    setFilteredData(Object.entries(data));
  }, [data]);

  useEffect(() => {
    clearTimeout(handleSearchChange);
    handleSearchChange = setTimeout(() => {
      setFilteredData(
        Object.entries(data)?.filter((dataItem) =>
          dataItem[1]?.toLowerCase().includes(searchValue?.toLowerCase())
        )
      );
    }, 300);
  }, [searchValue, data]);

  useEffect(() => {
    if (!getProfilesResponse.data?.data) return;
    const data = JSON.parse(getProfilesResponse.data.data);
    setData(data[field]);
    setFilteredData(Object.entries(data[field]));
    setAllData(data);
  }, [getProfilesResponse.data]);

  return {
    allData,
    data,
    filteredData,
    fetching: getProfilesResponse.isFetching,
    loading: getProfilesResponse.isLoading,
    error: getProfilesResponse.error ?? undefined,
    refetch: getProfilesResponse.refetch,
  };
}
