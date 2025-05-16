import { QueryError } from "../../../../common/hooks/usePaginatedQuery";
import {
  Alert,
  CircularProgress,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";
import {
  createEmbeddingContext,
  EmbeddingContext,
  DashboardExperience,
} from "amazon-quicksight-embedding-sdk";
import { useEffect, useState } from "react";
import {
  RunDetails,
  StageDropDownAPIResponse,
  QuickSightResultAPIResponse,
} from "../../types";

//DropDown
import { SelectValues } from "../../../Runs/components/form/SelectValues";
import { FormControl, InputLabel } from "@mui/material";

type Props = {
  data?: QuickSightResultAPIResponse;
  loading?: boolean;
  error?: QueryError;
  runDetails: RunDetails;
};

export function QsResultsDashboard(props: Props) {
  //New
  const [embeddedDashboard, setEmbeddedDashboard] =
    useState<DashboardExperience>(null);
  const [dashboardUrl, setDashboardUrl] = useState<string>("");
  const [dashboardIds, setDashboardIds] = useState<[string, string]>(["", ""]);
  const [embeddingContext, setEmbeddingContext] =
    useState<EmbeddingContext>(null);
  ///
  const [stagesDropDown, setDropDownStages] = useState<string[][]>([["", ""]]);
  const [selectedDashboard, setSelectedDashboard] =
    useState<string>("Overview");

  const { data, loading, error, runDetails } = props;

  const [initializing, setInitializing] = useState(true);
  const [dashboardError, setDashboardError] = useState<any>();

  const isLoading = (loading ?? false) || initializing;
  const qsDashError = error || dashboardError;

  const prepareStages = (input: [StageDropDownAPIResponse]) => {
    const stages = [];
    for (const stage of input) {
      stages.push([`Run_${stage.LastRun}`, stage.Name]);
    }
    return stages;
  };

  useEffect(() => {
    if (props.error) {
      setDashboardUrl("");
      setEmbeddingContext(null);
      setEmbeddedDashboard(null);
    }
    setDashboardError(props.error);
  }, [props.error]);

  useEffect(() => {
    setInitializing(true);
  }, [props.runDetails]);

  useEffect(() => {
    console.log("In data effect: ", props);
    if (
      props.data &&
      props.data["dashboard_url"] !== dashboardUrl &&
      props.loading === false
    ) {
      setInitializing(false);
      setDashboardUrl(props.data["dashboard_url"]);
      setDashboardIds(props.data["dashboard_Ids"]);
      setDropDownStages(prepareStages(JSON.parse(props.data["stages"])));
    }
  }, [props.data, props.loading]);

  const createContext = async () => {
    if (!embeddingContext) {
      const context = await createEmbeddingContext();
      setEmbeddingContext(context);
    }
  };

  useEffect(() => {
    console.log("In dashboardUrl: ", dashboardUrl);
    if (dashboardUrl) {
      createContext();
    }
  }, [dashboardUrl]);

  useEffect(() => {
    console.log("In embedding Context: ", dashboardUrl);
    if (embeddingContext) {
      embed();
      setInitializing(false);
    }
  }, [embeddingContext]);

  const embed = async () => {
    const options = {
      url: dashboardUrl,
      container: "#dashboard",
      height: "650vh",
      resizeHeightOnSizeChangedEvent: true,

      /*
      parameters: [
        {
          Name: "projectid",
          Values: [runDetails.projectid],
        },
        {
          Name: "runid",
          Values: [runDetails.runid],
        },
      ],*/
      /*onChange: (changeEvent, metadata) => {
        
        console.log(changeEvent);
        switch (changeEvent.eventName) {
          case "FRAME_MOUNTED": {
            console.log("Do something when the experience frame is mounted.");
            break;
          }
          case "FRAME_LOADED": {
            console.log("Do something when the experience frame is loaded.");
            break;
          }
        }
      },*/
    };
    /*
    const contentOptions = {
      parameters: [
        {
          Name: "country",
          Values: ["United States"],
        },
        {
          Name: "states",
          Values: ["California", "Washington"],
        },
      ],

      onMessage: async (messageEvent, experienceMetadata) => {
        switch (messageEvent.eventName) {
          case "CONTENT_LOADED": {
            console.log(
              "All visuals are loaded. The title of the document:",
              messageEvent.message.title
            );
            break;
          }
          case "ERROR_OCCURRED": {
            console.log(
              "Error occurred while rendering the experience. Error code:",
              messageEvent.message.errorCode
            );
            break;
          }
          case "PARAMETERS_CHANGED": {
            console.log(
              "Parameters changed. Changed parameters:",
              messageEvent.message.changedParameters
            );
            break;
          }
          case "SELECTED_SHEET_CHANGED": {
            console.log(
              "Selected sheet changed. Selected sheet:",
              messageEvent.message.selectedSheet
            );
            break;
          }
          case "SIZE_CHANGED": {
            console.log("Size changed. New dimensions:", messageEvent.message);
            break;
          }
          case "MODAL_OPENED": {
            window.scrollTo({
              top: 0, // iframe top position
            });
            break;
          }
        }
      },
    };
*/
    var parameterOptions = {
      parameters: [
        {
          Name: "projectid",
          Values: [`project-${runDetails.projectid}`],
        },
        {
          Name: "runid",
          Values: [`run-${runDetails.runid}`],
        },
        {
          Name: "stage",
          Values: [stagesDropDown[0][0]],
        },
      ],
    };
    const newEmbeddedDashboard = await embeddingContext.embedDashboard(
      options,
      parameterOptions
    );

    setEmbeddedDashboard(newEmbeddedDashboard);
  };
  const onChangeSelect = (event: any) => {
    console.log(event);
    embeddedDashboard.setParameters([
      {
        Name: "projectid",
        Values: [`project-${runDetails.projectid}`],
      },
      {
        Name: "runid",
        Values: [`run-${runDetails.runid}`],
      },
      {
        Name: "stage",
        Values: event,
      },
    ]);
  };

  const onDashboardSelect = (event: any) => {
    setSelectedDashboard(event.target.value);
    var parameterOptions = {
      parameters: [
        {
          Name: "projectid",
          Values: [`project-${runDetails.projectid}`],
        },
        {
          Name: "runid",
          Values: [`run-${runDetails.runid}`],
        },
        {
          Name: "stage",
          Values: [stagesDropDown[0][0]],
        },
      ],
    };
    if (embeddedDashboard) {
      if (event.target.value == "Overview") {
        embeddedDashboard.navigateToDashboard(
          dashboardIds[0],
          parameterOptions
        );
      } else {
        embeddedDashboard.navigateToDashboard(
          dashboardIds[1],
          parameterOptions
        );
      }
    }
    //console.log("Dashboard changed");
  };

  return (
    <Stack
      spacing={1}
      sx={{ minHeight: "30rem" }}
      className="qs-results-dashboard"
    >
      <span style={{ display: "none" }}>
        (Temporary Info that will be removed): ProjectId: {runDetails.projectid}{" "}
        RunId: {runDetails.runid}
      </span>
      <div>
        <div
          style={{ maxWidth: "50%", minWidth: "40%", display: "table-cell" }}
        >
          <span style={{ padding: "15px" }}>
            <FormControl
              fullWidth
              size="small"
              disabled={initializing || !!dashboardError}
            >
              <InputLabel>Dashboard</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedDashboard}
                label="Dashboard"
                onChange={onDashboardSelect}
                size="small"
              >
                <MenuItem value={"Overview"}>Overview</MenuItem>
                <MenuItem value={"Detail"}>Detail</MenuItem>
              </Select>
            </FormControl>
          </span>
        </div>
        <div style={{ maxWidth: "50%", display: "table-cell" }}>
          {!isLoading && selectedDashboard === "Detail" && (
            <span style={{ padding: "15px", marginLeft: "10px" }}>
              <FormControl fullWidth size="small">
                <InputLabel>Stage</InputLabel>
                <SelectValues
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  onChange={(event: any) => onChangeSelect(event.target.value)}
                  category={"Stages"}
                  config={{ name: "Stage", label: "Stage" }}
                  defaultValue={stagesDropDown[0][0]}
                  rawFilters={{}}
                  stages={stagesDropDown}
                />
              </FormControl>
            </span>
          )}
        </div>
      </div>
      {/*
        <span>
          <label htmlFor="country">Stage</label>
          <select id="country" name="country">
            <option value="Stage1">Stage1</option>
            <option value="Stage2">Stage2</option>
          </select>
        </span>
  */}

      {!!qsDashError && <Alert severity="error">{qsDashError.message}</Alert>}
      {initializing && !dashboardError && (
        <CircularProgress className="loading-indicator" />
      )}
      {!initializing && !dashboardError && (
        <div id="dashboard" style={{ minHeight: "100%" }} />
      )}
    </Stack>
  );
}
