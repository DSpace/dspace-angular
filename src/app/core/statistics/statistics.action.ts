/* eslint-disable max-classes-per-file */

import { Action } from '@ngrx/store';
import { type } from '../../shared/ngrx/type';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const StatisticsActionTypes = {
  CLEAN_CATEGORY_REPORT: type('dspace/statistics/CLEAN_CATEGORY_REPORT'),
  SET_CATEGORY_REPORT: type('dspace/statistics/SET_CATEGORY_REPORT'),
};

/**
 * Used to set the select report id
 */
export class SetCategoryReportAction implements Action {
  readonly type = StatisticsActionTypes.SET_CATEGORY_REPORT;
  payload: {
    reportId: string;
    categoryId: string;
  };

  /**
   * Create a new SetCategoryReportAction
   *
   * @param reportId
   *    the report's ID
   * @param categoryId
   *    the category's ID
   */
  constructor(reportId: string, categoryId: string) {
    this.payload = { reportId, categoryId };
  }
}

/**
 * Used to set the select report id
 */
export class CleanCategoryReportAction implements Action {
  readonly type = StatisticsActionTypes.CLEAN_CATEGORY_REPORT;
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type StatisticsAction = SetCategoryReportAction
  | CleanCategoryReportAction;
