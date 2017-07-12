import { Action } from '@ngrx/store';

export class MockAction implements Action {
  type = null;
  payload: {};
}
