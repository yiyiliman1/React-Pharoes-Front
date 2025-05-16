import { useState, useMemo, useEffect } from "react";
import { MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useForm } from "react-hook-form";

export const SelectValues = ({
  disabled,
  config,
  defaultValue,
  onChange,
  rawFilters,
  value,
  stages,
}: any) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const filteredData = FilterData(stages, searchValue);

  const { register } = useForm();
  const [inputValue, setInputValue] = useState<any>([""]);

  useEffect(() => {
    console.log(defaultValue);
    if (defaultValue) {
      setInputValue(defaultValue);
    }
  }, [defaultValue]);

  function FilterData(data: Array<Array<String>>, searchValue?: string) {
    return data.filter((item) => {
      return item[1].toLowerCase().includes(searchValue?.toLowerCase() || "");
    });
  }

  const listValues = useMemo(() => {
    const items = filteredData.map(([value, name]: any[]) => (
      <MenuItem value={value} key={value}>
        {name}
      </MenuItem>
    ));

    return items;
  }, [filteredData]);

  const defaultVal = stages[0]; //allStages[0];

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleChange = (event: SelectChangeEvent<any>) => {
    if (onChange) {
      onChange(event);
    }
    setInputValue(event.target.value);
  };

  return (
    <Select
      label={config.label}
      disabled={disabled}
      labelId="relationshipInput"
      id="relationshipInputSelect"
      size="small"
      value={inputValue}
      defaultValue={defaultValue}
      multiple={false}
      {...register(config.name)}
      onChange={(event) => handleChange(event)}
      onClose={() => setSearchValue("")}
    >
      <TextField
        size="small"
        placeholder="Type to search..."
        fullWidth
        className="filter-item-search"
        onChange={handleSearch}
        onKeyDown={(e) => {
          if (e.key !== "Escape") {
            // Prevents autoselecting item while typing (default Select behaviour)
            e.stopPropagation();
          }
        }}
      />
      {listValues}
    </Select>
  );
};
