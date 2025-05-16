import { useState } from 'react';
import { DataGrid } from '../../../common/components/DataGrid';
import useAccountRuns from '../hooks/useAccountRuns';
import useProjects from '../../Projects/hooks/useProjects';

type Props = {};

export const RunsList = (props: Props) => {
  const [page, setPage] = useState<number>(0);
  const [cursor, setCursor] = useState<string>('');
  let { accountRuns } = useAccountRuns(cursor);
  const { projects } = useProjects();

  const handlePageChange = (newPage: number) => {
    if (newPage > page && accountRuns.Cursor.has_next) {
      setCursor(accountRuns.Cursor.next || '');
    }

    if (accountRuns.Cursor.has_prev) {
      setCursor(accountRuns.Cursor.prev!);
    }
    setPage(page);
  };

  const formattedRuns = accountRuns.Data.map((accountRun) => {
    return {
      runid: accountRun.runid,
      name: accountRun.name,
      projectname: projects?.find(
        (project) => project.projectid === accountRun.projectid
      )?.name,
      created: accountRun.created?.split('T')[0],
      executionid: accountRun.executionid,
      tolerance: accountRun.tolerance,
      status: accountRun.status?.toUpperCase(),
      timeelapsed: accountRun.timeelapsed,
      consumption: accountRun.consumption,
      timemax: accountRun.timemax,
    };
  });

  return (
    <DataGrid
      handlePageChange={handlePageChange}
      data={formattedRuns}
      pageSize={10}
      totalRows={accountRuns.Cursor.amount}
      withSelection={false}
      idName={'runid'}
      columns={[
        {
          field: 'name',
          headerName: 'EXECUTION NAME',
          flex: 1,
          minWidth: 170,
          sortable: false,
        },
        {
          field: 'projectname',
          headerName: 'PROJECT',
          flex: 1,
          minWidth: 120,
          sortable: false,
        },
        {
          field: 'tolerance',
          headerName: 'TOLERANCE',
          flex: 0,
          minWidth: 120,
          sortable: false,
        },
        {
          field: 'created',
          headerName: 'DATE',
          flex: 0,
          type: 'time',
          minWidth: 120,
          sortable: false,
        },
        {
          field: 'status',
          headerName: 'STATUS',
          flex: 0,
          minWidth: 120,
          sortable: false,
        },
        {
          field: 'timeelapsed',
          headerName: 'TIME',
          flex: 0,
          minWidth: 100,
          sortable: false,
        },
        {
          field: 'consumption',
          headerName: 'CPU (minutes)',
          flex: 0,
          minWidth: 120,
          sortable: false,
        },
        {
          field: 'timemax',
          headerName: 'MAX. TIME',
          flex: 0,
          minWidth: 100,
          sortable: false,
        },
      ]}
    />
  );
};
