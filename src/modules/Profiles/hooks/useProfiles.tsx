import { Profile } from "../types";
import { createFormulaProfile } from "../api/createProfile";
import useSelectedProject from "../../Projects/hooks/useSelectedProject";
import { deleteProfile } from "../api/deleteProfile";
import {
  editFileProfile,
  editFileProfileFile,
  editFormulaProfile,
  uploadEditedFile,
} from "../api/editProfile";
import { getPresignedURL } from "../api/downloadProfile";
import { uploadSourceFile } from "../api/uploadProfile";
import { createSourceFileProfile } from "../api/uploadProfile";
import { ApiToast } from "../../../common/utils/ApiToast";
import { useProfilesContext } from "../context/ProfilesContext";
import { Utils } from "../../../common/utils/Utils";

type UseProfilesProject = {
  createProfile: (profile: Profile) => Promise<any>;
  removeProfiles: (profiles: Profile[]) => Promise<any>;
  editProfile: (profile: Profile, file?: any) => Promise<any>;
  downloadProfileFile: (profile: Profile) => Promise<any>;
  uploadProfileFiles: (files: File[]) => Promise<any>;
};

export function useProfiles(): UseProfilesProject {
  const { selectedProject } = useSelectedProject();
  const ctx = useProfilesContext();

  const createProfile = async (profile: Profile) => {
    if (!profile || !selectedProject?.projectid) return;
    const response = await ApiToast.for(
      createFormulaProfile(profile, selectedProject.projectid),
      {
        pending: `Creating profile...`,
        error: `Error creating profile.`,
        success: `Profile successfully created.`,
      }
    );
    ctx.query.refetch();
    return response;
  };

  const removeProfiles = async (profiles: Profile[]) => {
    const ids = profiles.map((profile) => profile.Id);
    if (!selectedProject || ids.length === 0) return;
    const response = await ApiToast.for(
      deleteProfile(selectedProject.projectid, ids),
      {
        pending: `Deleting ${ids.length} profile(s)...`,
        error: "Error deleting profiles.",
        success: `${ids.length} profile(s) successfully deleted.`,
      }
    );
    ctx.query.refetch();
    return response;
  };

  const editProfile = async (profile: Profile, file?: any) => {
    if (!profile || !selectedProject?.projectid) return;
    const editProfile = !!profile.Sourcefile
      ? editProfileWithSourceFile(selectedProject.projectid, profile, file)
      : editFormulaProfile(selectedProject.projectid, profile);
    const response = await ApiToast.for(editProfile, {
      pending: `Editing profile...`,
      error: `Error editing profile.`,
      success: `Profile successfully edited.`,
    });
    ctx.query.refetch();
    return response;
  };

  const editProfileWithSourceFile = async (
    projectId: string,
    profile: Profile,
    file?: any
  ) => {
    if (!!file) {
      const response = await editFileProfileFile(projectId, profile, file.name);
      await uploadEditedFile(file, response.data);
    }
    return editFileProfile(profile, projectId);
  };

  const downloadProfileFile = async (profile: Profile) => {
    if (!selectedProject?.projectid) return;
    const response = await ApiToast.for(
      getPresignedURL(selectedProject.projectid, profile.Id),
      {
        pending: `Downloading profile...`,
        success: `Your download will start shortly.`,
        error: `Error downloading profile.`,
      }
    );
    if (!!response.data) {
      window.open(response.data);
    }
    return response;
  };

  const uploadProfileFiles = async (files: File[]) => {
    if (!selectedProject?.projectid) return;
    await files.reduce(async (promiseChain, file, index) => {
      await promiseChain;
      const messagePrefix =
        files.length > 1
          ? `${file.name} (${index + 1}/${files.length})`
          : `${file.name}`;
      return ApiToast.for(uploadProfileFile(file), {
        pending: `${messagePrefix}: Uploading file...`,
        success: (ctx2) => {
          //ctx.query.refetch();
          ApiToast.showSimpleSuccess("Processing file.", {
            autoClose: 2000,
            delay: 500,
            hideProgressBar: false,
            closeOnClick: true,
            theme: "light",
          });
          return `File successfully uploaded.`;
        },
        error: (ctx) => {
          const responseBody = ctx.data?.response?.data as unknown as string;
          const defaultErrorMessage = `${messagePrefix}: Error uploading file.`;
          if (!responseBody) return defaultErrorMessage;
          const xmlParser = new DOMParser();
          const result = xmlParser.parseFromString(responseBody, "text/xml");
          const message = result.querySelector("Message");
          return !!message?.textContent
            ? `${messagePrefix}: ${message.textContent}`
            : defaultErrorMessage;
        },
      }).catch((e) => e);
    }, Promise.resolve() as Promise<any>);
    await Utils.sleep(3000);
    ctx.query.refetch();
  };

  const uploadProfileFile = async (file: File) => {
    if (!selectedProject?.projectid) return;
    const presignedURL = await createSourceFileProfile(
      selectedProject?.projectid,
      file
    );
    const uploadResult = await uploadSourceFile(file, presignedURL?.data);
    return uploadResult;
  };

  return {
    removeProfiles,
    createProfile,
    editProfile,
    downloadProfileFile,
    uploadProfileFiles,
  };
}
