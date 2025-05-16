import {
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { DateTimePicker, LocalizationProvider } from '@mui/lab';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import CloseIcon from '@mui/icons-material/Close';
import { SelectValues } from './SelectValues';
import { ValueAutocompleteInput } from './ValueAutocompleteInput';
import { useDatasetContext } from '../../context/DatasetContext';

type Props = {
  onSave?: (dataset: any) => void;
  onCancel?: (rowId: string) => void;
  defaultValues?: any;
  defaultCategory?: any;
  children?: React.ReactChild;
  defaultData?: any;
  onChange?: (rowId: string, rowData: any) => void;
  totalForms?: number;
  stateElements: any;
  form: any;
  required?: boolean;
  rowId: string;
  rowData?: any;
  columns: string[];
  rows?: any[];
};

export const ColumnForm = ({
  defaultCategory,
  form,
  defaultData,
  required,
  onChange,
  onCancel,
  stateElements,
  rowId,
  rowData,
  columns,
  rows,
}: Props) => {
  // HOOKS
  const {
    register,
    formState: { errors },
  } = useForm();
  const [typeColumn, setTypeColumn] = useState<string>(defaultCategory || '');
  const { schema } = useDatasetContext();
  const properties = schema || {};
  const [relationshipValue, setRelationshipValue] = useState(
    defaultData?.relationship || ''
  );
  const [variantValue, setVariantValue] = useState(defaultData?.variant || '');
  const [dateValue, setDateValue] = useState(defaultData?.date || null);
  const [inputValue, setInputValue] = useState(
    defaultData?.value?.toString() || ''
  );
  // METHODS
  const getDisabled = (formItem: string): boolean => {
    if (!typeColumn) return true;
    const element = stateElements.find((item: any) => item.Key === typeColumn);
    if (!element) return true;
    return element[formItem]?.disabled;
  };

  const checkIfRepeatable = (category: string): boolean => {
    const element = stateElements.find((item: any) => item.Key === category);
    return element?.Unique;
  };

  // EVENTS

  const onClickCloseButton = () => {
    onCancel && onCancel(rowId);
  };

  const onDatePicked = (event: any) => {
    if (event) {
      setDateValue(event.toISOString());
    } else {
      setDateValue(null);
    }
  };

  const onChangeColumn = (event: any) => {
    setTypeColumn(event.target.value);
    setInputValue('');
    setRelationshipValue('');
    setVariantValue('');
    setDateValue(null);
  };

  const onChangeRelationshipColumn = (event: any) => {
    if (
      rows?.some(
        (row: any) =>
          row.rowData?.column === 'HeatRate' &&
          row.rowData.relationship === event.target.value
      )
    ) {
      toast.error('Can not define several heat rates for the same segment', {
        toastId: 'HeatRate',
      });
      return;
    }

    setRelationshipValue(event.target.value);
  };

  // WATCHERS
  useEffect(() => {
    if (properties[defaultCategory]?.Type === 'ObjectID') {
      setInputValue('');
    }
  }, [properties]);

  useEffect(() => {
    onChange &&
      onChange(rowId, {
        column: typeColumn,
        variant: variantValue,
        relationship: relationshipValue,
        dateValue: dateValue,
        value: inputValue,
      });
  }, [variantValue, relationshipValue, typeColumn, inputValue, dateValue]);

  // COMPONENT
  const columnValues = Object.keys(properties).map((key, index) => {
    return (
      <MenuItem
        value={key}
        disabled={checkIfRepeatable(key) && columns.includes(key)}
        key={index.toString()}
      >
        {properties[key].Label}
      </MenuItem>
    );
  });

  const valueComponent =
    properties[typeColumn || '']?.Type !== 'String' ||
    rows
      ?.filter(
        (row) => row.rowData?.column === rowData?.column && row.rowId !== rowId
      )
      ?.find(
        (rowDuplicate) =>
          rowDuplicate.rowData?.variant === rowData?.variant &&
          rowDuplicate.rowData?.dateValue === rowData?.dateValue
      ) ? (
      <ValueAutocompleteInput
        label={form.Value.label}
        onChange={(value: any) => {
          setInputValue(value);
        }}
        value={inputValue}
        required={!getDisabled(form.Value.name)}
        disabled={getDisabled(form.Value.name)}
        //sx={{display: getDisabled(form.Value.name) ? 'none': 'inline'}}
      />
    ) : (
      <TextField
        size='small'
        label={form.Value.label}
        {...register(form.Value.name)}
        helperText={errors.Value?.message}
        value={inputValue}
        onChange={(event: any) => setInputValue(event.target.value)}
        disabled={getDisabled(form.Value.name)}
        required={!getDisabled(form.Value.name)}
        sx={{ display: getDisabled(form.Value.name) ? 'none' : 'inline' }}
      />
    );

  return (
    <form className='column-form'>
      <FormControl fullWidth error={errors.execution} size='small'>
        <InputLabel id='inputColumnType'>{form.Column.label}</InputLabel>
        <Select
          label={form.Column.label}
          disabled={required}
          value={typeColumn}
          displayEmpty
          labelId='inputColumnType'
          id='demo-simple-select'
          size='small'
          onChange={onChangeColumn}
        >
          {columnValues}
        </Select>
        <FormHelperText>{errors.execution?.message}</FormHelperText>
      </FormControl>

      <FormControl
        required={!getDisabled(form.Relationship.name)}
        fullWidth
        error={errors.execution}
        size='small'
      >
        <InputLabel
          id='relationshipInput'
          disabled={getDisabled(form.Relationship.name)}
        >
          {form.Relationship.label}
        </InputLabel>
        <SelectValues
          category={typeColumn ? properties[typeColumn]?.Category : null}
          disabled={getDisabled(form.Relationship.name)}
          value={relationshipValue}
          onChange={onChangeRelationshipColumn}
          config={form.Relationship}
        />
        <FormHelperText>{errors.execution?.message}</FormHelperText>
      </FormControl>

      <FormControl fullWidth error={errors.execution} size='small'>
        <InputLabel
          id='demo-simple-select-label'
          disabled={getDisabled(form.Variant.name)}
        >
          {form.Variant.label}
        </InputLabel>
        <SelectValues
          category='Variant'
          disabled={getDisabled(form.Variant.name)}
          value={variantValue}
          onChange={(event: any) => setVariantValue(event.target.value)}
          config={form.Variant}
        />
        <FormHelperText>{errors.execution?.message}</FormHelperText>
      </FormControl>

      <FormControl fullWidth size='small'>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            value={dateValue}
            label={form.Date.label}
            clearable={true}
            onChange={onDatePicked}
            disabled={getDisabled(form.Date.name)}
            renderInput={(params) => (
              <TextField
                {...params}
                size='small'
                disabled={getDisabled(form.Date.name)}
              />
            )}
          />
        </LocalizationProvider>
      </FormControl>

      <FormControl fullWidth>{valueComponent}</FormControl>

      <div>
        <IconButton
          disabled={required}
          aria-label='delete'
          onClick={onClickCloseButton}
        >
          <CloseIcon />
        </IconButton>
      </div>
    </form>
  );
};
