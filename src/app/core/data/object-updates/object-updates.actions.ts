import { type } from '../../../shared/ngrx/type';
import { Action } from '@ngrx/store';
import { Operation } from 'fast-json-patch';

export const ObjectUpdatesActionTypes = {
  ADD: type('dspace/core/object-updates/ADD'),
  APPLY: type('dspace/core/object-updates/APPLY'),
  DISCARD: type('dspace/core/object-updates/DISCARD'),
  REINSTATE: type('dspace/core/object-updates/REINSTATE'),
  REMOVE: type('dspace/core/object-updates/REMOVE'),
  REMOVE_SINGLE: type('dspace/core/object-updates/REMOVE_SINGLE'),
  REPLACE: type('dspace/core/object-updates/REPLACE')
};

/* tslint:disable:max-classes-per-file */

export class ReplaceObjectUpdatesAction implements Action {
  type = ObjectUpdatesActionTypes.REPLACE;
  payload: {
    url: string,
    operations: Operation[],
    lastModified: number
  };

  constructor(
    url: string,
    operations: Operation[],
    lastModified: number
  ) {
    this.payload = { url, operations, lastModified };
  }
}

export class AddToObjectUpdatesAction implements Action {
  type = ObjectUpdatesActionTypes.ADD;
  payload: {
    url: string,
    operation: Operation
  };

  constructor(
    url: string,
    operation: Operation) {
    this.payload = { url, operation };
  }
}

export class ApplyObjectUpdatesAction implements Action {
  type = ObjectUpdatesActionTypes.APPLY;
  payload: {
    url: string
  };

  constructor(
    url: string
  ) {
    this.payload.url = url;
  }
}

export class DiscardObjectUpdatesAction implements Action {
  type = ObjectUpdatesActionTypes.DISCARD;
  payload: {
    url: string
  };

  constructor(
    url: string
  ) {
    this.payload.url = url;
  }
}

export class ReinstateObjectUpdatesAction implements Action {
  type = ObjectUpdatesActionTypes.REINSTATE;
  payload: {
    url: string
  };

  constructor(
    url: string
  ) {
    this.payload.url = url;
  }
}

export class RemoveObjectUpdatesAction implements Action {
  type = ObjectUpdatesActionTypes.REMOVE;
  payload: {
    url: string
  };

  constructor(
    url: string
  ) {
    this.payload.url = url;
  }
}

export class RemoveSingleObjectUpdateAction implements Action {
  type = ObjectUpdatesActionTypes.REMOVE_SINGLE;
  payload: {
    url: string,
    fieldID: string
  };

  constructor(
    url: string,
    fieldID: string
  ) {
    this.payload = { url, fieldID };
  }
}

/* tslint:enable:max-classes-per-file */

/**
 * A type to encompass all RequestActions
 */
export type ObjectUpdatesAction
  = AddToObjectUpdatesAction
  | ApplyObjectUpdatesAction
  | DiscardObjectUpdatesAction
  | ReinstateObjectUpdatesAction
  | RemoveObjectUpdatesAction
  | RemoveSingleObjectUpdateAction
  | ReplaceObjectUpdatesAction;
