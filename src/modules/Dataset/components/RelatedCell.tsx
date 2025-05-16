import { CircularProgress } from '@material-ui/core'
import { useRelatedField } from '../hooks/useRelatedField'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Button, Chip, IconButton, Tooltip } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';

interface Props {
  field: string
  value: string
}

export const RelatedCell = ({ field, value }: Props) => {
  const { data, loading, fetching, error, refetch } = useRelatedField(field);
  
  function ErrorIcon() {
    return (
      <Tooltip title={error.message || 'An error occurred.'} placement="top">
        <ErrorOutlineIcon color="error" sx={{ fontSize: "14px", mr: "4px", mt: "1px" }} />
      </Tooltip>
    )
  }

  function ErrorButton() {
    return (
      <Tooltip title={error.message || 'An error occurred.'} placement="top">
        <IconButton color="error" size="small" sx={{ minWidth: "auto", fontSize: "14px", mr: "3px", mb: "2px"}} onClick={refetch}>
          <ReplayIcon fontSize='inherit' />
        </IconButton>
      </Tooltip>
    )
  }

  function ErrorButtonWithText() {
    return (
      <Tooltip title={error.message || 'An error occurred.'} placement="top">
        <Button color="error" size="small" sx={{ minWidth: "auto", fontSize: "10px", mr: "4px"}} onClick={refetch}>
          <ReplayIcon fontSize='inherit' sx={{ mr: "2px", mb: "1px" }} />
          <span>Retry</span>
        </Button>
      </Tooltip>
    )
  }

  function LoadingComponent() {
    return <CircularProgress size={10} style={{ marginRight: "6px" }}/>
  }

  return (
    <span>
      { !!error
        ? ErrorButton() 
        : fetching && !data[value]
          ? LoadingComponent() 
          : null 
      }
      { !!data[value] 
        ? (<Tooltip title={value} placement="top" arrow>
            <Chip 
              variant='outlined' 
              size='small'
              label={data[value]}
              avatar={ loading ? <CircularProgress size={10} style={{ marginLeft: "6px" }}/> : undefined } />
          </Tooltip>)
        : <span className='related-value-reference'>{ value }</span>
      }
    </span>
  )
}