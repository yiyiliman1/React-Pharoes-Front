import { MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";

import { ComplexFilter } from "../../../../common/components/filters/ComplexFilter";

type Props = {
  property: any;
  onChange?: (values: { type: string; operator: string; value: string }) => void;
};

export const ComplexFilterForm = ({ property, onChange }: Props) => {
  const label = property.Label;

  const [type, setType] = useState<string>("normal");
  const [operator, setOperator] = useState<string>("equal");
  const [value, setValue] = useState<string>("");

  const onChangeType = (type: string) => {
    setType(type);
  };

  const onChangeOperator = (event: any) => {
    const value = event.target.value;
    setOperator(value);
  };

  useEffect(() => {
    onChange && onChange({ type, operator, value });

    if (type !== "normal") {
      setValue("");
      setOperator("equal");
    }
  }, [type, operator, value]);

  return (
    <>
      <ComplexFilter onChangeType={onChangeType}>
        <div className="operator-filter-form">
          <Select
            labelId="select-operator"
            id="select-operator"
            value={operator}
            size="small"
            disabled={type !== "normal"}
            onChange={onChangeOperator}
          >
            <MenuItem value={"equal"}>Equal</MenuItem>
            <MenuItem value={"greater"}>Greater than</MenuItem>
            <MenuItem value={"smaller"}>Smaller than</MenuItem>
          </Select>
          <TextField
            id="value"
            className="value"
            label={label}
            variant="outlined"
            size="small"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            disabled={type !== "normal"}
          />
        </div>
      </ComplexFilter>
    </>
  );
};
