/**
 * The list of NameVariantAction type definitions
 */
import { type } from '../../../../ngrx/type';
import { Action } from '@ngrx/store';
import { Item } from '../../../../../core/shared/item.model';

export const NameVariantActionTypes = {
  SET_NAME_VARIANT: type('dspace/name-variant/SET_NAME_VARIANT'),
  REMOVE_NAME_VARIANT: type('dspace/name-variant/REMOVE_NAME_VARIANT'),
};

/* tslint:disable:max-classes-per-file */

export abstract class NameVariantListAction implements Action {
  type;
  payload: {
    listID: string;
    itemID: string;
  };

  constructor(listID: string, itemID: string) {
    this.payload = { listID, itemID };
  }
}

export class SetNameVariantAction extends NameVariantListAction {
  type = NameVariantActionTypes.SET_NAME_VARIANT;
  payload: {
    listID: string;
    itemID: string;
    nameVariant: string;
  };

  constructor(listID: string, itemID: string, nameVariant: string) {
    super(listID, itemID);
    this.payload.nameVariant = nameVariant;
  }
}

export class RemoveNameVariantAction extends NameVariantListAction {
  type = NameVariantActionTypes.REMOVE_NAME_VARIANT;
  constructor(listID: string, itemID: string) {
    super(listID, itemID);
  }
}
/* tslint:enable:max-classes-per-file */

/**
 * A type to encompass all RelationshipActions
 */
export type NameVariantAction
  = SetNameVariantAction
  | RemoveNameVariantAction
