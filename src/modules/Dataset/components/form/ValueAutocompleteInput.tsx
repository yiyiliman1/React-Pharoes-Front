import { Autocomplete, TextField } from "@mui/material"
import { useEffect, useState } from "react"

import { useRelatedField } from "../../hooks/useRelatedField"
import {toast} from "react-toastify";

type Props = {
  onChange?: (value: any) => any
  label: string
  value?: any
  disabled?: boolean
  required?: boolean
}

export const ValueAutocompleteInput = (props : Props) => {
  const { allData } = useRelatedField('Generator')
  const { onChange, label, value, disabled, required} = props
  const profiles = allData?.profiles || {}

  const [inputValue, setInputValue] = useState("")
  const options = Object.keys(profiles).map((key: any) => ({ id: key, name: profiles[key], label: profiles[key] + "-" + key.split('-')[0] + "****"}));

    useEffect(() => {
        if (value){
            if (profiles[value]){
                setInputValue(profiles[value] + "-" + value.split('-')[0] + "****")
            } else {
                setInputValue(value)
            }
        }
    }, [profiles])

  
    useEffect(() => {
      if (!value){
        setInputValue(value)
      }
  }, [value])

  const onChangeInput = (event: any, profileValue?: any) => {
      if (event){
        onChange && onChange(profileValue)
        setInputValue(profileValue)
      }
  }

    const onChangeProfile = (event: any, profileValue?: any) =>{
        event.stopPropagation()
        onChange && onChange(profileValue.id)
        setInputValue(profileValue.label)
  }

  return (
    <Autocomplete
      size="small"
      id="dataset-value-profiles"
      freeSolo
      getOptionLabel={(options) => options['label'] || ""}
      options={options}
      onInputChange={onChangeInput}
      value={value}
      inputValue={inputValue}
      onChange={onChangeProfile}
      disableClearable
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          value={value}
          InputProps={{
            ...params.InputProps,
          }}
        />
      )}
    />
  )
}