import { Box } from "@mui/material";
import { useNavigate } from "react-router";
import PageTitle from "../../../common/components/PageTitle";
import { DeleteButton } from "../../../common/components/SectionMenu/buttons/DeleteButton";
import { DownloadButton } from "../../../common/components/SectionMenu/buttons/DownloadButton";
import { PlayButton } from "../../../common/components/SectionMenu/buttons/PlayButton";
import { usePathParser } from "../../../common/hooks/usePathParser";
import { RunsList } from "../components/list/RunList";
import { DeleteDialog } from "../components/list/DeleteDialog";
import { useRunsContext } from "../context/RunsContext";
import { RunsPaths } from "../config/phats";
import { useRuns } from "../hooks/useRuns";

export const RunsMainPage = () => {
  const { parsePathWithCurrentProject } = usePathParser();
  const { downloadRun } = useRuns();
  const navigate = useNavigate();

  const { selection } = useRunsContext();

  const onClickPlayButton = () => {
    navigate(parsePathWithCurrentProject(RunsPaths.StartRun));
  };

  const downloadSelectedRun = () => {
    const run = selection.firstItem;
    if (!run) return;
    downloadRun(run);
  };

  const ButtonsSection = (
    <>
      <PlayButton disabled={selection.hasSelection} tooltip="Start run" onClick={onClickPlayButton} />
      <DownloadButton onClick={downloadSelectedRun} 
        tooltip="Download run" 
        disabled={!selection.hasSelection || !selection.isSingleSelection || selection.firstItem!.status === 'deleted'} />
      <DeleteDialog selectedItems={selection.items}>
        <DeleteButton disabled={!selection.hasSelection} tooltip="Delete runs" />
      </DeleteDialog>
    </>
  );

  return (
    <div>
      <PageTitle title="Runs" buttonsSection={ButtonsSection} />
      <RunsList />
    </div>
  );
};
