export interface DatasetItem {
  id: string;
  [attr: string]: any;
}

export interface Schema {
  [dataset: string]: DatasetSchema;
}

export interface DatasetSchema {
  [field: string]: AttributeSchema;
}

export interface AttributeSchema {
  Category: string;
  Constant: boolean;
  ColumnType: string;
  Inherit: boolean;
  Label: string;
  Message: string;
  Model: string;
  Required: boolean;
  Subset: string;
  Type: string;
  Unit: string | Object;
  Variants: false;
  Vars: false;
}

export interface FormModel {
  Column: string;
  Key: string;
  Required: boolean;
  WithProfiles: boolean;
  Relationship: FormRequirements;
  Variant: FormRequirements;
  Date: FormRequirements;
  Value: FormRequirements;
  Unique: boolean;
}

export interface FormRequirements {
  disabled: boolean
  required: boolean
}

export interface FormItem{
    defaultCategory?: string
    required: boolean
    rowData?: rowData
    rowId: string
}

export interface rowData{
    column: string
    dateValue: string
    relationship: string
    value: string
    variant: string
}
