import { Cursor } from '../../../common/types/index';

export interface AccountRun {
    runid?: number
    name?: string
    created?: string
    executionid?: string
    timemax?: number
    tolerance?: number
    status?: string
    timeelapsed?: string
    consumption?: string
    projectid: string
}

export interface AccountRuns {
    Cursor: Cursor
    Data: AccountRun[]
}