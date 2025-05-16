import {MenuItem, Select, Switch, Checkbox, FormControlLabel, SelectChangeEvent} from "@mui/material";
import { useEffect, useState } from "react";
import { ComplexFilter } from "../../../../common/components/filters/ComplexFilter";

type Props = {
  onChange: (value: string, options: any) => void;
};

export const BooleanFilter = ({ onChange }: Props) => {
  const [value, setValue] = useState("disabled");
  const [options, setOptions] = useState<any>({});

  const onChangeOptionForm = (value: any) => {
    setOptions(value);
  };

  const handleChange = (event: SelectChangeEvent<string>) => {
    setValue(event.target.value);
    if (onChange) {
      onChange(value, options)
    }
  };

  return (
    <div className="boolean-filter_global-container">
      <ComplexFilter onChangeType={onChangeOptionForm}>
        <Select
          labelId="select-operator"
          id="select-operator"
          value={value}
          defaultValue={value}
          size="small"
          onChange={(event) => handleChange(event)}
          className="boolean-filter_select-container"
        >
          <MenuItem value={"disabled"}>Disabled</MenuItem>
          <MenuItem value={"true"}>True</MenuItem>
          <MenuItem value={"false"}>False</MenuItem>
        </Select>
      </ComplexFilter>
    </div>
  );
};
