import { useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";
import { ColumnForm } from "./form/ColumnForm";
import Dialog from "../../../common/components/Dialog";
import { DialogRef } from "../../../common/types";
import _ from "lodash";
import {DatasetItem, FormModel} from "../types";
import { useDatasetContext } from "../context/DatasetContext";
import { v4 as uuidv4 } from "uuid";
import {useCallTransform} from "../hooks/useCallTransform";
import {duplicateItem} from "../api/duplicateItem";
import {ApiToast} from "../../../common/utils/ApiToast";
import useSelectedProject from "../../Projects/hooks/useSelectedProject";
import {addItem} from "../api/createDataset";

type Props = {
  onSave?: (dataset: any) => void;
  onCancel?: () => void;
  defaultValues?: any;
  children?: React.ReactChild;
  stateElements: any;
  form: any;
};

export const DatasetCreateFormDialog = ({ defaultValues, form, onSave, onCancel, children, stateElements }: Props) => {
  const { transformElements } = useCallTransform();
  const { selectedProject } = useSelectedProject();
  const { datasetName }= useDatasetContext();
  const ctx = useDatasetContext();
  const dialogRef = useRef<DialogRef>();
  const [rows, setRows] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([])
  useEffect(() => {
    let requiredFields: any[] = [];
    if (stateElements) {
      _.map(stateElements, (item: FormModel) => {
        if (item.Required) {
          const rowId = uuidv4();
          const column = { required: true, defaultCategory: item.Key, rowId };
          requiredFields.push(column);
        }
      });
      setRows([...requiredFields]);
    }
  }, [datasetName, stateElements]);

  useEffect(() => {
    let currentColumns: string[] = []
    _.map(rows, (row: any) =>{
      if(row.rowData?.column){
        currentColumns.push(row.rowData.column)
      }
    })
    setColumns(currentColumns)
  }, [rows]);


  const handleUpdateRow = (rowId: string, rowData: any) => {
    const currentRows = [...rows];
    const updatedRow = currentRows.find((row) => row.rowId === rowId);
    updatedRow.rowData = rowData;
    setRows([...currentRows]);
  };

  const handleAddRow = () => {
    const rowId = uuidv4();
    const newRow = { required: false, rowId };

    setRows((prevState) => [...prevState, newRow]);
  };

  const handleDeleteRow = (rowId: string) => {
    setRows((prevState) => [...prevState.filter((row) => row.rowId !== rowId)]);
  };

  const handleForm = () => {
    const body = transformElements(rows, datasetName)
    createItem(body)
  };

  const createItem = async (body: any) => {
    if (!body || !selectedProject) return;
    const promise = addItem(selectedProject.projectid, ctx.datasetName, body);
    const response = await ApiToast.for(promise, {
      pending: "Creating item...",
      error: "Error creating item.",
      success: "Item successfully created."
    })
    dialogRef.current?.hide()
    ctx.dataset.query.refetch();
    return response;
  };


  const handleCloseDialog = () => {
    setRows((prevState) => [...prevState.filter((row) => row.required)]);
  };

  return (
    <Dialog title={`Create ${datasetName}`} className="create-dataset-dialog" executor={children} ref={dialogRef} onClose={handleCloseDialog}>
      <div className="forms-list">
        {rows.map((row) => {
          return (
            <ColumnForm
              required={row.required}
              defaultCategory={row.defaultCategory}
              form={form}
              stateElements={stateElements}
              key={row.rowId}
              rowId={row.rowId}
              onChange={handleUpdateRow}
              onCancel={handleDeleteRow}
              columns={columns}
            />
          );
        })}
      </div>
      <div>
        <Button variant="text" onClick={handleAddRow}>
          NEW PROPERTY
        </Button>
      </div>
      <div className="buttons">
        <Button onClick={handleForm} variant="contained" size="large">
          Create
        </Button>
      </div>
    </Dialog>
  );
};
