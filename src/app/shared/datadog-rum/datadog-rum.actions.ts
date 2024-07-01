import { Action } from '@ngrx/store';
import { type } from '../ngrx/type';

export const DatadogRumActionTypes = {
  SET_STATUS: type('dspace/datadog-rum/SET_IS_INITIALIZED'),
};

export class setDatadogRumStatusAction implements Action {
  type = DatadogRumActionTypes.SET_STATUS;
  payload: {
    isInitialized?: boolean;
    isRunning?: boolean;
  };

  constructor(status: { isInitialized?: boolean, isRunning?: boolean }) {
    this.payload = status;
  }
}

export type DatadogRumAction = setDatadogRumStatusAction;
