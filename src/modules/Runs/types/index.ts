export interface RunFormData {
  name?: string;
  execution?: string;
  maxTime?: number | string;
  tolerance?: number | string;
}

export interface Execution {
  id: string;
  name: string;
}

export interface RunDetails {
  consumption?: string;
  created?: string;
  executionid?: string;
  month?: string;
  name?: string;
  projectid?: string;
  runid?: string;
  status?: string;
  storage?: string;
  timeelapsed?: string;
  timemax?: string;
  tolerance?: string;
  usagecharge?: string;
}

export interface DatasetProfile {
  Comments?: string;
  Formula?: string;
  Id?: string;
  Name?: string;
  Rule?: string;
  Sourcefile?: string;
}

export interface StageDropDownAPIResponse {
  Stage: string;
  Name: string;
  LastRun: string;
}

export interface QuickSightResultAPIResponse {
  dashboard_url: string;
  stages: string;
  dashboard_Ids: [string, string];
}
