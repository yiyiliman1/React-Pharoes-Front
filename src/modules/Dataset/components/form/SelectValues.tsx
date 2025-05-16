import { useState, useMemo, useEffect } from "react";
import { MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useRelatedField } from "../../hooks/useRelatedField";

export const SelectValues = ({
  category,
  disabled,
  config,
  defaultValue,
  multiple,
  onChange,
  rawFilters,
  withoutDefaultItem,
  value,
}: any) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const { filteredData } = useRelatedField(category || "", searchValue);
  const { register } = useForm();
  const [inputValue, setInputValue] = useState<any>([]);

  useEffect(() => {
    // console.log(config)
    // rawFilters is not used in every instance of the SelectValues.
    if (rawFilters) {
      if (rawFilters[config.label]) {
        setInputValue(rawFilters[config.label]?.rel);
      }
    }
  }, []);

  const listValues = useMemo(() => {
    const defaultItem = (
      <MenuItem value="" key="none">
        none
      </MenuItem>
    );

    const items = filteredData.map(([value, name]: any[]) => (
      <MenuItem value={value} key={value}>
        {name}
      </MenuItem>
    ));

    return withoutDefaultItem ? items : [defaultItem, ...items];
  }, [filteredData, withoutDefaultItem]);

  const defaultVal = defaultValue || multiple ? [] : "";
  const isMultiple = multiple || false;

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
      defaultValue={defaultVal}
      multiple={isMultiple}
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
