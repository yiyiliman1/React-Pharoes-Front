import { useDatasetContext } from "../context/DatasetContext";
import { duplicateItem } from "../api/duplicateItem";
import useSelectedProject from "../../Projects/hooks/useSelectedProject";
import { deleteItems } from "../api/deleteDataset";
import { ApiToast } from "../../../common/utils/ApiToast";
import { forEach } from "lodash";
import { useEffect } from "react";
import { DatasetItem } from "../types";
import useSchema from "../../Projects/hooks/useSchema";

type UseSelectedDataset = {
  duplicateSelectedItem: (item: DatasetItem) => Promise<any>;
  updateItem: (item: DatasetItem) => any;
  deleteSelectedItems: (items: DatasetItem[]) => void;
};

export default function useSelectedDataset(): UseSelectedDataset {
  const { selectedProject } = useSelectedProject();
  const ctx = useDatasetContext();

  const duplicateSelectedItem = async (item: DatasetItem) => {
    if (!item || !selectedProject) return;
    const promise = duplicateItem(selectedProject.projectid, ctx.datasetName, item.id);
    const response = await ApiToast.for(promise, {
      pending: "Duplicating item...",
      error: "Error duplicating items.",
      success: "Item successfully duplicated.",
    });
    ctx.dataset.query.refetch();
    return response;
  };

  const deleteSelectedItems = async (items: DatasetItem[]) => {
    if (!selectedProject || items.length === 0) return;
    const ids = items.map((item) => item.id);
    const promise = deleteItems(selectedProject.projectid, ctx.datasetName, ids);
    const response = await ApiToast.for(promise, {
      pending: `Deleting ${ids.length} item(s)...`,
      error: "Error deleting items.",
      success: `${ids.length} item(s) successfully deleted.`,
    });
    ctx.dataset.query.refetch();
    return response;
  };

  const updateItem = (item: DatasetItem) => {
    // TODO: hay que parsear newFields con el item seleccionado "selectedItems[0]" y hacer la llamada del update.
  };

  return {
    duplicateSelectedItem,
    updateItem,
    deleteSelectedItems,
  };
}
