import _ from 'lodash'
import {AttributeSchema} from "../types";

export interface UseRelatedField {
  transform: (data: any, type: AttributeSchema, defaultItem?: any, column?: string) => any[]
}


export function useDataTransform(): UseRelatedField {
  const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  const transformDate = (data: any, defaultItem: object = {}): any => {
    return _.flatten(Object.keys(data).map(key => {
      const value = data[key]
      if(_.isNumber(value) && key === 'Value'){ return { ...defaultItem, value }}
      else if(_.isNumber(value) && key !== 'Value'){ return { ...defaultItem, value, date: key }}
      else if(key === 'DateTime'){
        let newKey= Object.keys(value)[0]
        return{...defaultItem, value: value[newKey], date: Object.keys(value)[0]}}
    }
    ))
  }

  const transformVariant = (data: any, defaultItem: object = {}, type: AttributeSchema): any => {
    return _.flatten(Object.keys(data).map(key => {
      const value = data[key]
      if (key === 'DateTime') return transformDate(value, defaultItem).map((item: any) => ({...item, date: value}))

      if (data[key]['DateTime']) {
        return transformDate(value, defaultItem).map((item: any) => ({...item, variant: key}))
      }
      if (_.isString(value)) return [{ ...defaultItem,  value, variant: key }]
      if (key.match(regexExp)) return [{ ...defaultItem,  value, variant: key }]
      if (_.isNumber(value)) return [{...defaultItem, value, variant: key}]
      if (_.isObject(value)) return transform(value, type, {...defaultItem})

    }))
  }
  

  const transform = (data: any, schema: AttributeSchema, defaultItem: object = {}, column?: string): any[] => {
    const addDefault = (items: any) => items.map((item: any) => ({ ...item, ...defaultItem, column })) || {}

    if (_.isString(data)) {
      if(column && column !== 'id'){
        if (schema.Type === 'ObjectID'){
          return addDefault([{relationship: data}])
        } else {
          return addDefault([{value: data}])
        }
      }
    }

    if (_.isNumber(data)) return addDefault([{ value: data.toString() }] )
    return _.flatten(Object.keys(data).map(key => {
      const value = data[key]
      if (key === 'Variant') return addDefault(transformVariant(value, {column}, schema))
      else if (key === 'DateTime') {return addDefault(transformDate(value, {column},))}
      else if (key === 'Value') return addDefault([{ value, column }])
      else if (_.isArray(value)) {
        return addDefault(transform(value.toString(), schema, {category: key, column}))}
      else if (_.isObject(value)) { return addDefault(transform(value, schema,{column, category: key, relationship: key}))}
      else if (key.match(regexExp)) return addDefault([{category: key, value: value.toString(), column, relationship: key}])
      else if (_.isString(value) && value.match(regexExp)) {
          return addDefault([{relationship: value, column, category: value}])
      }
      else if (value.match(regexExp)) {
        return addDefault([{value, column}])
      }
      else if (_.isString(value)) return addDefault([{ value, column }])
    }))
  }

  return { transform }
}
