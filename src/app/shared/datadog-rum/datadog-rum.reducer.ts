import { DatadogRumAction, DatadogRumActionTypes } from './datadog-rum.actions';

export interface DatadogRumState {
  isInitialized: boolean;
  isRunning: boolean;
}

const initialState: DatadogRumState = Object.create({isInitialized: false, isRunning: false});

export function datadogRumReducer(state = initialState, action: DatadogRumAction): DatadogRumState {

  switch (action.type) {

    case DatadogRumActionTypes.SET_STATUS: {
      return setDatadogRumStatus(state, action);
    }

    default: {
      return state;
    }
  }
}

function setDatadogRumStatus(state: DatadogRumState, action: DatadogRumAction) {
  return {
    ...state,
    ...action.payload
  };
}
