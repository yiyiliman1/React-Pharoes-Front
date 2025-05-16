import { UseQueryResult, useQuery } from "react-query";
import { useEffect, useState } from "react";

import { AxiosResponse } from "axios";
import { getProjectSchema } from "../api/getSchema";
import useSelectedProject from "./useSelectedProject";
import { useDatasetContext } from "../../Dataset/context/DatasetContext";
import { forEach } from "lodash";

export interface UseSchemaRequest {
  schema: any;
  getSchemaResponse: UseQueryResult<AxiosResponse<string> | undefined>;
}

export default function useSchemaRequest(): UseSchemaRequest {
  const { selectedProject } = useSelectedProject();
  const [schema, setSchema] = useState<any>({});
  const ctx = useDatasetContext();

  const getSchemaResponse = useQuery(["getSchema", selectedProject?.projectid], () => {
    if (!selectedProject) return;
    return getProjectSchema(selectedProject);
  });

  useEffect(() => {
    if (!getSchemaResponse.data?.data) return;
    const schemas = JSON.parse(getSchemaResponse.data.data);

    forEach(schemas, (schema) => {
      forEach(schema, (el) => {
        if (el.Category && el.Type === "ObjectID") {
          el.ColumnType = "REL";
        }
        if (el.Category && el.Type !== "ObjectID") {
          el.ColumnType = "ATTR_REL";
        }
        return (el.ColumnType = "PROP");
      });
    });

    setSchema(schemas);
  }, [getSchemaResponse.data]);

  return {
    schema,
    getSchemaResponse,
  };
}
