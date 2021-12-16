import { type } from '../shared/ngrx/type';
import { Action } from '@ngrx/store';

export const CorrelationIDActionTypes = {
  SET: type('dspace/core/correlationId/SET')
};

export class SetCorrelationIdAction implements Action {
  type = CorrelationIDActionTypes.SET;

  constructor(public payload: string) {
  }
}

export type CorrelationIdAction = SetCorrelationIdAction;
