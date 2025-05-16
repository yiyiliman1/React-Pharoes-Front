import { Selection, useSelection } from '../../../common/hooks/useSelection';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { DatasetItem, DatasetSchema } from '../types';
import {
  Cursor,
  PaginatedQuery,
  Query,
  usePaginatedQuery,
} from '../../../common/hooks/usePaginatedQuery';
import { Project } from '../../Projects/types';
import { getProjectDataset } from '../api/getDataset';
import useSchema from '../../Projects/hooks/useSchema';
import { useQuery } from 'react-query';
import useSelectedProject from '../../Projects/hooks/useSelectedProject';
import { getDatasetRelatedValues } from '../api/getRelatedField';

interface IDatasetContext extends Selection<DatasetItem> {
  isSchemaLoading: boolean;
  datasetName: string;
  columns?: string[];
  schema?: DatasetSchema;
  filters: any;
  setFilters: (filters: any) => void;
  dataset: PaginatedQuery<DatasetItem[]>;
  relValuesQuery: Query<DatasetRelatedValues>;
}

type DatasetProviderProps = {
  datasetKey: string;
  children?: React.ReactChild;
  currentRunId?: string;
};

export interface DatasetPage {
  cursor: Cursor;
  columns: string[];
  data: object;
}

interface DatasetColumns {
  [dataset: string]: string[];
}

export interface DatasetRelatedValues {
  [dataset: string]: {
    [uuid: string]: string;
  };
}

export interface DatasetRelatedValuesMap {
  [dataset: string]: DatasetRelatedValues;
}

export const DatasetContext = createContext<IDatasetContext>({} as any);
export const DatasetProvider = ({
  children,
  datasetKey,
  currentRunId,
}: DatasetProviderProps) => {
  const { selectedProject } = useSelectedProject();
  const [columns, setColumns] = useState<DatasetColumns>({});
  const [queryFilters, setQueryFilters] = useState<any>([]);

  const { selection } = useSelection<DatasetItem>();
  const { schema, loading: isSchemaLoading } = useSchema();

  const relValuesQuery = useQuery(
    ['GET_DATASET', 'REL_VALUES', datasetKey, selectedProject?.projectid],
    async () => {
      const response = await getDatasetRelatedValues(
        selectedProject!,
        datasetKey
      );
      const relValues: DatasetRelatedValues = JSON.parse(response.data);
      return relValues;
    },
    { enabled: !!selectedProject, staleTime: 5000 }
  );

  async function datasetFetcher(project: Project, token?: string) {
    const response = await getProjectDataset(
      project,
      datasetKey,
      currentRunId,
      token,
      queryFilters
    );
    const page: DatasetPage = JSON.parse(response.data);
    setColumns({ ...columns, [datasetKey]: page.columns });
    const items: DatasetItem[] = Object.entries(page.data).map(([id, item]) =>
      Object.assign({}, item, { id })
    );
    return { Cursor: page.cursor, Data: items };
  }

  const datasetPaginatedQuery = usePaginatedQuery<DatasetItem[]>(
    'GET_DATASET',
    datasetFetcher,
    {
      enabled: !!schema,
    }
  );

  function setFilters(filters: any) {
    setQueryFilters([...filters]);
    datasetPaginatedQuery.pagination.reset();
  }

  useEffect(() => {
    datasetPaginatedQuery.pagination.reset();
    datasetPaginatedQuery.query.refetch();
  }, [queryFilters]);

  return (
    <DatasetContext.Provider
      value={{
        selection,
        isSchemaLoading,
        columns: columns[datasetKey],
        schema: schema?.[datasetKey],
        datasetName: datasetKey,
        dataset: datasetPaginatedQuery,
        relValuesQuery: Query.create(relValuesQuery),
        filters: queryFilters,
        setFilters,
      }}
    >
      {children}
    </DatasetContext.Provider>
  );
};

export const useDatasetContext = () => {
  const context = useContext(DatasetContext);
  if (context === undefined) {
    throw new Error('useDatasetContext must be used within a DatasetProvider.');
  }
  return context;
};
