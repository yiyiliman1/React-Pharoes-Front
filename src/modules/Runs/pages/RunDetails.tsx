import PageTitle from "../../../common/components/PageTitle";
import { DetailsTabs } from "../components/details/DetailsTabs";
import { DatasetFilterButton } from "../components/details/DatasetFilterButton"
import {useState} from "react";



export const RunDetailsPage = () => {
    const [tab, setTab] = useState<string>("1");
  return (
    <div>
        <div className={'details-container'}>
            <PageTitle title="Run details" />
        </div>
      <DetailsTabs tab={tab} setTab={setTab}/>
    </div>
  );
};
