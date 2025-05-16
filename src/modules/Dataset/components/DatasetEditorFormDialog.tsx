import { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@mui/material';
import { ColumnForm } from './form/ColumnForm';
import Dialog from '../../../common/components/Dialog';
import { DialogRef } from '../../../common/types';
import { useDataTransform } from '../hooks/useDataTransform';
import { useDatasetContext } from '../context/DatasetContext';
import { DatasetItem } from '../types';
import { useCallTransform } from '../hooks/useCallTransform';
import { ApiToast } from '../../../common/utils/ApiToast';
import useSelectedProject from '../../Projects/hooks/useSelectedProject';
import { editItem } from '../api/editDataset';

type Props = {
  onSave?: (dataset: any) => void;
  onCancel?: () => void;
  defaultValues?: any;
  disabled?: boolean;
  children?: React.ReactChild;
  stateElements: any;
  form: any;
};

export const DatasetEditorFormDialog = ({
  onSave,
  onCancel,
  children,
  form,
  stateElements,
  ...props
}: Props) => {
  // STATE
  const { transformElements } = useCallTransform();
  const { selection, schema, datasetName } = useDatasetContext();
  const ctx = useDatasetContext();
  const { selectedProject } = useSelectedProject();
  const schemaAttr = schema || {};
  const dialogRef = useRef<DialogRef>();
  const selectedItem = selection.firstItem || ({} as DatasetItem);
  const itemKeys = Object.keys(selectedItem);
  const { transform } = useDataTransform();
  const disabled = props?.disabled || false;
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<any>([]);
  const [initialRows, setInitialRows] = useState<any>([]);

  // EVENTS

  const isRequired = (typeColumn: string) => {
    if (!typeColumn) return false;
    const element = [...stateElements].find(
      (item: any) => item.Key === typeColumn
    );
    return element?.Required;
  };

  useEffect(() => {
    let currentColumns: string[] = [];
    _.map(rows, (row: any) => {
      if (row.rowData?.column) {
        currentColumns.push(row.rowData.column);
      }
    });
    setColumns(currentColumns);
  }, [rows]);

  useEffect(() => {
    const formList = [...new Array(itemKeys.length)].map((_empty, index) => {
      const itemKey = itemKeys[index];
      const defaultValue = selectedItem[itemKey];
      const type = schemaAttr[itemKey];

      // formato datos
      const defaultValueTransformer = transform(
        defaultValue,
        type,
        {},
        itemKey
      );
      const requiredFields: string[] = [];

      return defaultValueTransformer
        .filter(
          ({ column }) =>
            column &&
            column !== 'id' &&
            Object.keys(schemaAttr).includes(column)
        )
        .map((data) => {
          const rowId = uuidv4();
          if (isRequired(data?.column)) {
            requiredFields.push(data?.column);
          }

          const required =
            isRequired(data?.column) &&
            requiredFields.filter((item) => item === data?.column).length < 2;
          return { required, rowId, rowData: data };
        });
    });
    setRows([...formList.flat()]);
    setInitialRows([...formList.flat()]);
  }, [itemKeys.length]);

  const handleUpdateRow = (rowId: string, rowData: any) => {
    const currentRows = [...rows];
    const updatedRow = currentRows.find((row) => row.rowId === rowId);
    updatedRow.rowData = rowData;
    setRows([...currentRows]);
  };

  const handleAddRow = () => {
    const rowId = uuidv4();
    const newRow = { required: false, rowId };
    setRows((prevState: any) => [...prevState, newRow]);
  };

  const handleDeleteRow = (rowId: string) => {
    setRows((prevState: any) => [
      ...prevState.filter((row: any) => row.rowId !== rowId),
    ]);
  };

  const handleCloseDialog = () => {
    setRows([...initialRows]);
  };

  const handleForm = () => {
    const duplicates = rows
      ?.map((row: any) => {
        return rows?.find((rowsItem: any) => {
          const fieldParams = stateElements.find(
            (element: any) => element.Key === rowsItem.rowData.column
          );
          if (
            row?.rowData?.column === rowsItem?.rowData?.column &&
            row?.rowData?.variant === rowsItem?.rowData?.variant &&
            dayjs(row?.rowData?.dateValue).format('YYYY-MM-DDTHH:mm') ===
              dayjs(rowsItem?.rowData?.dateValue).format('YYYY-MM-DDTHH:mm') &&
            row?.rowId !== rowsItem?.rowId &&
            (fieldParams?.Date?.disabled === false ||
              fieldParams?.Variant?.disabled === false)
          ) {
            return row;
          }
        });
      })
      ?.filter((existingValue: any) => existingValue);
    if (duplicates?.length) {
      toast.error('Duplicate property with same date and variant', {
        toastId: 'id',
      });
      return;
    }
    const body = transformElements(rows, datasetName);
    sendEditItem(body);
  };

  const sendEditItem = async (body: any) => {
    if (!body || !selectedProject) return;
    const promise = editItem(
      selectedProject.projectid,
      ctx.datasetName,
      selectedItem.id,
      body
    );
    const response = await ApiToast.for(promise, {
      pending: 'Editing item...',
      error: 'Error editing item.',
      success: 'Item successfully edited.',
    });
    dialogRef.current?.hide();
    ctx.dataset.query.refetch();
    return response;
  };

  // COMPONENT
  return (
    <Dialog
      title={`Edit ${selectedItem.Name}`}
      className='create-dataset-dialog'
      disabled={disabled}
      executor={children}
      ref={dialogRef}
      onClose={handleCloseDialog}
    >
      <div className='forms-list'>
        {rows.map((row: any) => {
          return (
            <ColumnForm
              columns={columns}
              form={form}
              stateElements={stateElements}
              defaultCategory={row?.rowData?.column}
              required={row?.required}
              defaultData={row?.rowData}
              key={row?.rowId}
              rowId={row?.rowId}
              rowData={row?.rowData}
              rows={rows}
              onChange={handleUpdateRow}
              onCancel={handleDeleteRow}
            />
          );
        })}
      </div>
      <div>
        <Button variant='text' onClick={handleAddRow}>
          NEW PROPERTY
        </Button>
      </div>
      <div className='buttons'>
        <Button
          onClick={handleForm}
          variant='contained'
          type='submit'
          size='large'
        >
          Save
        </Button>
      </div>
    </Dialog>
  );
};
