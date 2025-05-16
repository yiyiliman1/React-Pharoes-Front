import { Alert, AlertTitle, Button, CircularProgress, IconButton, LinearProgress, Stack, Tooltip, Typography } from "@mui/material"
import { ScrollTo, ScrollToRef } from "../../../../../common/components/ScrollTo";
import { useRunProgress } from "../../../hooks/useRunProgress";
import { useRuns } from "../../../hooks/useRuns";
import { RunDetails } from "../../../types";
import { RunForm } from "../../startRun/RunForm";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useEffect, useRef } from "react";
import { useParams } from "react-router";

const REFETCH_INTERVAL = 5000;

export const SetupTab: React.FC<{ runDetails: RunDetails }> = ({ runDetails }) => {
  const { runId } = useParams();

  const scrollToBottomRef = useRef<ScrollToRef>();
  const scrollToTopRef = useRef<ScrollToRef>();

  const { updateSelectedRunDetails, endSelectedRun } = useRuns();
  const { progressQuery } = useRunProgress();

  const isLoading = progressQuery.isLoading;
  const isFetching = progressQuery.isFetching;
  const queryError = progressQuery.error;

  const defaultValues = {
    name: "Loading...",
    execution: "Loading...",
    maxTime: "Loading...",
    tolerance: "Loading...",
  };

  useEffect(() => {
    const refetchExecution = setInterval(() => {
      progressQuery.refetch();
    }, REFETCH_INTERVAL);
    return () => clearInterval(refetchExecution);
  }, [])

  useEffect(() => {
    scrollToBottomRef.current?.scroll("auto");
  }, [runId, progressQuery.data])

  const handleStopRun = async () => {
    await endSelectedRun(runDetails);
    progressQuery.refetch();
  };

  function LoadingComponent() {
    return (
      <div className="setup-tab__log-loading">
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className="setup-tab">
      <div className="setup-tab__form">
        <RunForm
          edit
          running={runDetails.status === "Running"}
          runDetails={runDetails}
          onEnd={handleStopRun}
          onSubmit={updateSelectedRunDetails}
          defaultValues={defaultValues}
        />
      </div>
      <Stack className="setup-tab__log">
        <div className="setup-tab__log-content-title-wrap">
          <Stack className="setup-tab__log-content-title" direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="button">Progress log</Typography>
            <Stack spacing={1} direction="row" alignItems="center" justifyContent="flex-end">
              <ScrollTo selector="#log-container" ref={scrollToTopRef}>
                <Tooltip title="Go to start">
                  <IconButton size="small">
                    <KeyboardArrowUpIcon />
                  </IconButton>
                </Tooltip>
              </ScrollTo>
              <ScrollTo selector="#log-container" threshold={-1} toBottom ref={scrollToBottomRef}>
                <Tooltip title="Go to end">
                  <IconButton size="small">
                    <KeyboardArrowDownIcon />
                  </IconButton>
                </Tooltip>
              </ScrollTo>
            </Stack>
          </Stack>
          { (isFetching && !isLoading) && <LinearProgress className="logs-loading-indicator" variant="indeterminate" /> }
        </div>
        <div className="setup-tab__log-content" id="log-container">
          { isLoading && LoadingComponent() }
          { !!queryError && 
            <Alert severity="error" 
              action={
                <Button size="small" color="inherit" onClick={() => progressQuery.refetch()}>Try again</Button>
              }>
              <AlertTitle>Progress log error</AlertTitle>
              { queryError.message }
            </Alert> 
          }
          { (!queryError && !isLoading) && <pre>{ progressQuery.data }</pre>  }
        </div>
      </Stack>
    </div>
  );
};
