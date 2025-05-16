import { Cursor } from "../../../common/types";

export interface Profile {
  Id: string
  Comments: string
  Formula: string
  Name: string
  Rule: string
  Sourcefile: string
  Date?: string
  Size?: number
}

export interface Profiles{
  Cursor: Cursor
  Data: Profile[]
}

export interface ProfileData{
  Id: string,
  Name: string,
  value: string,
  isFile: boolean,
  Comments: string,
  Rule: string
}

export  interface ProfileTable{
  Cursor: Cursor
  Data: ProfileData[]
}