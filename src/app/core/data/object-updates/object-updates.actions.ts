import { type } from '../../../shared/ngrx/type';
import { Action } from '@ngrx/store';
import { Identifiable } from './object-updates.reducer';
import { INotification } from '../../../shared/notifications/models/notification.model';

export const ObjectUpdatesActionTypes = {
  INITIALIZE_FIELDS: type('dspace/core/cache/object-updates/INITIALIZE_FIELDS'),
  SET_EDITABLE_FIELD: type('dspace/core/cache/object-updates/SET_EDITABLE_FIELD'),
  ADD_FIELD: type('dspace/core/cache/object-updates/ADD_FIELD'),
  DISCARD: type('dspace/core/cache/object-updates/DISCARD'),
  REINSTATE: type('dspace/core/cache/object-updates/REINSTATE'),
  REMOVE: type('dspace/core/cache/object-updates/REMOVE'),
  REMOVE_FIELD: type('dspace/core/cache/object-updates/REMOVE_FIELD'),
};

/* tslint:disable:max-classes-per-file */
export enum FieldChangeType {
  UPDATE = 0,
  ADD = 1,
  REMOVE = 2
}

export class InitializeFieldsAction implements Action {
  type = ObjectUpdatesActionTypes.INITIALIZE_FIELDS;
  payload: {
    url: string,
    fields: Identifiable[],
    lastModified: Date
  };

  constructor(
    url: string,
    fields: Identifiable[],
    lastModified: Date
  ) {
    this.payload = { url, fields, lastModified };
  }
}

export class AddFieldUpdateAction implements Action {
  type = ObjectUpdatesActionTypes.ADD_FIELD;
  payload: {
    url: string,
    field: Identifiable,
    changeType: FieldChangeType,
  };

  constructor(
    url: string,
    field: Identifiable,
    changeType: FieldChangeType) {
    this.payload = { url, field, changeType };
  }
}

export class SetEditableFieldUpdateAction implements Action {
  type = ObjectUpdatesActionTypes.SET_EDITABLE_FIELD;
  payload: {
    url: string,
    uuid: string,
    editable: boolean,
  };

  constructor(
    url: string,
    fieldUUID: string,
    editable: boolean) {
    this.payload = { url, uuid: fieldUUID, editable };
  }
}

export class DiscardObjectUpdatesAction implements Action {
  type = ObjectUpdatesActionTypes.DISCARD;
  payload: {
    url: string,
    notification
  };

  constructor(
    url: string,
    notification: INotification
  ) {
    this.payload = { url, notification };
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
    this.payload = { url };
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
    this.payload = { url };
  }
}

export class RemoveFieldUpdateAction implements Action {
  type = ObjectUpdatesActionTypes.REMOVE_FIELD;
  payload: {
    url: string,
    uuid: string
  };

  constructor(
    url: string,
    uuid: string
  ) {
    this.payload = { url, uuid };
  }
}

/* tslint:enable:max-classes-per-file */

/**
 * A type to encompass all ObjectUpdatesActions
 */
export type ObjectUpdatesAction
  = AddFieldUpdateAction
  | InitializeFieldsAction
  | DiscardObjectUpdatesAction
  | ReinstateObjectUpdatesAction
  | RemoveObjectUpdatesAction
  | RemoveFieldUpdateAction;
