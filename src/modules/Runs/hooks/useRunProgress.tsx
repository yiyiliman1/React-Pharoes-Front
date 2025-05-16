import { QueryError } from "../../../common/hooks/usePaginatedQuery";
import { getRunProgress } from "../api/getRunProgress";
import { useQuery, UseQueryResult } from "react-query";
import useSelectedProject from "../../Projects/hooks/useSelectedProject";
import { useParams } from "react-router";
import { useRunsContext } from "../context/RunsContext";

interface IUseRunProgress {
  progressQuery: UseQueryResult<string, QueryError>;
}

export function useRunProgress(): IUseRunProgress {
  const { selectedProject } = useSelectedProject();
  const runsCtx = useRunsContext();
  const { runId } = useParams();

  const progressQuery = useQuery<string, QueryError>(
    ["getRunProgress", selectedProject?.projectid, runId], 
    progressFetcher,
    { 
      enabled: !!selectedProject && !!runId && !!runsCtx.currentRun, 
      refetchInterval: () =>  runsCtx.currentRun?.status === "Running" ? 5 * 1000 : 0
    }
  );

  async function progressFetcher() {
    try {
      const response = await getRunProgress(selectedProject!, runId!);
      return JSON.parse(response.data);
    } catch (error) {
      throw QueryError.fromError(error);
    }
  }

  return { progressQuery }
}