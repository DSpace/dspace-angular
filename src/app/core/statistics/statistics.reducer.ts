import { StatisticsAction, StatisticsActionTypes } from './statistics.action';

/**
 * Interface that represents the state of the user report state
 */
export interface StatisticsState {
  reportId: string;
  categoryId: string;
}

const initialState: StatisticsState = {
  reportId: null,
  categoryId: null
};

/**
 * Performs a statistic action on the current state
 * @function StatisticsReducer
 * @param {StatisticsState} state The state before the action is performed
 * @param {StatisticsState} action The action that should be performed
 * @returns {StatisticsState} The state after the action is performed
 */
export function StatisticsReducer(state: StatisticsState = initialState, action: StatisticsAction) {
  switch (action.type) {
    case StatisticsActionTypes.CLEAN_CATEGORY_REPORT :
      return Object.assign({}, state, {
        reportId: null,
        categoryId: null
      });

    case StatisticsActionTypes.SET_CATEGORY_REPORT :
      return Object.assign({}, state, {
        reportId: action.payload.reportId,
        categoryId: action.payload.categoryId
      });

    default:
      return state;
  }
}
