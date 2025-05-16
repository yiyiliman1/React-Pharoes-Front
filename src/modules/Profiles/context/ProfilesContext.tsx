import { DataPage, PaginatedQuery, usePaginatedQuery } from "../../../common/hooks/usePaginatedQuery";
import { Selection, useSelection } from "../../../common/hooks/useSelection";
import { getProjectProfiles } from "../api/getProfiles";
import { createContext, useContext } from "react";
import { Project } from "../../Projects/types";
import { Profile } from "../types";

interface IProfilesContext extends PaginatedQuery<Profile[]>, Selection<Profile> {}

export const ProfilesContext = createContext<IProfilesContext>({ data: [] } as any);

interface ProfilesProviderProps {
  children: React.ReactChild | React.ReactChild[];
}

export const ProfilesProvider = ({ children }: ProfilesProviderProps) => {
  
  const queryId = "GET_PROJECT_PROFILES";
  const queryFn = async (project: Project, currToken?: string) => {
    const response = await getProjectProfiles(project, currToken);
    const page: DataPage<Profile[]> = JSON.parse(response.data);
    return page;
  } 
  
  const { pagination, query } = usePaginatedQuery<Profile[]>(queryId, queryFn);
  const { selection } = useSelection<Profile>();
  
  return (
    <ProfilesContext.Provider value={{ 
      pagination, selection, query
    }}>
      {children}
    </ProfilesContext.Provider>
  )
}

export const useProfilesContext = () => {
  const context = useContext(ProfilesContext)
  if (context === undefined) {
    throw new Error('useProfilesContext must be used within a ProfilesProvider.')
  }
  return context
}
