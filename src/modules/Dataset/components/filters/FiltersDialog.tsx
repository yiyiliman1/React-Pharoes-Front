import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { pickBy, map } from "lodash";
import { BooleanFilter } from "./BooleanFilter";
import { ComplexFilterForm } from "./ComplexFilterForm";
import Dialog from "../../../../common/components/Dialog";
import { DialogRef } from "../../../../common/types";
import { NumberFilter } from "./NumberFilter";
import { ObjectidFilterForm } from "./ObjectIDFilterForm";
import { StringFilter } from "./StringFilter";
import { useDatasetContext } from "../../context/DatasetContext";
import {useCallback, useEffect, useRef, useState} from "react";
import SortFilter from "./SortFilter";

type Props = {
  children?: React.ReactChild;
};

export const FiltersDialog = ({ children }: Props) => {
  const [rawFilters, setRawFilters] = useState<any>({});
  const { datasetName, schema, setFilters } = useDatasetContext();
  const properties = schema || {};
  const dialogRef = useRef<DialogRef>()
  console.log(rawFilters)
  // EVENTS
  const handleEmptyValue = (key: any) => {
    const currentFilters = { ...rawFilters };
    const updatedFilters = pickBy(currentFilters, (value, filterKey) => {
      return filterKey !== key;
    });
    setRawFilters({ ...updatedFilters });
  };

  const onClickSearchButton = () => {
    const currentFilters = { ...rawFilters };

    const formattedFilters: any[] = map(currentFilters, (el, key) => {
      if (key === "sort") {
        return { [key]: el };
      }
      if (key === "Parent") {
        return { ...pickBy(el, (e, k) => k !== "columnType"), name: key };
      }
      if (el.rel){
          return { 'rel': el.rel, name: key }
      } else {
          return { [el.columnType.toLowerCase()]: { ...pickBy(el, (e, k) => k !== "columnType") }, name: key };
      }
    });

    setFilters([...formattedFilters]);
    onCloseDialog()
  };

  const onCloseDialog =() =>{
    dialogRef.current?.hide()
  }

  const onChangeSortFilter = (column: any, order: any) => {
    !!column && !!order
      ? setRawFilters({
          ...rawFilters,
          sort: {
            col: column,
            dir: order,
          },
        })
      : handleEmptyValue("sort");
  };

  // COMPONENTS
  const elements = Object.keys(properties).map((key, index) => {
    const property = properties[key];

    const onChangeStringFilter = (value: string) => {
      value
        ? setRawFilters({
            ...rawFilters,
            [key]: { string: { contains: value }, columnType: property.ColumnType },
          })
        : handleEmptyValue(key);
    };

    const onChangeBooleanFilter = (value: string, options: any) => {
      const { complex, profile } = options;

      value !== "disabled"
        ? setRawFilters({
            ...rawFilters,
            [key]: {
              boolean: { [`only_${value}`]: true, exclude_profiles: profile, exclude_complex: complex },
              columnType: property.ColumnType,
            },
          })
        : setRawFilters({
            ...rawFilters,
            [key]: { boolean: { exclude_profiles: profile, exclude_complex: complex }, columnType: property.ColumnType },
          });
    };

    const onChangeNumberFilter = (min?: number, max?: number, options?: any) => {
      const { complex, profile } = options;
      !!min || !!max
        ? setRawFilters({
            ...rawFilters,
            [key]: {
              number: { range: { ">": min, "<": max }, exclude_profiles: profile, exclude_complex: complex },
              columnType: property.ColumnType,
            },
          })
        : handleEmptyValue(key);
    };

    const onChangeObjectIdFilter = (values: string[]) => {
      const filteredValues = values.filter((value) => value);
      !!filteredValues.length
        ? setRawFilters({
            ...rawFilters,
            [key]: { rel: [...filteredValues], columnType: key },
          })
        : handleEmptyValue(key);
    };

    // const onChangeComplexFilter = (value: any) => {
    //   if (value.type === "complex") {
    //     setRawFilters({
    //       ...filters,
    //       [key]: { complex: true },
    //     });
    //   } else if (value.type === "profiles") {
    //     setRawFilters({
    //       ...filters,
    //       [key]: { profiles: true },
    //     });
    //   } else if (value.type === "normal") {
    //     let range: { [key: string]: any } = {};

    //     if (value.operator === "equal") range["="] = value.value;
    //     if (value.operator === "greater") range[">"] = value.value;
    //     if (value.operator === "smaller") range["<"] = value.value;

    //     setRawFilters({
    //       ...filters,
    //       [key]: { range },
    //     });
    //   }
    // };

    if (property.Type !== "ObjectID" && !!property.Category) return <div key={index}></div>;
    const getForm = useCallback(() => {
      if (property.Type === "ObjectID") return <ObjectidFilterForm property={property} onChange={onChangeObjectIdFilter} rawFilters={rawFilters} />;
      if (property.Type === "Float") return <NumberFilter onChange={onChangeNumberFilter} />;
      if (property.Type === "Integer") return <NumberFilter onChange={onChangeNumberFilter} />;
      if (property.Type === "Bool") return <BooleanFilter onChange={onChangeBooleanFilter} />;
      if (property.Type === "String") return <StringFilter onChange={onChangeStringFilter} />;

      //return <ComplexFilterForm property={property} onChange={onChangeComplexFilter} />;
    }, [rawFilters]);

    return (
      <div className="filter-item" key={index}>
        <div className="filter-item_name">
          <span>{property.Label}</span>
        </div>
        <div className="filter-item_content">{getForm()}</div>
      </div>
    );
  });

  useEffect(() => {
    return () => {
      setRawFilters({});
    }
  }, [])

  const clearFilters = () => {
    setRawFilters({});
    setFilters([]);
    onCloseDialog();
  };

  const columnValues = Object.keys(properties || {}).map((key, index) => {
    return (
      <MenuItem value={key} key={index}>
        {properties[key].Label}
      </MenuItem>
    );
  });

  const sortComponent = <SortFilter columnValues={columnValues} onChange={onChangeSortFilter} />;

  const buttonsContainer = (
    <div className="button-container">
      <Button variant="contained" size="large" onClick={clearFilters}>
        Clear Filters
      </Button>
      <Button variant="contained" size="large" onClick={onClickSearchButton} style={{marginLeft: '10px'}}>
        Search
      </Button>
    </div>
  );

  return (
    <Dialog title={`Filter ${datasetName}`} className="filter-dataset-dialog" executor={children} ref={dialogRef} rawFilters={rawFilters} nullifyFilters={() => setRawFilters({})}>
      <>
        {elements}
        {sortComponent}
        {buttonsContainer}
      </>
    </Dialog>
  );
};
