import { DataGrid } from '../../../../common/components/DataGrid'
import { RelatedExecutionCell } from './RelatedExecutionCell';
import { useRunsContext } from '../../context/RunsContext';
import { Utils } from '../../../../common/utils/Utils';
import { useRuns } from '../../hooks/useRuns';
import { Chip } from '@mui/material';
import { useEffect } from "react";

type Props = {}

export const RunsList = (props: Props) => {
  const { getExecutionsQuery } = useRuns();
  const ctx = useRunsContext();

  useEffect(() => {
    ctx.query.refetch();
    getExecutionsQuery.refetch();
  }, []);

  const formattedRuns = (ctx.query.data || []).map(Run => {
    return {
      runid: Run.runid,
      name: Run.name,
      created: Run.created?.split('T')[0],
      executionid: Run.executionid,
      tolerance: Run.tolerance,
      status: Run.status,
      timeelapsed: Run.timeelapsed,
      consumption: Run.consumption,
      timemax: Run.timemax
    }
  })

  function StatusChip(status: string) {
    const formattedStatus = Utils.toSentenceCase(status);
    switch (status) {
      case "Running": return <Chip size='small' variant='outlined' label={formattedStatus} color="success" />
      case "deleted": return <Chip size='small' variant='outlined' label={formattedStatus} color="error" />
      case "ended": return <Chip size='small' variant='outlined' label={formattedStatus} color="warning" />
    }
  }

  return (
    <DataGrid
      className='runs-table'
      data={formattedRuns}
      onChangeSelectedItems={ctx.selection.selectItems}
      paginatedQuery={ ctx }
      idName={"runid"}
      noDataText="There are no runs."
      loadingText="Loading runs..."
      columns={
        [
          { field: 'name', headerName: 'Name', flex: 1, minWidth: 135, sortable: false },
          { field: 'status', headerName: 'Status', flex: 1, minWidth: 110, sortable: false, renderCell: params => {
            return StatusChip(params.value)
          }},
          { field: 'executionid', headerName: 'Execution', flex: 1, minWidth: 110, sortable: false, renderCell: params => {
            return <RelatedExecutionCell uuid={params.value} query={getExecutionsQuery} />
          }},
          { field: 'tolerance', headerName: 'Tolerance', flex: 0, minWidth: 120, sortable: false },
          { field: 'timeelapsed', headerName: 'Time', flex: 0, minWidth: 90, sortable: false },
          { field: 'consumption', headerName: 'CPU (Minutes)', flex: 0, minWidth: 120, sortable: false },
          { field: 'timemax', headerName: 'Max. Time', flex: 0, minWidth: 100, sortable: false },
          { field: 'created', headerName: 'Created', flex: 0, type: 'time', minWidth: 120, sortable: false, headerAlign: "right", align: "right" },
        ]
    }/>
  )
}