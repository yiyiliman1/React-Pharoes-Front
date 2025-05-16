import { Project } from '../types';
import { SelectedProjectContext } from '../context/SelectedProjectContext';
import { useContext } from 'react';

type UseSelectedProject = {
  selectedProject?: Project
}

export default function useSelectedProject(): UseSelectedProject {
  const selectedProjectContext = useContext(SelectedProjectContext)
  const selectedProject = selectedProjectContext?.selectedProject
  
  return { selectedProject }
}
