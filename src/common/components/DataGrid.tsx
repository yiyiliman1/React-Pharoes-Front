import { DataGridPro as MuiDataGrid, useGridApiContext, GridRowId, GridColumns } from "@mui/x-data-grid-pro";
import { Alert, Button, LinearProgress, TablePagination } from '@mui/material';
import { PaginatedQuery } from '../hooks/usePaginatedQuery';
import InboxIcon from '@mui/icons-material/Inbox';
import { isNil } from 'lodash';

type Props = {
  data: any[]
  columns: GridColumns
  page?: number;
  height?: string
  idName?: string
  className?: string
  pageSize?: number
  totalRows?: number
  loading?: boolean
  rowHeight?: number
  paginatedQuery?: PaginatedQuery<unknown>
  withSelection?: boolean
  loadingText?: string
  noDataText?: string
  handlePageChange?: (page: number) => void
  onChangeSelectedItems?: (itemsId: any[]) => any
}

export const DataGrid = ({ page, noDataText, rowHeight, loadingText, paginatedQuery, className, loading, data, columns, height, pageSize, totalRows, handlePageChange, withSelection, onChangeSelectedItems, ...props }: Props) => {
  const idName = props.idName || 'id'
  const headerHeight = 56;
  const cellsHeight = rowHeight ?? 48;
  const rowsPerPage = pageSize ?? 10;

  const checkboxSelection = isNil(withSelection) ? true : withSelection;
  const containerStyle = {
    height: height || 'auto',
  }

  const isFetching = (loading || paginatedQuery?.query.fetching) ?? false;
  const isLoading = (loading || paginatedQuery?.query.loading) ?? false;

  const onSelectedChange = (itemsId: GridRowId[]) => {
    if (!onChangeSelectedItems) return
    const items = itemsId.map(id => data.find(item => item[idName] === id))
    onChangeSelectedItems(items)
  }

  function CustomPagination() {
    const pagination = paginatedQuery!.pagination;
    const loading = paginatedQuery!.query.fetching;
    const apiRef = useGridApiContext();
    const page = pagination.page;
    const total = pagination.total;
    const hasNext = !!pagination.tokens.next;
    const hasPrev = !!pagination.tokens.previous;

    return (
      <TablePagination
        component="div"
        size="medium"
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[rowsPerPage]}
        count={total}
        backIconButtonProps={{ disabled: loading || !hasPrev }}
        nextIconButtonProps={{ disabled: loading || !hasNext }}
        page={page}
        onPageChange={(event, newPage) => {
          if (newPage > pagination!.page) pagination!.next();
          else pagination!.previous();
          apiRef.current.setPage(newPage);
        }}
      />
    );
  }

  function CustomLoadingOverlay() {
    return (
      <div className='loading-overlay'>
        { (isLoading || data.length === 0) && <span className='loading-text'>{ loadingText || 'Loading...' }</span> }
        <LinearProgress 
          variant='indeterminate'
          style={{
            width: "100%",
            position: "absolute",
            marginTop: `${headerHeight}px`
          }} />
      </div>
    )
  }

  function CustomNoRowsOverlay() {
    return (
      <div>{
        !!paginatedQuery?.query.error 
          ? (<Alert 
              className='query-error-overlay' 
              variant='standard'
              severity="error"
              action={
                <Button 
                  color='inherit' 
                  variant='text'
                  size='small' 
                  onClick={paginatedQuery!.query.refetch}>
                  <span>Try again</span>
                </Button>
              }>
              { (paginatedQuery!.query.error as any)!.message }
            </Alert>)
          : (<div className='no-rows-overlay'>
              <InboxIcon />
              <span>{ noDataText || 'No data.' }</span>
            </div>)
      }</div>
    )
  }

  return (
    <div className='data-grid-container' style={containerStyle}>
      <MuiDataGrid
        disableColumnFilter
        autoHeight
        className={className}
        getRowId={(row) => row[idName]}
        rows={isLoading ? [] : data}
        headerHeight={headerHeight}
        page={page ?? 0}
        rowCount={totalRows}
        columns={isLoading ? [] : columns}
        rowHeight={cellsHeight}
        loading={isLoading || isFetching}
        rowsPerPageOptions={[rowsPerPage]}
        components={{
          LoadingOverlay: CustomLoadingOverlay,
          Pagination: !!paginatedQuery ? CustomPagination : undefined,
          NoRowsOverlay: CustomNoRowsOverlay
        }}
        paginationMode="server"
        onPageChange={(page) => handlePageChange && handlePageChange(page)}
        checkboxSelection={checkboxSelection}
        disableSelectionOnClick
        pagination
        pageSize={rowsPerPage}
        onSelectionModelChange={onSelectedChange}
      />
    </div>
  )
}