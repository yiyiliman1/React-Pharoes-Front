import { Chip, CircularProgress, Tooltip } from "@mui/material";
import { UseQueryResult } from "react-query";
import { Execution } from "../../types";

type Props = {
  uuid: string;
  query: UseQueryResult<Execution[]>;
}

export function RelatedExecutionCell({ uuid, query }: Props) {
  const execution = query.data?.find(e => e.id === uuid);
  
  if (!!execution) {
    return (
      <Tooltip title={`Execution ID: ${uuid}`} placement="top" arrow> 
        <Chip variant="outlined" size="small" label={execution.name} /> 
      </Tooltip>
    )
  }

  return (
    <Tooltip title="Execution ID" placement="top-start" arrow>
      <span className="related-value-reference">
        { query.isLoading && <CircularProgress size={10} sx={{ mr: .8 }} /> }
        { uuid }
      </span>
    </Tooltip>
  )
}