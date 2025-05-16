import { useRunResults } from "../../../hooks/useRunResults";
import { QsResultsDashboard } from "../QsResultsDashboard";
import { RunDetails } from "../../../types";

type Props = {
  runDetails: RunDetails;
};

export const ResultTab = ({ runDetails }: Props) => {
  const { resultsQuery } = useRunResults();

  return (
    <div className="result-tab">
      <QsResultsDashboard
        data={resultsQuery.data}
        loading={resultsQuery.fetching}
        error={resultsQuery.error}
        runDetails={runDetails}
      />
    </div>
  );
};
