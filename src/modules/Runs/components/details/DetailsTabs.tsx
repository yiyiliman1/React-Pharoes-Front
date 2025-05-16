import { Alert, Box, Button, CircularProgress, Tab } from "@mui/material";
import { useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { SetupTab } from "./tabs/SetupTab";
import { DatasetTab } from "./tabs/DatasetTab";
import { ResultTab } from "./tabs/ResultTab";
import { MapTab } from "./tabs/MapTab";
import { useRuns } from "../../hooks/useRuns";
import { QueryError } from "../../../../common/hooks/usePaginatedQuery";
import {NavMenuItemConfig} from "../../../../common/types";

type Props = {
  tab: string
  setTab: (tab: string) => void
};

export const DetailsTabs = ({tab, setTab}: Props) => {
  const { selectedRunDetails, getRunDetailsResponse } = useRuns();
  const { error, refetch, isLoading } = getRunDetailsResponse;

  const queryError = !!error ? QueryError.fromError(error) : undefined;

  const handleChange = (event: React.SyntheticEvent<Element, Event>, newValue: any) => {
    setTab(newValue);
  };

  function ErrorComponent() {
    if (!queryError) return <></>
    else return (
      <Alert 
        severity='error' 
        action={
          <Button size='small' color='inherit' onClick={() => refetch()}>Try again</Button>
        }>{ queryError.message }</Alert>
    )
  }

  function LoadingComponent() {
    return (
      <div style={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
        <CircularProgress sx={{ marginTop: "2rem" }} />
      </div>
    )
  }

  return (
    <div className="details-tabs">
      { !!queryError && ErrorComponent() }
      { (isLoading && !queryError) && LoadingComponent() }
      { (!isLoading && !queryError && !!selectedRunDetails) && 
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={tab}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="SETUP" value="1" />
                <Tab label="DATASET" value="2" />
                <Tab label="RESULTS" value="3" />
                <Tab label="MAP" value="4" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <SetupTab runDetails={selectedRunDetails} />
            </TabPanel>
            <TabPanel value="2">
              <DatasetTab />
            </TabPanel>
            <TabPanel value="3">
              <ResultTab runDetails={selectedRunDetails} />
            </TabPanel>
            <TabPanel value="4">
              <MapTab projectId={selectedRunDetails?.projectid} runId={selectedRunDetails?.runid} />
            </TabPanel>
          </TabContext>
        </Box> 
      }
    </div>
  );
};
