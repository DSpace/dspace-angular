import { Action } from '@ngrx/store';
import { type } from '../../ngrx/type';
import { ListableObject } from '../../object-collection/shared/listable-object.model';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const SelectableListActionTypes = {
  SELECT: type('dspace/selectable-lists/SELECT'),
  SELECT_SINGLE: type('dspace/selectable-lists/SELECT_SINGLE'),
  DESELECT: type('dspace/selectable-lists/DESELECT'),
  DESELECT_SINGLE: type('dspace/selectable-lists/DESELECT_SINGLE'),
  SET_SELECTION: type('dspace/selectable-lists/SET_SELECTION'),
  DESELECT_ALL: type('dspace/selectable-lists/DESELECT_ALL')
};

/* tslint:disable:max-classes-per-file */
export abstract class SelectableListAction implements Action {
  // tslint:disable-next-line:no-shadowed-variable
  constructor(public type, public id: string) {
  }
}

/**
 * Used to select an item in a the selectable list
 */
export class SelectableListSelectAction extends SelectableListAction {
  payload: ListableObject[];

  constructor(id: string, objects: ListableObject[]) {
    super(SelectableListActionTypes.SELECT, id);
    this.payload = objects;
  }
}

export class SelectableListSelectSingleAction extends SelectableListAction {
  payload: {
    object: ListableObject,
  };

  constructor(id: string, object: ListableObject) {
    super(SelectableListActionTypes.SELECT_SINGLE, id);
    this.payload = { object };
  }
}

export class SelectableListDeselectSingleAction extends SelectableListAction {
  payload: ListableObject;

  constructor(id: string, object: ListableObject) {
    super(SelectableListActionTypes.DESELECT_SINGLE, id);
    this.payload = object;
  }
}

export class SelectableListDeselectAction extends SelectableListAction {
  payload: ListableObject[];

  constructor(id: string, objects: ListableObject[]) {
    super(SelectableListActionTypes.DESELECT, id);
    this.payload = objects;
  }
}

export class SelectableListSetSelectionAction extends SelectableListAction {
  payload: ListableObject[];

  constructor(id: string, objects: ListableObject[]) {
    super(SelectableListActionTypes.SET_SELECTION, id);
    this.payload = objects;
  }
}

export class SelectableListDeselectAllAction extends SelectableListAction {
  constructor(id: string) {
    super(SelectableListActionTypes.DESELECT_ALL, id);
  }
}
/* tslint:enable:max-classes-per-file */
