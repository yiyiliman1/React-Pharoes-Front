import { Query, useQuery, UseQueryResult } from "react-query";
import { useEffect, useState } from "react";
import { getExecutions } from "../api/getExecutions";
import { DatasetProfile, Execution, RunDetails, RunFormData } from "../types";
import useSelectedProject from "../../Projects/hooks/useSelectedProject";
import { getPresignedURL } from "../api/downloadRun";
import { deleteRuns } from "../api/deleteRuns";
import { getNonDeletedRuns } from "../api/getNonDeletedRuns";
import { NavMenuItemConfig } from "../../../common/types";
import PlayCircle from "@mui/icons-material/PlayCircle";
import { RunsPaths } from "../config/phats";
import { getRunDetails } from "../api/getRunDetails";
import { useParams } from "react-router";
import { updateRunDetails } from "../api/updateRunDetails";
import { endRun } from "../api/endRun";
import { getDataSetProfiles } from "../api/getDatasetProfiles";
import { createNewRun } from "../api/createRun";
import { ApiToast } from "../../../common/utils/ApiToast";
import { useRunsContext } from "../context/RunsContext";
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';

export interface UseRunsRequest {
  createRun: (formData: RunFormData) => any;
  downloadRun: (run: RunDetails) => Promise<any>;
  deleteSelectedRuns: (runs: RunDetails[]) => Promise<any>;
  nonDeletedRuns: Execution[];
  runsNavMenu: NavMenuItemConfig[];
  selectedRunDetails: RunDetails;
  setSelectedRunDetails: (runDetails: RunDetails) => void;
  updateSelectedRunDetails: (formData: RunFormData) => Promise<any>;
  endSelectedRun: (runDetails: RunDetails) => Promise<any>;
  datasetProfile: DatasetProfile[];
  getRunDetailsResponse: UseQueryResult<RunDetails>;
  getExecutionsQuery: UseQueryResult<Execution[]>;
}

export function useRuns(): UseRunsRequest {
  const { runId } = useParams();
  const { selectedProject } = useSelectedProject();

  const runsCtx = useRunsContext();

  const [nonDeletedRuns, setNonDeletedRuns] = useState<Execution[]>([]);
  const [runsNavMenu, setRunsNavMenu] = useState<NavMenuItemConfig[]>([]);
  const [selectedRunDetails, setSelectedRunDetails] = useState<RunDetails>({});
  const [datasetProfile, setDatasetProfile] = useState<DatasetProfile[]>([]);
  
  
  const getNonDeletedRunsResponse = useQuery(["getNonDeletedRuns", selectedProject?.projectid], () => getNonDeletedRuns(selectedProject));
  const getDatasetProfilesResponse = useQuery(["getDatasetProfiles", selectedProject?.projectid, runId], () => getDataSetProfiles(selectedProject, runId));

  const getExecutionsQuery = useQuery(
    ["getExecutions", selectedProject?.projectid], 
    async () => {
      const response = await getExecutions(selectedProject!);
      return Object.keys(response.data)
        .map(id => ({ name: response.data[id], id }) as Execution)
    }, {
      enabled: !!selectedProject
    });

  const getRunDetailsResponse = useQuery(
    ["getRunDetails", selectedProject?.projectid, runId], 
    async () => {
      const response = await getRunDetails(selectedProject!, runId!);
      return JSON.parse(response.data) as RunDetails;
    }, { 
      enabled: !!selectedProject && !!runId 
    });

  // EVENTS

  useEffect(() => {
    if (!getNonDeletedRunsResponse.data?.data) return;
    const data = JSON.parse(getNonDeletedRunsResponse.data.data);
    setNonDeletedRuns(Object.keys(data).map((key) => ({ name: data[key], id: key })));
  }, [getNonDeletedRunsResponse.data]);

  useEffect(() => {
    if (!getRunDetailsResponse.data) return;
    runsCtx.setCurrentRun(getRunDetailsResponse.data);
    setSelectedRunDetails(getRunDetailsResponse.data);
  }, [getRunDetailsResponse.data]);

  useEffect(() => {
    const runsChildren = nonDeletedRuns.map((run) => {
      return {
        label: run.name,
        path: `/app/project/${selectedProject?.projectid}/runs/${run.id}`,
      };
    });
    setRunsNavMenu([
      {
        label: "Runs",
        icon: <PlayCircle sx={{ color: "#c3c3c3" }} />,
        meta: { redirect: RunsPaths.RunsMain },
        children: [
          {
            label: "All project runs",
            path: RunsPaths.RunsMain,
            icon: <PlaylistPlayIcon sx={{ color: "#c3c3c3", pl: "4px" }} />
          },
          ...runsChildren,
        ],
      },
    ]);
  }, [nonDeletedRuns]);

  useEffect(() => {
    if (!getDatasetProfilesResponse.data?.data) return;
    const response = JSON.parse(getDatasetProfilesResponse.data.data);
    setDatasetProfile(response.Data);
  }, [getDatasetProfilesResponse.data]);

  // METHODS

  const downloadRun = async (run: RunDetails) => {
    if (!run || !selectedProject) return;
    const response = await ApiToast.for(getPresignedURL(selectedProject, run),  {
      pending: `Downloading run...`,
      success: `Your download will start shortly.`,
      error: `Error downloading run.`
    });
    if (!!response.data) {
      window.open(response.data);
    }
    return response;
  };

  const deleteSelectedRuns = async (runs: RunDetails[]) => {
    if (!selectedProject || runs.length === 0) return;
    const ids = runs.map(run => run.runid!);
    const response = await ApiToast.for(deleteRuns(selectedProject, ids), {
      pending: "Deleting runs...",
      success: "Runs successfully deleted.",
      error: "Error deleting runs.",
    });
    runsCtx.query.refetch();
    getNonDeletedRunsResponse?.refetch();
    return response;
  };

  const createRun = async (run: RunFormData) => {
    if (!selectedProject) return;
    const response = await ApiToast.for(createNewRun(selectedProject, run), {
      pending: "Creating run.",
      success: "Run successfully created.",
      error: "Error creating run."
    });
    return response;
  };

  const updateSelectedRunDetails = async (formData: RunFormData) => {
    if (!selectedProject || !runId) return;
    return ApiToast.for(updateRunDetails(selectedProject, runId, formData), {
      pending: "Editing run...",
      success: "Run successfully edited.",
      error: "Error editing run.",
    });
  };

  const endSelectedRun = async (runDetails: RunDetails) => {
    if (!selectedProject) return;
    const response = await ApiToast.for(endRun(selectedProject, runDetails), {
      pending: "Ending run...",
      success: "Run successfully ended.",
      error: "Error ending run.",
    });
    await getRunDetailsResponse?.refetch();
    return response;
  };

  return {
    createRun,
    downloadRun,
    deleteSelectedRuns,
    getExecutionsQuery,
    nonDeletedRuns,
    runsNavMenu,
    selectedRunDetails,
    setSelectedRunDetails,
    updateSelectedRunDetails,
    getRunDetailsResponse,
    endSelectedRun,
    datasetProfile
  };
}
