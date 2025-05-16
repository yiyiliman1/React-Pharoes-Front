import { Chip, CircularProgress, Tooltip } from "@mui/material";
import { Utils } from "../../../common/utils/Utils";
import { DatasetRelatedValues } from "../context/DatasetContext";

type Props = {
  uuid: string;
  category: string;
  relValues?: DatasetRelatedValues;
  loading?: boolean;
}

export function RelatedValueCell({ uuid, category, relValues, loading }: Props) {
  const categoryValues = relValues?.[category]
  const relatedValue = categoryValues?.[uuid];
  const formattedCategory = Utils.toSentenceCase(category);
  
  const isLoading = loading ?? false;
  
  if (!!relatedValue) {
    const tooltip = `${formattedCategory} ID: ${uuid}`;
    return (
      <Tooltip title={tooltip} placement="top" arrow> 
        <Chip variant="outlined" size="small" label={relatedValue} /> 
      </Tooltip>
    )
  }

  const tooltip = `${formattedCategory} ID`;
  return (
    <Tooltip title={tooltip} placement="top-start" arrow>
      <span className="related-value-reference">
        { isLoading && <CircularProgress size={10} sx={{ mr: .8 }} /> }
        { uuid }
      </span>
    </Tooltip>
  )
}