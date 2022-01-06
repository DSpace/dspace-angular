import { Action } from '@ngrx/store';
import { UserReportState } from './statistics.reducer';

export enum StatisticsActionTypes {
    SET_REPORT = '[STATISTICS] Set Report'
}

/**
 * Used to set the select report id
 */
export class SetReportAction implements Action {
    readonly type =  StatisticsActionTypes.SET_REPORT;
    constructor(public payload: UserReportState) {}
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type StatisticsAction = SetReportAction;
