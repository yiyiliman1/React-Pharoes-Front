import { DataPage, PaginatedQuery, usePaginatedQuery } from "../../../common/hooks/usePaginatedQuery";
import { Selection, useSelection } from "../../../common/hooks/useSelection";
import { createContext, useContext, useState } from "react";
import { getProjectRuns } from "../api/getRuns";
import { RunDetails } from "../types";
import { Project } from "../../Projects/types";

interface IRunsContext extends PaginatedQuery<RunDetails[]>, Selection<RunDetails> {
  currentRun?: RunDetails;
  setCurrentRun: (run: RunDetails) => void;
}

export const RunsContext = createContext<IRunsContext>({ data: [] } as any);

interface RunsProviderProps {
  children: React.ReactChild | React.ReactChild[];
}

export const RunsProvider = ({ children }: RunsProviderProps) => {
  const [currentRun, setCurrentRun] = useState<RunDetails>();

  const queryId = "GET_PROJECT_RUNS";
  const queryFn = async (project: Project) => {
    const response = await getProjectRuns(project, pagination.tokens.current);
    const page: DataPage<RunDetails[]> = JSON.parse(response.data);
    return page;
  } 

  const { pagination, query } = usePaginatedQuery<RunDetails[]>(queryId, queryFn);
  const { selection } = useSelection<RunDetails>();
  
  return (
    <RunsContext.Provider value={{ 
      pagination, selection, query,
      currentRun, setCurrentRun
    }}>
      {children}
    </RunsContext.Provider>
  )
}

export const useRunsContext = () => {
  const context = useContext(RunsContext)
  if (context === undefined) {
    throw new Error('useRunsContext must be used within a RunsProvider.')
  }
  return context
}
