import {useDatasetContext} from "../../../Dataset/context/DatasetContext";
import useSelectedDataset from "../../../Dataset/hooks/useSelectedDataset";
import {UseStateElementsFromSchema} from "../../../Dataset/hooks/useStateElementsFromSchema";
import {FiltersDialog} from "../../../Dataset/components/filters/FiltersDialog";
import {FilterButton} from "../../../../common/components/SectionMenu/buttons/FilterButton";
import {NavMenuItemConfig} from "../../../../common/types";


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


export const DatasetFilterButton = () => {
    const ctx = useDatasetContext();
    const { datasetName, selection} = useDatasetContext();
    const datasetSchema = ctx.schema;
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
            <FiltersDialog>
                <FilterButton tooltip="Filter items" />
            </FiltersDialog>
        </>
    );
};
