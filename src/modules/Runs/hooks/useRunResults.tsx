import useSelectedProject from "../../Projects/hooks/useSelectedProject";
import { getResultsUrl } from "../api/getResultsUrl";
import { useParams } from "react-router";
import { useQuery } from "react-query";
import { Query, QueryError } from "../../../common/hooks/usePaginatedQuery";

interface IUseQuicksight {
  resultsQuery: Query<string, QueryError>;
}

export function useRunResults(): IUseQuicksight {
  const { selectedProject } = useSelectedProject();
  const { runId } = useParams();

  const getRunResultsUrlQuery = useQuery<string, QueryError>(
    ["getResultsUrl", selectedProject?.projectid, runId], 
    async () => {
      try {
        const response = await getResultsUrl(selectedProject!, runId!)
        return JSON.parse(response.data);
      } catch (error) {
        throw QueryError.fromError(error);
      }
    },
    { enabled: !!selectedProject && !!runId }
  );

  const resultsQuery = Query.create(getRunResultsUrlQuery);

  return { resultsQuery }
}