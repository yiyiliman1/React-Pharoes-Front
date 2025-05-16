import { DatasetProvider } from "../../../Dataset/context/DatasetContext";
import { DatasetTable } from "../../../Dataset/components/DatasetTable";
import { useParams } from "react-router";
import {DatasetFilterButton} from "./DatasetFilterButton";


export const RunDataset = ({ datasetKey }: any) => {
  const params = useParams();
  const currentRunId = params?.runId;

  return (
    <DatasetProvider datasetKey={datasetKey} currentRunId={currentRunId}>
      <div className={'data-container'}>
        <div className={'filter-button-container'}>
          <DatasetFilterButton/>
        </div>
      <DatasetTable datasetKey={datasetKey} />
      </div>
    </DatasetProvider>
  );
};
