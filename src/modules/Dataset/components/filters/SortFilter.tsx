import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  columnValues: any;
  onChange: (column: any, order: any) => void;
};

const SortFilter = ({ columnValues, onChange }: Props) => {
  const [column, setColumn] = useState<any>("");
  const [order, setOrder] = useState<any>("");

  useEffect(() => {
    onChange(column, order);
  }, [column, order]);

  return (
    <div className="filter-item">
      <div className="filter-item_name">
        <span>Sort by</span>
      </div>
      <div className="sort-container">
        <FormControl size="small" fullWidth>
          <InputLabel id="inputColumnType">Property</InputLabel>
          <Select
            value={column}
            onChange={(event) => setColumn(event.target.value)}
            label="Property"
            disabled={false}
            labelId="inputColumnType"
            id="demo-simple-select"
            size="small"
          >
            {columnValues}
          </Select>
        </FormControl>
        <FormControl size="small" fullWidth>
          <InputLabel id="inputColumnType">Order</InputLabel>
          <Select
            value={order}
            onChange={(event) => setOrder(event.target.value)}
            label="Order"
            disabled={false}
            labelId="inputColumnType"
            id="demo-simple-select"
            size="small"
          >
            <MenuItem value="">none</MenuItem>
            <MenuItem value="asc">ASC</MenuItem>
            <MenuItem value="desc">DESC</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default SortFilter;
