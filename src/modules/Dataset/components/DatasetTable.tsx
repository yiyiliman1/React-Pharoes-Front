import { RepeatedSkeletons } from "../../../common/components/RepeatedSkeletons"
import { GridColumns, GridRenderCellParams } from "@mui/x-data-grid-pro"
import _, { isArray, isPlainObject, isString } from "lodash"
import { DataGrid } from "../../../common/components/DataGrid"
import { useDatasetContext } from "../context/DatasetContext"
import { ComplexCell } from "./ComplexCell"
import { useMemo } from "react"
import { AttributeSchema } from "../types"
import { RelatedValueCell } from "./RelatedValueCell"
import regexp from "async-validator/dist-types/validator/regexp";

type Props = {
  datasetKey: string;
};

export const DatasetTable = ({ datasetKey }: Props) => {
  const ctx = useDatasetContext();

  function computeColumns() {
    if (!ctx.columns || !ctx.schema) return [];
    const datasetSchema = ctx.schema;
    return Object.keys(datasetSchema).map(attrName => {
      const attrSchema = datasetSchema[attrName];
      const relatedValues = ctx.relValuesQuery.data!;
      const relValuesLoading = ctx.relValuesQuery.loading;
      return {
        flex: 1,
        minWidth: 120,
        sortable: false,
        field: attrName,
        textOverflow: 'ellipsis',
        headerName: attrSchema.Label,
        resizable: true,
        filterable: true,
        description: attrSchema.Message,
        hide: !ctx.columns!.includes(attrName),
        renderCell: (params: GridRenderCellParams<unknown>) => {
          const value: any = params.value;
          if (isMultiValue(value, attrSchema)) {
            return <ComplexCell cellParams={params} schema={attrSchema} />
          } else if (isRelatedValue(value, attrSchema)) {
            const category = attrSchema.Category;
            return <RelatedValueCell uuid={value as string} category={category} relValues={relatedValues} loading={relValuesLoading} />
          } else if (isRelatedProfile(value, attrSchema)) {
            return <RelatedValueCell uuid={value as string} category="profiles" relValues={relatedValues} loading={relValuesLoading} />
          } else if (_.isBoolean(value)){
            return value.toString()
          }
          else{

            return value;
          }
        }
      }
    }) as GridColumns
  }

  const allColumns = useMemo(computeColumns, [ctx.schema, ctx.columns, ctx.relValuesQuery.data]);

  function isRelatedProfile(value: unknown, schema: AttributeSchema): boolean {
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    const cases = [
      (v: unknown, s: AttributeSchema) => isString(v) && s.Type === "Float" && regexExp.test(v),
      (v: unknown, s: AttributeSchema) => isString(v) && s.Type === "DateTime" && regexExp.test(v),
    ]
    return cases.some(caseTest => caseTest(value, schema));
  }

  function isRelatedValue(value: unknown, schema: AttributeSchema): boolean {
    const cases = [
      (v: unknown, s: AttributeSchema) => isArray(v) && v.length === 1 && isString(v[0]),
      (v: unknown, s: AttributeSchema) => isString(v) && s.Type === "ObjectID"
    ];
    return cases.some(caseTest => caseTest(value, schema));
  }

  function isMultiValue(value: unknown, schema: AttributeSchema): boolean {
    const cases = [
      (v: unknown, s: AttributeSchema) => isPlainObject(v),
      (v: unknown, s: AttributeSchema) => isArray(v) && v.length > 1
    ];
    return cases.some(caseTest => caseTest(value, schema));
  }

  const isLoading = ctx.isSchemaLoading || ctx.dataset.query.fetching;

  return (
    <div className='dataset-content'>
      { !!ctx.schema ? (
        <DataGrid
          idName='id'
          data={ ctx.dataset.query.data || [] }
          noDataText={`No ${datasetKey} data.`}
          loadingText={`Loading ${datasetKey} data...`}
          columns={ allColumns }
          onChangeSelectedItems={ ctx.selection.selectItems }
          loading={ isLoading }
          paginatedQuery={ ctx.dataset }
        />
      ) : (
        <div className='dataset-content__loading'>
          <RepeatedSkeletons totalElements={10} variant="rectangular" height={40}/>
        </div>
      )
    } </div>
  )
}
