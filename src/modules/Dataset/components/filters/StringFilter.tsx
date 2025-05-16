import { useEffect, useState } from "react";

import { TextField } from "@mui/material";

type Props = {
  onChange?: (value: string) => void;
};

export const StringFilter = ({ onChange }: Props) => {
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    onChange && onChange(value);
  }, [value]);

  return (
    <div>
      <TextField
        id="value"
        className="string-input"
        variant="outlined"
        size="small"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    </div>
  );
};
