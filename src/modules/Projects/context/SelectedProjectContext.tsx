import React, { createContext, useMemo } from 'react';
import { useParams } from 'react-router';
import useProjects from '../hooks/useProjects';

export const SelectedProjectContext = createContext<any>(undefined)
export const SelectedProjectConsumer = SelectedProjectContext.Consumer;


type SelectedProjectProviderProps = {
  children?: React.ReactChild
}

export const SelectedProjectProvider = ({ children }: SelectedProjectProviderProps) => {
  const { projects, getProjectResponse } = useProjects()
  const params = useParams()

  const selectedProject = useMemo(
    () => projects.find(project => project.projectid === params?.projectId),
    [projects, params]
  )

  const value = {
    selectedProject,
    refetch: getProjectResponse.refetch
  }
  
  return (
    <SelectedProjectContext.Provider value={value}>
      {children}
    </SelectedProjectContext.Provider>
  )
}
