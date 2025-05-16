import { UseQueryResult, useQuery } from "react-query";
import { useEffect, useState } from "react";
import { createProject } from "../api/createProject";
import { AxiosResponse } from "axios";
import { Project } from "../types";
import { deleteProject } from "../api/deleteProject";
import { duplicateProject } from "../api/duplicateProject";
import { getProjects } from "../api/getProjects";
import { getPresignedURL } from "../api/downloadProject";
import { editProject } from "../api/editProject";
import { createUploadProject, uploadFile } from "../api/uploadProject";
import {
  uploadSourceFile,
  createSourceFileProfile,
} from "../../Profiles/api/uploadProfile";
import { ApiToast } from "../../../common/utils/ApiToast";
import { Utils } from "../../../common/utils/Utils";
import { time } from "console";

export interface UseProjects {
  projects: Project[];
  getProjectResponse: UseQueryResult<AxiosResponse<string> | undefined>;
  duplicateSelectedProject: (project: Project) => Promise<any>;
  deleteSelectedProject: (project: Project) => Promise<any>;
  createNewProject: (project: Project) => Promise<any>;
  editSelectedProject: (project: Project) => Promise<any>;
  downloadSelectedProject: (project: Project) => Promise<any>;
  uploadProjects: (files: File[]) => Promise<void>;
}

export default function useProjects(): UseProjects {
  const [projects, setProjects] = useState<Project[]>([]);
  const getProjectResponse = useQuery("getProjects", getProjects);

  useEffect(() => {
    if (!getProjectResponse.data?.data) return;
    setProjects(JSON.parse(getProjectResponse.data.data));
  }, [getProjectResponse.data]);

  const duplicateSelectedProject = async (project: Project) => {
    if (!project) return;
    const response = await ApiToast.for(duplicateProject(project.projectid), {
      pending: "Duplicating project...",
      success: "Project successfully duplicated.",
      error: "Error duplicating project.",
    });
    getProjectResponse?.refetch();
    return response;
  };

  const deleteSelectedProject = async (project: Project) => {
    if (!project) return;
    const response = await ApiToast.for(deleteProject(project.projectid), {
      pending: "Deleting project...",
      success: "Project successfully deleted.",
      error: "Error deleting project.",
    });
    getProjectResponse?.refetch();
    return response;
  };

  const createNewProject = async (project: Project) => {
    if (!project) return;
    const response = await ApiToast.for(createProject(project), {
      pending: "Creating project...",
      success: "Project successfully created.",
      error: "Error creating project.",
    });
    getProjectResponse?.refetch();
    return response;
  };

  const editSelectedProject = async (project: Project) => {
    if (!project) return;
    const response = await ApiToast.for(editProject(project), {
      pending: "Editing project...",
      success: "Project successfully edited.",
      error: "Error editing project.",
    });
    getProjectResponse?.refetch();
    return response;
  };

  const downloadSelectedProject = async (project: Project) => {
    if (!project) return;
    const response = await ApiToast.for(getPresignedURL(project.projectid), {
      pending: "Downloading project...",
      success: "Your download will start shortly.",
      error: "Error downloading project.",
    });
    if (!!response.data) {
      window.open(response.data);
    }
    return response;
  };

  const uploadProjects = async (files: File[]) => {
    let jsonFiles = files.filter(function (file) {
      return file.type === "application/json";
    });
    //Check if we have exactly one JSON file, cancel if not
    if (jsonFiles.length !== 1) {
      return ApiToast.showSimpleError("There has to be exactly one JSON file", {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    }
    let csvFiles = files.filter(function (file) {
      return file.type === "text/csv";
    });
    //Create New Upload project
    const createUploadProjectResponse = await createUploadProject();
    const newProjectUUID = createUploadProjectResponse?.data?.fields.key
      .split("/")[1]
      .substring(8);
    console.log(newProjectUUID);
    //Upload the new Project File
    ApiToast.for(
      uploadProject(jsonFiles[0], createUploadProjectResponse),
      {
        pending: `${jsonFiles[0].name} : Uploading file...`,
        success: (ctx) => {
          getProjectResponse?.refetch();
          ApiToast.showSimpleSuccess("Processing file.", {
            autoClose: 2000,
            delay: 500,
            hideProgressBar: false,
            closeOnClick: true,
            theme: "light",
          });
          return `${jsonFiles[0].name}: File successfully uploaded.`;
        },
        error: `${jsonFiles[0].name}: Error uploading file.`,
      },
      { autoClose: 2000 }
    ).catch((e) => e);
    await Utils.sleep(3000);
    if (csvFiles.length > 0) {
      await csvFiles.reduce(async (promiseChain, file, index) => {
        await promiseChain;
        const messagePrefix =
          csvFiles.length > 1
            ? `${file.name} (${index + 1}/${csvFiles.length})`
            : `${file.name}`;
        return ApiToast.for(
          uploadProfileFile(file, newProjectUUID),
          {
            pending: `${messagePrefix}: Uploading profile file...`,
            success: `${messagePrefix}: Profile File successfully uploaded.`,
            error: `${messagePrefix}: Error uploading file.`,
          },
          { autoClose: 2000 }
        ).catch((e) => e);
      }, Promise.resolve() as Promise<any>);
      /* the time it takes to save uploaded projects before refetching */

      await Utils.sleep(2000);
    }
    getProjectResponse?.refetch();
  };

  const uploadProject = async (file: File, response: any) => {
    //const response = await createUploadProject();
    return uploadFile(file, response?.data);
  };

  const uploadProfileFile = async (file: File, projectId: string) => {
    const presignedURL = await createSourceFileProfile(projectId, file);
    const uploadResult = await uploadSourceFile(file, presignedURL?.data);
    return uploadResult;
  };

  return {
    projects,
    getProjectResponse,
    duplicateSelectedProject,
    deleteSelectedProject,
    createNewProject,
    editSelectedProject,
    downloadSelectedProject,
    uploadProjects,
  };
}
