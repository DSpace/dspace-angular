/* eslint-disable max-classes-per-file */
import { Action } from '@ngrx/store';

import { type } from '../../shared/ngrx/type';

export const ServerStatusActionTypes = {
  UPDATE_SERVER_STATUS: type('dspace/server-status/UPDATE_SERVER_STATUS'),
};


export class UpdateServerStatusAction implements Action {
  type = ServerStatusActionTypes.UPDATE_SERVER_STATUS;
  payload: {
    isAvailable: boolean;
  };

  constructor(isAvailable: boolean) {
    this.payload = {isAvailable};
  }
}


export type ServerStatusAction
  = UpdateServerStatusAction;
