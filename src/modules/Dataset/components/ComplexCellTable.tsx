import _, { isEmpty, keys, merge } from 'lodash'
import { DataGrid } from '../../../common/components/DataGrid'
import { GridRenderCellParams, GridColumns } from '@mui/x-data-grid-pro'
import { RelatedCell } from './RelatedCell'
import { useDataTransform } from '../hooks/useDataTransform'
import dayjs from 'dayjs'
import { RelatedValueCell } from './RelatedValueCell'
import { useDatasetContext } from '../context/DatasetContext'
import {ComplexCell} from "./ComplexCell";

interface Props {
  cellParams: GridRenderCellParams<any>
  schema: any
}

export const ComplexCellTable = ({ cellParams, schema }: Props) => {
  const { relValuesQuery } = useDatasetContext();
  const { transform } = useDataTransform()

  const relvaluesLoading = relValuesQuery.loading;
  
  // DATA
  const dataRaw = transform(cellParams.value, schema.Type, {}, schema.Category )
  const data = dataRaw.map((item, id) => ({ id, ...item }))
  const columnNames = keys(dataRaw.reduce((prev: any, curr: any) => merge(prev, curr)))
  const columns = [
    {
      field: 'id',
      headerName: 'id',
      hide: true,
      flex: 1,
    },
    {
      field: 'category',
      headerName: schema.Category,
      flex: 1,
      hide: !columnNames.includes('category'),
      textOverflow: 'ellipsis',
      renderCell: (params: GridRenderCellParams<any>) => {
        return (isEmpty(params.value)) ? '' 
          : <RelatedValueCell 
              uuid={params.value} 
              category={schema.Category} 
              relValues={relValuesQuery.data} 
              loading={relvaluesLoading} />
      },
    },
    {
      field: 'variant',
      headerName: 'Variant',
      flex: 1,
      hide: !columnNames.includes('variant'),
      textOverflow: 'ellipsis',
      renderCell: (params: GridRenderCellParams<any>) => {
        return (isEmpty(params.value) || params.value === 'DateTime') ? ''
          : <RelatedValueCell 
              uuid={params.value} 
              category="Variant" 
              relValues={relValuesQuery.data} 
              loading={relvaluesLoading} />
      },
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      hide: !columnNames.includes('date'),
      textOverflow: 'ellipsis',
      renderCell: (params: GridRenderCellParams<any>) => {
          if(params.value?.DateTime){
            params.value = Object.keys(params.value['DateTime'])
          }
          return (isEmpty(params.value)) ? '' : dayjs(params.value).format('YYYY-MM-DD HH:mm:ss')
      },
    },
    {
      field: 'value',
      hide: !columnNames.includes('value'),
      headerName: 'Value',
      flex: 1,
      textOverflow: 'ellipsis',
      renderCell: (params: GridRenderCellParams<any>) => {
        let value = params.value
        const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return (isNaN(value) && !value.match(regexExp)) ? params.value
        : <RelatedValueCell
            uuid={params.value}
            category="profiles"
            relValues={relValuesQuery.data}
            loading={relvaluesLoading} />
  }
    },
    
  ] as GridColumns

  // RENDER

  return (
    <div>
      <DataGrid data={data} rowHeight={40} columns={columns} withSelection={false}></DataGrid>
    </div>
  )
}