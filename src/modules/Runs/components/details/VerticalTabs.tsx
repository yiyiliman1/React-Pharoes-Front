import { Box, Tab, Tabs, Typography, Link } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { RunDataset } from "./RunDataset";
import useSchema from "../../../Projects/hooks/useSchema";
import { useEffect, useState } from "react";
import { useRuns } from "../../hooks/useRuns";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { DataGrid } from "../../../../common/components/DataGrid";
import {DatasetFilterButton} from "./DatasetFilterButton";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      className="vertical-tab-panel-container"
      sx={{ width: "100%" }}
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, pt: 1, pb: 1 }}>
          {children}
        </Box>
      )}
    </Box>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs() {
  // STATE

  const [value, setValue] = useState(0);
  const { schema } = useSchema();
  const datasetNames = Object.keys(schema);
  const { datasetProfile } = useRuns();
  const [datasetProfileRows, setDatasetProfileRows] = useState<any>([]);
  const [datasetProfileColumns, setDatasetProfileColumns] = useState<GridColDef[]>([]);
  const [datasetProfileLoading, setDatasetProfileLoading] = useState<boolean>(true);

  useEffect(() => {
    if (datasetProfile && datasetProfile[0]) {
      const columns = Object.keys(datasetProfile[0]).map((key) => {
        return {
          field: key.toLowerCase(),
          headerName: key,
          minWidth: key === "Id" || key === "Comments" ? 300 : 150,
          flex: 1,
          renderCell: (params: any) => {
            if (params.field === "sourcefile" && params.value) {
              return (
                <Link className="is-file">
                  <InsertDriveFileOutlinedIcon />
                  {params.value}
                </Link>
              );
            }

            if (params.field === "formula" && params.value) {
              return <span className="is-formula">{params.value}</span>;
            }

            return params.value;
          },
        };
      });

      const rows = datasetProfile.map((el) => {
        const newObj = Object.fromEntries(Object.entries(el).map(([key, value]) => [key.toLowerCase(), value]));
        return newObj;
      });

      setDatasetProfileColumns(columns);
      setDatasetProfileRows(rows);
      setDatasetProfileLoading(false);
    }
  }, [datasetProfile]);

  // EVENTS

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // COMPONENT

  const tabs = datasetNames.map((name, index) => <Tab label={name} {...a11yProps(index)} key={index} />);
  tabs.push(<Tab label="Profiles" {...a11yProps(datasetNames.length)} key={datasetNames.length} />);
  const tabPanel = datasetNames.map((name, index) => (
    <TabPanel value={value} index={index} key={index}>
      <RunDataset datasetKey={name} />
    </TabPanel>
  ));
  tabPanel.push(
    <TabPanel value={value} index={datasetNames.length} key={datasetNames.length}>
      <div className="data-grid-container" style={{ height: "75vh" }}>
        <DataGrid
          data={datasetProfileRows}
          columns={datasetProfileColumns}
          loading={datasetProfileLoading}
        />
      </div>
    </TabPanel>
  );

  return (
    <Box className="pharoes-card" sx={{ flexGrow: 1, display: "flex", pr: 0 }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        {tabs}
      </Tabs>
      {tabPanel}
    </Box>
  );
}
