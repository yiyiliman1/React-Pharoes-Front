import {useEffect, useState} from 'react';
import {FormModel} from "../types";
import useSchema from "../../Projects/hooks/useSchema";
import _ from "lodash";
import { AttributeSchema } from "../types";
import { useDatasetContext } from '../context/DatasetContext';

export interface UseStateElementsFromSchema {
    stateElements: any[]
    getStateElements: () => any
}


export function UseStateElementsFromSchema(): UseStateElementsFromSchema {
    const { datasetName } = useDatasetContext()
    const { schema } = useSchema()
    const [stateElements, setStateElements] = useState<any>({})
    
    const getStateElements = () => {
        const schemaSections = schema[datasetName]
        const items: FormModel[] = _.map(schemaSections, (item: AttributeSchema, key: string) => {
               return {
                            Column: item.Label,
                            Key: key,
                            Required: item.Required,
                            WithProfiles: false,
                            Relationship: isProp(item) ?  {disabled: true, required: false} :  {disabled: false, required: true},
                            Variant: {disabled: !item.Variants, required: item.Variants},
                            Date: {disabled: item.Constant, required: false},
                            Value: isRel(item) ? {disabled: true, required: false} :  {disabled: false, required: true},
                            Unique: !item.Vars && item.Constant && !item.Variants
                }
        })
        return [...items]
    }

    const isRel = ((dataItem: AttributeSchema) => dataItem.Category && dataItem.Type === "ObjectID")
    const isAttrRel = ((dataItem: AttributeSchema) => dataItem.Category && dataItem.Type !== "ObjectID")
    const isProp = ((dataItem: AttributeSchema) => !isRel(dataItem) && !isAttrRel(dataItem))

    useEffect(() => {
        setStateElements(getStateElements())
    }, [datasetName, schema])

    return {
        stateElements,
        getStateElements
    }
}
