import { Action } from '@ngrx/store';

import { type } from '../../shared/ngrx/type';

export const HistoryActionTypes = {
  ADD_TO_HISTORY: type('dspace/history/ADD_TO_HISTORY'),
  GET_HISTORY: type('dspace/history/GET_HISTORY')
};

/* tslint:disable:max-classes-per-file */

export class AddUrlToHistoryAction implements Action {
  type = HistoryActionTypes.ADD_TO_HISTORY;
  payload: {
    url: string;
  };

  constructor(url: string) {
    this.payload = { url };
  }
}

/* tslint:enable:max-classes-per-file */

export type HistoryAction
  = AddUrlToHistoryAction;
