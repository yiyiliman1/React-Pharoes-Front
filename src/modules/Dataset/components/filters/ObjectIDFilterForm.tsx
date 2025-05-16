import { FormControl, InputLabel } from "@mui/material"

import { SelectValues } from "../form/SelectValues"

type Props = {
  property: any
  onChange?: (values: string[]) => void
  rawFilters?: any
}

export const ObjectidFilterForm = ({ property, onChange, rawFilters }: Props) => {
  const label = property.Label

  return (
    <>
      <FormControl fullWidth size='small'>
        <InputLabel>{ label }</InputLabel>
        <SelectValues
          onChange={(event: any) => onChange && onChange(event.target.value)}
          category={property.Category}
          config={{ name: property.Category, label }}
          multiple={true}
          withoutDefaultItem={true}
          rawFilters={rawFilters}
        />
      </FormControl>
    </>
  )
}