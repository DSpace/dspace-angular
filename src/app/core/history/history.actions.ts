/* eslint-disable max-classes-per-file */
import { type } from '@core/shared/ngrx/type';
import { Action } from '@ngrx/store';

export const HistoryActionTypes = {
  ADD_TO_HISTORY: type('dspace/history/ADD_TO_HISTORY'),
  GET_HISTORY: type('dspace/history/GET_HISTORY'),
};


export class AddUrlToHistoryAction implements Action {
  type = HistoryActionTypes.ADD_TO_HISTORY;
  payload: {
    url: string;
  };

  constructor(url: string) {
    this.payload = { url };
  }
}


export type HistoryAction
  = AddUrlToHistoryAction;
