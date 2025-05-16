import { AddButton } from "../../../common/components/SectionMenu/buttons/AddButton";
import { UploadButton } from "../../../common/components/SectionMenu/buttons/UploadButton";
import PageTitle from "../../../common/components/PageTitle";
import ProjectFormDialog from "./ProjectFormDialog";
import useProjects from "../hooks/useProjects";

type Props = {};

export const ProjectListTitle = (props: Props) => {
  const { createNewProject, uploadProjects } = useProjects();

  const ButtonsSection = (
    <>
      <ProjectFormDialog confirmButtonLabel="Create" onSave={createNewProject}>
        <AddButton tooltip="Create project" />
      </ProjectFormDialog>
      <UploadButton
        resetAfterFire
        accept={".json,.csv"}
        tooltip="Upload project"
        onChange={uploadProjects}
      />
    </>
  );

  return (
    <>
      <PageTitle title="All projects" buttonsSection={ButtonsSection}>
        <p>Chose the project you want to work on:</p>
      </PageTitle>
    </>
  );
};
