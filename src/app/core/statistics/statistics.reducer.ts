import { StatisticsAction, StatisticsActionTypes } from './statistics.action';

export interface UsageReportState {
    reportId: string;
  }

const initialState: UsageReportState = {
    reportId: null
  };

export function StatisticsReducer(state: UsageReportState = initialState , action: StatisticsAction) {
    switch (action.type) {
        case StatisticsActionTypes.SET_REPORT :
            return  Object.assign({}, state,{
                reportId : action.payload.reportId
            });
        default:
            return state;
    }
}
