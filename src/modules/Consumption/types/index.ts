import { Cursor } from '../../../common/types/index';


export interface Consumption {
  consumption: string
  month: string
  usagecharge: string
}


export interface Consumptions{
  Cursor: Cursor,
  Data: Consumption[]
}

export interface MonthConsumptions{
  Cursor: Cursor,
  Data: MonthConsumption[]
}



export interface MonthConsumption {
  chargecode: string
  consumption: string
  created: string
  deletedproject: boolean
  executionid: string
  globaltol: string
  localtol: string
  month: string
  name: string
  owner: string
  projectid: string
  status: string
  timeelapsed: string
  timemax: string
  usagecharge: string
  userid: string
}