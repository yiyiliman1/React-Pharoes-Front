import { useEffect, useState } from "react";

import { ComplexFilter } from "../../../../common/components/filters/ComplexFilter";
import { TextField } from "@mui/material";

type Props = {
  onChange?: (min?: number, max?: number, options?: any) => void;
};

export const NumberFilter = ({ onChange }: Props) => {
  const [min, setMin] = useState<number | undefined>();
  const [max, setMax] = useState<number | undefined>();
  const [options, setOptions] = useState<any>({});

  const onChangeOptionForm = (value: any) => {
    setOptions(value);
  };

  useEffect(() => {
    onChange && onChange(min, max, options);
  }, [min, max, options]);

  return (
    <ComplexFilter onChangeType={onChangeOptionForm}>
      <div className="number-filter">
        <TextField
          className="number-filter__input"
          id="min-value"
          label="Greater than"
          variant="outlined"
          size="small"
          value={min}
          type="number"
          onChange={(event) => setMin(parseInt(event.target.value))}
        />
        <span></span>
        <TextField
          className="number-filter__input"
          id="max-value"
          label="Smaller than"
          variant="outlined"
          size="small"
          value={max}
          type="number"
          onChange={(event) => setMax(parseInt(event.target.value))}
        />
      </div>
    </ComplexFilter>
  );
};
