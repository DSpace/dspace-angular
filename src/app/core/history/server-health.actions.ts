/* eslint-disable max-classes-per-file */
import { Action } from '@ngrx/store';

import { type } from '../../shared/ngrx/type';

export const ServerHealthActionTypes = {
  UPDATE_SERVER_HEALTH: type('dspace/server-health/UPDATE_SERVER_HEALTH'),
};


export class UpdateServerHealthAction implements Action {
  type = ServerHealthActionTypes.UPDATE_SERVER_HEALTH;
  payload: {
    isOnline: boolean;
  };

  constructor(isOnline: boolean) {
    this.payload = {isOnline};
  }
}


export type ServerHealthAction
  = UpdateServerHealthAction;
