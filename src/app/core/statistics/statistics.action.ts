import { Action } from '@ngrx/store';

export enum StatisticsActionTypes {
    SET_REPORT = '[STATISTICS] Set Report'
}

interface UsageReport {
 reportId: string;
}

export class SetReportAction implements Action {
    readonly type =  StatisticsActionTypes.SET_REPORT;
    constructor(public payload: UsageReport) {}
}

export type StatisticsAction = SetReportAction;
