import { Action } from '@ngrx/store';
import { type } from '../../shared/ngrx/type';
import { StatisticsState } from './statistics.reducer';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
 export const StatisticsActionTypes = {
    SET_CATEGORY_REPORT: type('dspace/statistics/SET_CATEGORY_REPORT'),
 };

/**
 * Used to set the select report id
 */
export class SetCategoryReportAction implements Action {
    readonly type =  StatisticsActionTypes.SET_CATEGORY_REPORT;
    constructor(public payload: StatisticsState) {}
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type StatisticsAction = SetCategoryReportAction;
