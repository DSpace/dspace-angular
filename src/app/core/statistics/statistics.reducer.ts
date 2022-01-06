import { StatisticsAction, StatisticsActionTypes } from './statistics.action';

/**
 * Interface that represents the state of the user report state
 */
export interface UserReportState {
    reportId: string;
  }

const initialState: UserReportState = {
    reportId: null
  };

/**
 * Performs a sidebar action on the current state
 * @param {UserReportState} state The state before the action is performed
 * @param {UserReportState} action The action that should be performed
 * @returns {UserReportState} The state after the action is performed
 */
export function StatisticsReducer(state: UserReportState = initialState , action: StatisticsAction) {
    switch (action.type) {
        case StatisticsActionTypes.SET_REPORT :
            return  Object.assign({}, state,{
                reportId : action.payload.reportId
            });
        default:
            return state;
    }
}
