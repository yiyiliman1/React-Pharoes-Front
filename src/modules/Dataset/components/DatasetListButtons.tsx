import { AddButton } from "../../../common/components/SectionMenu/buttons/AddButton";
import { DatasetEditorFormDialog } from "./DatasetEditorFormDialog";
import { DatasetCreateFormDialog } from "./DatasetCreateFormDialog";
import { DeleteButton } from "../../../common/components/SectionMenu/buttons/DeleteButton";
import { DuplicateButton } from "../../../common/components/SectionMenu/buttons/DuplicateButton";
import { EditButton } from "../../../common/components/SectionMenu/buttons/EditButton";
import { FilterButton } from "../../../common/components/SectionMenu/buttons/FilterButton";
import { FiltersDialog } from "./filters/FiltersDialog";
import useSelectedDataset from "../hooks/useSelectedDataset";
import { UseStateElementsFromSchema } from "../hooks/useStateElementsFromSchema";
import { useDatasetContext } from "../context/DatasetContext";
import ConfirmationDialog from "../../../common/components/ConfirmationDialog";

const Form = {
  Column: {
    name: "Column",
    label: "Property",
    defaultValue: "",
  },
  Relationship: {
    name: "Relationship",
    label: "Relationship",
    defaultValue: "",
  },
  Variant: {
    name: "Variant",
    label: "Variant",
    defaultValue: "",
  },
  Date: {
    name: "Date",
    label: "Date",
    defaultValue: "",
  },
  Value: {
    name: "Value",
    label: "Value",
    defaultValue: "",
  },
};

export const DatasetListButtons = () => {
  const { datasetName, selection} = useDatasetContext();
  const { deleteSelectedItems, duplicateSelectedItem } = useSelectedDataset();
  const { stateElements } = UseStateElementsFromSchema();

  const requestItemsDeletion = async () => {
    if (!selection.hasSelection) return;
    return deleteSelectedItems(selection.items);
  }

  const requestItemDuplication = async () => {
    if (!selection.isSingleSelection) return;
    return duplicateSelectedItem(selection.firstItem!);
  }

  return (
    <>
      <DatasetCreateFormDialog form={Form} stateElements={stateElements}>
        <AddButton disabled={selection.hasSelection} tooltip="Create item" />
      </DatasetCreateFormDialog>
      <ConfirmationDialog
          title={`Duplicate ${datasetName} Item`}
          message={(<span>Are you sure you want to <strong>duplicate</strong> the selected <strong>{ datasetName } item</strong>?</span>)}
          confirmText='Duplicate'
          onConfirm={requestItemDuplication}>
          <DuplicateButton tooltip="Duplicate item" disabled={!selection.isSingleSelection} />
      </ConfirmationDialog>
      <DatasetEditorFormDialog form={Form} stateElements={stateElements} disabled={!selection.isSingleSelection}>
        <EditButton tooltip="Edit item" disabled={!selection.isSingleSelection} />
      </DatasetEditorFormDialog>
      <ConfirmationDialog 
        title={`Delete ${datasetName} Item`}
        type='error'
        confirmText='Delete'
        message={(<span>Are you sure you want to <strong>delete</strong> the selected <strong>{ datasetName } items ({ selection.items.length })</strong>?</span>)}
        onConfirm={requestItemsDeletion}>
        <DeleteButton tooltip="Delete items" disabled={!selection.hasSelection} />
      </ConfirmationDialog>
      <FiltersDialog>
        <FilterButton tooltip="Filter items" />
      </FiltersDialog>
    </>
  );
};
